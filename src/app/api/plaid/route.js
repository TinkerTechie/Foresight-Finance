// app/api/plaid/route.js
import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const config = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const client = new PlaidApi(config);

// ✅ SUPPORT GET METHOD
export async function GET() {
  try {
    const tokenResponse = await client.linkTokenCreate({
      user: { client_user_id: 'user-123' },
      client_name: 'Foresight Finance',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    return Response.json({ link_token: tokenResponse.data.link_token });
  } catch (error) {
    console.error("Plaid link token error:", error.response?.data || error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}


