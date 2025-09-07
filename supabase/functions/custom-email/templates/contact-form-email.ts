import { commonStyles, generateFooter } from '../styles/email-styles.ts';

export const getContactFormEmailTemplate = (name: string, email: string, pharmacyName: string, message: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Neue Kontaktanfrage - Novacana</title>
  <style>${commonStyles}</style>
</head>
<body>
  <div class="header">
    <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo">
  </div>
  
  <div class="container">
    <h1>📬 Neue Kontaktanfrage</h1>
    
    <div class="info-section">
      <h2>Kontaktdetails</h2>
      <div class="info-item">
        <div class="label">Name:</div>
        <div class="value">${name}</div>
      </div>
      <div class="info-item">
        <div class="label">E-Mail:</div>
        <div class="value">${email}</div>
      </div>
      ${pharmacyName ? `
      <div class="info-item">
        <div class="label">Apotheke:</div>
        <div class="value">${pharmacyName}</div>
      </div>
      ` : ''}
    </div>
    
    <h2>Nachricht:</h2>
    <div class="message-box">
      ${message.replace(/\n/g, '<br>')}
    </div>
  </div>
  
  ${generateFooter()}
</body>
</html>
`;
