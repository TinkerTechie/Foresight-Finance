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

export async function GET() {
  try {
    // 🧪 DEBUG: log env vars — remove this in production
    console.log("PLAID_CLIENT_ID:", process.env.PLAID_CLIENT_ID);
    console.log("PLAID_SECRET:", process.env.PLAID_SECRET);

    const response = await client.linkTokenCreate({
      user: {
        client_user_id: 'user-unique-id-123',
      },
      client_name: 'Foresight Finance',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });

    return new Response(JSON.stringify({ link_token: response.data.link_token }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error("❌ Error creating link token:", error?.response?.data || error.message);
    return new Response(
      JSON.stringify({ error: error?.response?.data || error.message }),
      { status: 500 }
    );
  }
}

