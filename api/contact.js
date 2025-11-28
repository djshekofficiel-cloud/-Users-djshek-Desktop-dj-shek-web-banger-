// Vercel Serverless Function pour envoyer des emails
// Utilise Web3Forms (gratuit, simple, pas besoin de clés API complexes)

module.exports = async function handler(req, res) {
  // Définir les headers JSON dès le début
  res.setHeader('Content-Type', 'application/json');
  
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
    const { nom, email, type_prestation, style, instructions, fichiers, bpm, delai, gdpr } = req.body;

    // Validation des champs obligatoires
    if (!nom || !email || !type_prestation || !instructions || !gdpr) {
      return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis' });
    }

    // Utiliser Web3Forms (gratuit, simple, pas besoin de configuration complexe)
    // La clé doit être configurée dans Vercel > Settings > Environment Variables
    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
    
    // Vérifier que la clé est configurée
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY') {
      return res.status(500).json({ 
        success: false,
        error: 'Configuration manquante',
        message: 'WEB3FORMS_ACCESS_KEY non configurée dans Vercel',
        instructions: 'Configurez WEB3FORMS_ACCESS_KEY dans Vercel > Settings > Environment Variables. Guide : https://web3forms.com'
      });
    }

    // Construire le message formaté
    let messageBody = `═══════════════════════════════════════\n`;
    messageBody += `NOUVELLE DEMANDE DE PRESTATION - DJ SHEK\n`;
    messageBody += `═══════════════════════════════════════\n\n`;

    messageBody += `📋 INFORMATIONS\n`;
    messageBody += `───────────────────────────────────────\n`;
    messageBody += `Nom / Pseudo: ${nom}\n`;
    messageBody += `Email: ${email}\n`;
    messageBody += `\n`;

    messageBody += `🎯 TYPE DE PRESTATION\n`;
    messageBody += `───────────────────────────────────────\n`;
    messageBody += `${type_prestation}\n`;
    messageBody += `\n`;

    if (style) {
      messageBody += `🎵 STYLE / RÉFÉRENCE\n`;
      messageBody += `───────────────────────────────────────\n`;
      messageBody += `${style}\n`;
      messageBody += `\n`;
    }

    messageBody += `💬 INSTRUCTIONS DÉTAILLÉES\n`;
    messageBody += `───────────────────────────────────────\n`;
    messageBody += `${instructions}\n`;
    messageBody += `\n`;

    if (fichiers) {
      messageBody += `📎 LIENS VERS FICHIERS\n`;
      messageBody += `───────────────────────────────────────\n`;
      messageBody += `${fichiers}\n`;
      messageBody += `\n`;
    }

    if (bpm) {
      messageBody += `🎚️ BPM SOUHAITÉ\n`;
      messageBody += `───────────────────────────────────────\n`;
      messageBody += `${bpm} BPM\n`;
      messageBody += `\n`;
    }

    if (delai) {
      messageBody += `⏰ DÉLAI DÉSIRÉ\n`;
      messageBody += `───────────────────────────────────────\n`;
      messageBody += `${delai}\n`;
      messageBody += `\n`;
    }

    messageBody += `═══════════════════════════════════════\n`;
    if (gdpr) messageBody += `✓ Consentement RGPD donné\n`;
    messageBody += `═══════════════════════════════════════\n`;

    const formData = {
      access_key: WEB3FORMS_ACCESS_KEY,
      subject: `[${type_prestation}] Nouvelle demande depuis djshekofficiel.com`,
      from_name: nom,
      email: email,
      message: messageBody
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

