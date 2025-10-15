// Simple Express backend to subscribe contacts to Mailjet
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: true }));
app.use(express.json());

app.post('/api/subscribe', async (req, res) => {
  try {
    console.log('Received body:', req.body);
    const { email, consent } = req.body || {};
    console.log('Email:', email, 'Consent:', consent);
    if (!email || !consent) {
      console.log('Missing fields - email:', !!email, 'consent:', !!consent);
      return res.status(400).json({ error: 'Missing fields' });
    }

    const apiKey = process.env.MAILJET_API_KEY;
    const apiSecret = process.env.MAILJET_API_SECRET;
    const listId = process.env.MAILJET_LIST_ID;
    if (!apiKey || !apiSecret || !listId) {
      return res.status(500).json({ error: 'Server not configured' });
    }

    const auth = 'Basic ' + Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');

    // Étape 1: Créer le contact (ou vérifier qu'il existe)
    const contactUrl = 'https://api.mailjet.com/v3/REST/contact';
    const contactPayload = {
      Email: email,
      Name: email.split('@')[0],
      IsExcludedFromCampaigns: false
    };
    
    let contactId = null;
    const contactResp = await fetch(contactUrl, {
      method: 'POST',
      headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
      body: JSON.stringify(contactPayload)
    });
    
    if (contactResp.ok) {
      const contactData = await contactResp.json().catch(() => ({}));
      contactId = contactData?.Data?.[0]?.ID;
      console.log(`Contact créé: ${email} (ID: ${contactId})`);
    } else {
      const errorData = await contactResp.json().catch(() => ({}));
      
      // Si le contact existe déjà, récupérer son ID
      if (errorData.ErrorMessage && errorData.ErrorMessage.includes('already exists')) {
        console.log(`Contact existant: ${email}, récupération de l'ID...`);
        const getContactResp = await fetch(`https://api.mailjet.com/v3/REST/contact/${email}`, {
          method: 'GET',
          headers: { 'Authorization': auth }
        });
        
        if (getContactResp.ok) {
          const existingContact = await getContactResp.json().catch(() => ({}));
          contactId = existingContact?.Data?.[0]?.ID;
          console.log(`Contact ID récupéré: ${contactId}`);
        }
        
        // Vérifier s'il est déjà dans la liste
        if (contactId) {
          const checkListResp = await fetch(`https://api.mailjet.com/v3/REST/contact/${contactId}/getcontactslists`, {
            method: 'GET',
            headers: { 'Authorization': auth }
          });
          
          if (checkListResp.ok) {
            const listsData = await checkListResp.json().catch(() => ({}));
            const isInList = listsData?.Data?.some(list => list.ListID === parseInt(listId));
            
            if (isInList) {
              return res.status(409).json({ 
                error: 'EMAIL_EXISTS',
                message: 'Cet email a déjà bénéficié de l\'offre'
              });
            }
          }
        } else {
          return res.status(500).json({ 
            error: 'CONTACT_NOT_FOUND',
            message: 'Impossible de récupérer les informations du contact'
          });
        }
      } else {
        console.error('Erreur Mailjet:', errorData);
        return res.status(400).json({ 
          error: 'MAILJET_ERROR', 
          message: 'Erreur lors de la création du contact',
          detail: errorData.ErrorMessage || 'Erreur inconnue'
        });
      }
    }

    // Étape 2: Ajouter le contact à la liste spécifique
    if (contactId && listId) {
      const addToListUrl = `https://api.mailjet.com/v3/REST/contactslist/${listId}/managecontact`;
      const listPayload = {
        Email: email,
        Name: email.split('@')[0],
        Action: "addnoforce", // N'ajoute que si pas déjà présent
        Properties: {}
      };
      
      const listResp = await fetch(addToListUrl, {
        method: 'POST',
        headers: { 'Authorization': auth, 'Content-Type': 'application/json' },
        body: JSON.stringify(listPayload)
      });
      
      if (listResp.ok) {
        const listData = await listResp.json().catch(() => ({}));
        console.log(`Contact ajouté à la liste ${listId}: ${email}`);
        return res.json({ success: true, mailjet: listData });
      } else {
        const listError = await listResp.json().catch(() => ({}));
        console.error('Erreur ajout à la liste:', listError);
        // On considère quand même le succès car le contact existe
        return res.json({ success: true, warning: 'Contact créé mais erreur lors de l\'ajout à la liste' });
      }
    }
    
    return res.json({ success: true });
  } catch (err) {
    console.error('Server exception:', err);
    return res.status(500).json({ error: 'Server error', detail: err?.message });
  }
});


app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(PORT, () => {
  console.log(`Mailjet backend listening on http://localhost:${PORT}`);
});


