import { commonStyles, generateFooter } from '../styles/email-styles.ts';

export const getResetPasswordEmailTemplate = (resetURL: string) => `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Passwort zurücksetzen für Ihren Novacana-Zugang</title>
  <style>${commonStyles}</style>
</head>
<body>
  <div class="header">
    <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo">
  </div>
  
  <div class="container">
    <h1>Passwort zurücksetzen</h1>
    
    <p>Sie haben eine Anfrage zum Zurücksetzen Ihres Passworts gestellt. Klicken Sie auf den untenstehenden Button, um ein neues Passwort festzulegen.</p>
    
    <div style="text-align: center;">
      <a href="${resetURL}" class="button">Neues Passwort festlegen</a>
    </div>
    
    <div class="warning-box">
      <p><strong>Wichtiger Hinweis:</strong></p>
      <p>Falls Sie diese Anfrage nicht gestellt haben, können Sie diese E-Mail ignorieren oder uns kontaktieren, wenn Sie Fragen haben.</p>
      <p>Der Link ist aus Sicherheitsgründen nur für begrenzte Zeit gültig.</p>
    </div>
  </div>
  
  ${generateFooter()}
</body>
</html>
`;
