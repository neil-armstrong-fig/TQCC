export interface DonationTotal {
  amount: number;
  giftAid: number;
  asOf: Date;
  live: boolean;
}

const CAMPAIGN_ID = "adf2b642-0a59-47a2-a133-a8852e8b3e6c";
const ENDPOINT = `https://api.givestar.io/api/v1/FRP/${CAMPAIGN_ID}/DonationTotal`;

// Used if the Givestar API is unreachable at build time.
const FALLBACK: DonationTotal = {
  amount: 2255.73,
  giftAid: 209.08,
  asOf: new Date("2026-09-23"),
  live: false,
};

// Fetches the campaign total at build time. Never throws, so an API outage
// can't break the build.
export async function getDonationTotal(): Promise<DonationTotal> {
  try {
    const res = await fetch(ENDPOINT, { signal: AbortSignal.timeout(10_000) });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (typeof data.amount !== "number") throw new Error("Unexpected response");
    return { amount: data.amount, giftAid: Number(data.giftAidAmount) || 0, asOf: new Date(), live: true };
  } catch (err) {
    console.warn(`[givestar] Using fallback donation total: ${err}`);
    return FALLBACK;
  }
}
