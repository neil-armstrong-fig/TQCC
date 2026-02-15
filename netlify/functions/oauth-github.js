const https = require('https');

exports.handler = async (event) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // Get OAuth code from query params
  const { code } = event.queryStringParameters || {};

  if (!code) {
    return {
      statusCode: 400,
      headers,
      body: JSON.stringify({ error: 'Missing authorization code' })
    };
  }

  const clientId = process.env.OAUTH_GITHUB_CLIENT_ID;
  const clientSecret = process.env.OAUTH_GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'OAuth credentials not configured' })
    };
  }

  // Exchange code for access token
  const tokenData = JSON.stringify({
    client_id: clientId,
    client_secret: clientSecret,
    code: code
  });

  const options = {
    hostname: 'github.com',
    path: '/login/oauth/access_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Content-Length': tokenData.length
    }
  };

  return new Promise((resolve) => {
    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);

          if (response.error) {
            resolve({
              statusCode: 401,
              headers,
              body: JSON.stringify({ error: response.error })
            });
          } else {
            // Return token in the format expected by Sveltia CMS
            resolve({
              statusCode: 200,
              headers,
              body: JSON.stringify({
                token: response.access_token,
                provider: 'github'
              })
            });
          }
        } catch (error) {
          resolve({
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: 'Failed to parse response' })
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: error.message })
      });
    });

    req.write(tokenData);
    req.end();
  });
};
