export default async (req) => {
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
    }

    const { email, consent } = await req.json();
    if (!email || !consent) {
      return new Response(JSON.stringify({ error: 'Missing fields' }), { status: 400 });
    }

    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;
    const listId = process.env.MAILJET_LIST_ID;
    if (!apiKey || !apiSecret || !listId) {
      return new Response(JSON.stringify({ error: 'Server not configured' }), { status: 500 });
    }

    const auth = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
    
    // Generate name from email (before @)
    const name = email.split('@')[0];

    // Create contact
    const contactRes = await fetch('https://api.mailjet.com/v3/REST/contact', {
      method: 'POST',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({ Email: email, Name: name })
    });

    let contactId = null;
    if (contactRes.ok) {
      const contactData = await contactRes.json();
      contactId = contactData.Data[0].ID;
      console.log(`Contact créé: ${email} (ID: ${contactId})`);
    } else if (contactRes.status === 400) {
      const errorData = await contactRes.json();
      if (errorData.ErrorMessage && errorData.ErrorMessage.includes('already exists')) {
        // Contact exists, get its ID
        const searchRes = await fetch(`https://api.mailjet.com/v3/REST/contact/${email}`, {
          headers: { 'Authorization': auth }
        });
        if (searchRes.ok) {
          const searchData = await searchRes.json();
          contactId = searchData.Data[0].ID;
          console.log(`Contact existant: ${email} (ID: ${contactId})`);
        }
      } else {
        const errorText = await contactRes.text();
        return new Response(JSON.stringify({ error: 'Contact creation failed', detail: errorText }), { status: 400 });
      }
    } else {
      const errorText = await contactRes.text();
      return new Response(JSON.stringify({ error: 'Contact creation failed', detail: errorText }), { status: 400 });
    }

    // Add contact to list
    const listRes = await fetch(`https://api.mailjet.com/v3/REST/contactslist/${parseInt(listId, 10)}/managecontact`, {
      method: 'POST',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        Action: 'addforce',
        Email: email,
        Name: name
      })
    });

    if (!listRes.ok) {
      const errorText = await listRes.text();
      return new Response(JSON.stringify({ error: 'List subscription failed', detail: errorText }), { status: 400 });
    }

    console.log(`Contact ajouté à la liste ${listId}: ${email}`);
    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (e) {
    console.error('Error:', e);
    return new Response(JSON.stringify({ error: 'Server error', detail: e?.message }), { status: 500 });
  }
}




