import { commonStyles, generateFooter } from '../styles/email-styles.ts';

export const getPharmacyVerificationTemplate = (
  email: string, 
  status: string, 
  verificationId?: string, 
  reason?: string
) => {
  if (status === "approved") {
    return `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ihre Apotheken-Verifizierung wurde genehmigt - Novacana</title>
        <style>${commonStyles}</style>
      </head>
      <body>
        <div class="header">
          <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo">
        </div>
        
        <div class="container">
          <h1>Ihre Apotheke wurde verifiziert! 🎉</h1>
          
          <p>Herzlichen Glückwunsch, Ihre Apotheke wurde erfolgreich verifiziert. Sie haben nun vollen Zugriff auf unsere Plattform und können alle Funktionen nutzen.</p>
          
          <div class="success-box">
            <p><strong>Was bedeutet das für Sie?</strong></p>
            <ul>
              <li>Sie können jetzt auf unseren kompletten Produktkatalog zugreifen</li>
              <li>Sie können Produkte bestellen und verwalten</li>
              <li>Sie haben Zugang zu exklusiven Inhalten und Angeboten</li>
            </ul>
          </div>
          
          <div style="text-align: center;">
            <a href="https://novacana.de/products" class="button">Zum Produktkatalog</a>
          </div>
          
          <p>Haben Sie Fragen? Unser Team steht Ihnen jederzeit zur Verfügung.</p>
        </div>
        
        ${generateFooter()}
      </body>
      </html>
    `;
  } else {
    return `
      <!DOCTYPE html>
      <html lang="de">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Update zu Ihrer Apotheken-Verifizierung - Novacana</title>
        <style>${commonStyles}</style>
      </head>
      <body>
        <div class="header">
          <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo">
        </div>
        
        <div class="container">
          <h1>Update zu Ihrer Apotheken-Verifizierung</h1>
          
          <p>Vielen Dank für Ihr Interesse an Novacana. Wir haben Ihre Verifizierungsanfrage geprüft und benötigen weitere Informationen.</p>
          
          <div class="info-box">
            <p><strong>Begründung:</strong></p>
            <p>${reason || "Leider konnten wir Ihre Apotheke mit den bereitgestellten Informationen nicht vollständig verifizieren."}</p>
          </div>
          
          <p>Bitte nehmen Sie Kontakt mit unserem Support-Team auf, damit wir Ihnen bei der erfolgreichen Verifizierung helfen können.</p>
          
          <div style="text-align: center;">
            <a href="mailto:info@novacana.de?subject=Rückfrage%20zur%20Verifizierung%20${verificationId || ''}" class="button">Support kontaktieren</a>
          </div>
          
          <p>Wir stehen Ihnen jederzeit zur Verfügung und freuen uns darauf, Sie bald als Partnerapotheke begrüßen zu dürfen.</p>
        </div>
        
        ${generateFooter()}
      </body>
      </html>
    `;
  }
};
