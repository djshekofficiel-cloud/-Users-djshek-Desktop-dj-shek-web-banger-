// Vercel Serverless Function pour envoyer des emails
// Nécessite une clé API d'un service d'email (Resend, SendGrid, etc.)

export default async function handler(req, res) {
  // Vérifier que c'est une requête POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { firstName, lastName, email, serviceType, message } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !serviceType || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }

    // Ici, vous pouvez utiliser un service d'email comme :
    // - Resend (recommandé, gratuit jusqu'à 3000 emails/mois)
    // - SendGrid
    // - Nodemailer avec Gmail SMTP
    
    // Exemple avec Resend (à configurer) :
    /*
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
      },
      body: JSON.stringify({
        from: 'Contact <contact@djshekofficiel.com>',
        to: ['djshekofficiel@gmail.com'],
        subject: `Nouveau message - ${serviceType}`,
        html: `
          <h2>Nouveau message depuis djshekofficiel.com</h2>
          <p><strong>Nom:</strong> ${firstName} ${lastName}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Service:</strong> ${serviceType}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, '<br>')}</p>
        `
      })
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'envoi');
    }
    */

    // Pour l'instant, retourner un succès (à remplacer par l'appel API réel)
    return res.status(200).json({ 
      success: true, 
      message: 'Email envoyé avec succès' 
    });

  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({ 
      error: 'Erreur lors de l\'envoi de l\'email' 
    });
  }
}

