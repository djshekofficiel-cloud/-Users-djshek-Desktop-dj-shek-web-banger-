// Vercel Serverless Function pour envoyer des emails
// Utilise Web3Forms (gratuit, simple, pas besoin de clés API complexes)

export default async function handler(req, res) {
  // Autoriser CORS
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
    const { firstName, lastName, email, serviceType, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !serviceType || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Utiliser Web3Forms (gratuit, simple, pas besoin de configuration complexe)
    // Remplacez YOUR_ACCESS_KEY par votre clé Web3Forms (gratuite)
    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY || 'YOUR_ACCESS_KEY';

    const formData = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `Nouveau message depuis djshekofficiel.com - ${serviceType}`,
      from_name: `${firstName} ${lastName}`,
      email: email,
      to_email: 'djshekofficiel@gmail.com',
      message: `
Bonjour DJ SHEK,

Vous avez reçu un nouveau message depuis votre site web djshekofficiel.com.

---
INFORMATIONS DU CLIENT
---
Nom : ${firstName} ${lastName}
Email : ${email}
Type de service : ${serviceType}

---
MESSAGE
---
${message}

---
Ce message a été envoyé depuis le formulaire de contact de djshekofficiel.com
      `.trim()
    };

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Email envoyé avec succès' 
      });
    } else {
      throw new Error(data.message || 'Erreur lors de l\'envoi');
    }

  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de l\'email',
      details: error.message 
    });
  }
}

