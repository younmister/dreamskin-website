export default async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const { email, name, consent } = await req.json();
    if (!email || !name || !consent) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;
    const listId = process.env.MAILJET_LIST_ID;
    if (!apiKey || !apiSecret || !listId) {
      return new Response(JSON.stringify({ error: 'Server not configured' }), { status: 500 });
    }

    const auth = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    // Create or update contact
    const contactRes = await fetch('https://api.mailjet.com/v3/REST/contact', {
      method: 'POST',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email, Name: name })
    });

    if (!contactRes.ok && contactRes.status !== 400) {
      const t = await contactRes.text();
      return new Response(JSON.stringify({ error: 'Contact error', detail: t }), { status: 400 });
    }

    // Subscribe contact to list
    const listRes = await fetch('https://api.mailjet.com/v3/REST/listrecipient', {
      method: 'POST',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ IsUnsubscribed: 'false', ListID: parseInt(listId, 10), Email: email })
    });

    if (!listRes.ok && listRes.status !== 400) {
      const t = await listRes.text();
      return new Response(JSON.stringify({ error: 'List subscribe error', detail: t }), { status: 400 });
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Server error', detail: e?.message }), { status: 500 });
  }
}




