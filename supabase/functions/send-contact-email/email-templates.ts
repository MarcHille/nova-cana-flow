
export const getContactEmailTemplate = (name: string, email: string, pharmacyName: string, message: string, attachments: string[] = []) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .info-block { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 4px; }
    .message { background: #ffffff; padding: 15px; border-left: 4px solid #4a90e2; margin: 20px 0; }
    .attachments { margin-top: 20px; }
    .attachment-link { color: #4a90e2; text-decoration: none; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Neue Kontaktanfrage</h2>
    
    <div class="info-block">
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>E-Mail:</strong> ${email}</p>
      ${pharmacyName ? `<p><strong>Apotheke:</strong> ${pharmacyName}</p>` : ''}
    </div>
    
    <div class="message">
      <h3>Nachricht:</h3>
      <p>${message.replace(/\n/g, '<br>')}</p>
    </div>
    
    ${attachments.length > 0 ? `
    <div class="attachments">
      <h3>Anhänge:</h3>
      <ul>
        ${attachments.map((url: string) => `
          <li><a href="${url}" class="attachment-link" target="_blank">Anhang öffnen</a></li>
        `).join('')}
      </ul>
    </div>
    ` : ''}
  </div>
</body>
</html>`;

export const getConfirmationEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Vielen Dank für Ihre Anfrage</h2>
    <p>Sehr geehrte(r) ${name},</p>
    <p>wir haben Ihre Anfrage erhalten und werden uns so schnell wie möglich bei Ihnen melden.</p>
    <p>Mit freundlichen Grüßen,<br>Ihr Novacana Team</p>
  </div>
</body>
</html>`;
