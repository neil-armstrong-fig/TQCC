const https = require('https');

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
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

  const { code, scope } = event.queryStringParameters || {};

  // Step 1: No code yet — redirect to GitHub's OAuth authorization page
  if (!code) {
    const oauthScope = scope || 'repo,user';
    const siteUrl = process.env.URL || 'https://stirring-baklava-d1133c.netlify.app';
    const redirectUri = `${siteUrl}/.netlify/functions/oauth-github`;
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=${oauthScope}&redirect_uri=${encodeURIComponent(redirectUri)}`;

    return {
      statusCode: 302,
      headers: { ...headers, Location: authUrl },
      body: ''
    };
  }

  // Step 2: GitHub redirected back with a code — exchange it for an access token
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
              statusCode: 200,
              headers: { 'Content-Type': 'text/html' },
              body: getScript('error', { msg: response.error_description || response.error })
            });
          } else {
            resolve({
              statusCode: 200,
              headers: { 'Content-Type': 'text/html' },
              body: getScript('success', { token: response.access_token, provider: 'github' })
            });
          }
        } catch (error) {
          resolve({
            statusCode: 200,
            headers: { 'Content-Type': 'text/html' },
            body: getScript('error', { msg: 'Failed to parse response from GitHub' })
          });
        }
      });
    });

    req.on('error', (error) => {
      resolve({
        statusCode: 200,
        headers: { 'Content-Type': 'text/html' },
        body: getScript('error', { msg: error.message })
      });
    });

    req.write(tokenData);
    req.end();
  });
};

// Returns HTML that sends a postMessage back to the CMS popup opener window
function getScript(status, content) {
  return `<!DOCTYPE html>
<html>
<body>
<script>
(function() {
  function sendMessage(message) {
    var target = window.opener || window.parent;
    target.postMessage(message, '*');
  }
  sendMessage('authorization:github:${status}:${JSON.stringify(content)}');
})();
</script>
</body>
</html>`;
}
