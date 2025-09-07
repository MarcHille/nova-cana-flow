
import { commonStyles, generateFooter } from '../styles/email-styles.ts';

export const getConfirmationEmailTemplate = (confirmationURL: string, name: string = '') => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bestätigen Sie Ihre Registrierung bei Novacana</title>
  <style>${commonStyles}</style>
</head>
<body>
  <div class="header">
    <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo">
  </div>
  
  <div class="container">
    <h1>Willkommen bei Novacana${name ? ', ' + name : ''}! 🌿</h1>
    
    <p>Schön, dass Sie Teil unserer medizinischen Cannabis-Community werden möchten. Nur noch ein kleiner Schritt trennt Sie von Ihrem Zugang zu unserer Plattform.</p>
    
    <div style="text-align: center; margin: 30px 0;">
      <a href="${confirmationURL}" class="button" style="background-color: #4a7b57; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">E-Mail-Adresse bestätigen</a>
    </div>
    
    <p>Falls der Button nicht funktioniert, können Sie auch diesen Link in Ihrem Browser einfügen:</p>
    <p style="word-break: break-all; background-color: #f5f5f5; padding: 10px; border-radius: 4px; font-size: 12px;">${confirmationURL}</p>
    
    <div class="info-box">
      <p><strong>Als verifiziertes Mitglied erhalten Sie:</strong></p>
      <ul>
        <li>Zugang zu unserem exklusiven Produktkatalog</li>
        <li>Aktuelle Informationen über medizinisches Cannabis</li>
        <li>Persönliche Beratung und Support</li>
      </ul>
    </div>
    
    <p style="text-align: center;">Haben Sie Fragen? Wir sind für Sie da!</p>
  </div>
  
  ${generateFooter()}
</body>
</html>
`;
