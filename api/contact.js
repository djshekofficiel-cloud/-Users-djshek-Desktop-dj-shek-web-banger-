// Vercel Serverless Function pour envoyer des emails
// Utilise Web3Forms (gratuit, simple, pas besoin de clés API complexes)

module.exports = async function handler(req, res) {
  // Définir les headers JSON dès le début pour éviter les erreurs de parsing
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  
  // Autoriser CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Vérifier que c'est une requête POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false,
      error: 'Method not allowed',
      message: 'Seules les requêtes POST sont autorisées'
    });
  }

  try {
    // Parser le body de la requête
    let body = req.body;
    
    // Si le body est une string, essayer de le parser
    if (typeof body === 'string') {
      try {
        body = JSON.parse(body);
      } catch (e) {
        return res.status(400).json({ 
          success: false,
          error: 'Invalid JSON',
          message: 'Le corps de la requête doit être du JSON valide'
        });
      }
    }

    const { nom, email, type_prestation, style, instructions, fichiers, bpm, delai, gdpr } = body;

    // Validation des champs obligatoires
    if (!nom || !email || !type_prestation || !instructions || !gdpr) {
      return res.status(400).json({ 
        success: false,
        error: 'Champs manquants',
        message: 'Tous les champs obligatoires doivent être remplis'
      });
    }

    // Utiliser Web3Forms (gratuit, simple, pas besoin de configuration complexe)
    // La clé doit être configurée dans Vercel > Settings > Environment Variables
    const WEB3FORMS_ACCESS_KEY = process.env.WEB3FORMS_ACCESS_KEY;
    
    // Vérifier que la clé est configurée
    if (!WEB3FORMS_ACCESS_KEY || WEB3FORMS_ACCESS_KEY === 'YOUR_ACCESS_KEY') {
      console.error('WEB3FORMS_ACCESS_KEY non configurée');
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

    // Appeler l'API Web3Forms avec timeout
    let web3Response;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 secondes timeout
      
      web3Response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(formData),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('Le service d\'envoi a pris trop de temps à répondre. Veuillez réessayer.');
      } else if (fetchError.message.includes('fetch')) {
        throw new Error('Impossible de contacter le service d\'envoi. Vérifiez votre connexion internet.');
      } else {
        throw new Error(`Erreur réseau: ${fetchError.message}`);
      }
    }

    // Vérifier le statut HTTP
    if (!web3Response.ok) {
      const errorText = await web3Response.text().catch(() => 'Erreur inconnue');
      console.error('Web3Forms erreur HTTP:', web3Response.status, errorText);
      throw new Error(`Erreur serveur (${web3Response.status}). Veuillez réessayer.`);
    }

    // Vérifier que la réponse est du JSON
    const contentType = web3Response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      const text = await web3Response.text();
      console.error('Web3Forms a retourné une réponse non-JSON:', text.substring(0, 200));
      throw new Error(`Erreur de format de réponse. Veuillez réessayer.`);
    }

    let data;
    try {
      data = await web3Response.json();
    } catch (jsonError) {
      console.error('Erreur parsing JSON Web3Forms:', jsonError);
      throw new Error('Erreur de traitement de la réponse. Veuillez réessayer.');
    }

    if (data.success) {
      return res.status(200).json({ 
        success: true, 
        message: 'Email envoyé avec succès' 
      });
    } else {
      // Gérer les erreurs spécifiques de Web3Forms
      const errorMsg = data.message || 'Erreur lors de l\'envoi via Web3Forms';
      console.error('Web3Forms erreur:', errorMsg, data);
      
      // Messages d'erreur plus clairs selon le type d'erreur
      if (errorMsg.includes('access_key') || errorMsg.includes('invalid')) {
        throw new Error('Erreur de configuration. Veuillez contacter le support.');
      } else if (errorMsg.includes('rate limit') || errorMsg.includes('quota')) {
        throw new Error('Trop de tentatives. Veuillez patienter quelques minutes avant de réessayer.');
      } else {
        throw new Error(errorMsg);
      }
    }

  } catch (error) {
    console.error('Erreur dans /api/contact:', error);
    
    // Messages d'erreur plus spécifiques
    let errorMessage = 'Une erreur inattendue s\'est produite';
    let errorDetails = error.message || '';
    
    if (error.message.includes('fetch')) {
      errorMessage = 'Impossible de contacter le service d\'envoi d\'email. Vérifiez votre connexion internet.';
    } else if (error.message.includes('JSON')) {
      errorMessage = 'Erreur de format de données. Veuillez réessayer.';
    } else if (error.message.includes('timeout')) {
      errorMessage = 'Le service d\'envoi a pris trop de temps à répondre. Veuillez réessayer.';
    } else if (error.message) {
      errorMessage = error.message;
    }
    
    return res.status(500).json({ 
      success: false,
      error: 'Erreur lors de l\'envoi de l\'email',
      message: errorMessage,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
