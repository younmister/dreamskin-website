export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, hp } = req.body || {};
    
    // Honeypot anti-bot
    if (hp) {
      return res.status(200).json({ ok: true });
    }
    
    // Validation email
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'Email invalide' });
    }

    // Vérifier que les variables d'environnement existent
    if (!process.env.MAILJET_API_KEY || !process.env.MAILJET_API_SECRET || !process.env.MAILJET_LIST_ID) {
      console.error('Missing Mailjet environment variables');
      return res.status(500).json({ error: 'Configuration error' });
    }

    // Authentification Mailjet
    const basic = Buffer.from(`${process.env.MAILJET_API_KEY}:${process.env.MAILJET_API_SECRET}`).toString('base64');

    // Appel API Mailjet
    const response = await fetch(
      `https://api.mailjet.com/v3/REST/contactslist/${process.env.MAILJET_LIST_ID}/managecontact`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${basic}`
        },
        body: JSON.stringify({
          Email: email,
          Action: 'addnoforce'
        })
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Mailjet error:', errorText);
      return res.status(response.status).json({ error: 'Erreur lors de l\'inscription' });
    }

    return res.status(200).json({ ok: true });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({ error: 'Erreur serveur' });
  }
}
