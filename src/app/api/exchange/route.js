// /src/app/api/exchange/route.js
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

export async function POST(req) {
  try {
    const body = await req.json();
    const { public_token } = body;

    if (!public_token) {
      return new Response(JSON.stringify({ error: "Missing public_token" }), {
        status: 400,
      });
    }

    // Exchange public_token for access_token
    const tokenResponse = await client.itemPublicTokenExchange({ public_token });
    const access_token = tokenResponse.data.access_token;

    // Fetch transactions
    const transactionsResponse = await client.transactionsGet({
      access_token,
      start_date: '2024-01-01',
      end_date: '2024-07-01',
      options: {
        count: 50,
      },
    });

    const raw = transactionsResponse.data.transactions;

    // Format to match frontend structure
    const transactions = raw.map((t) => ({
      name: t.name,
      date: t.date,
      amount: Math.abs(t.amount), // Remove negative sign
      transaction_type: t.amount < 0 ? "debit" : "credit",
    }));

    return new Response(JSON.stringify({ transactions }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error("❌ Error in /api/exchange:", err?.response?.data || err.message);
    return new Response(
      JSON.stringify({ error: err?.response?.data || err.message }),
      { status: 500 }
    );
  }
}




