
export const getPharmacyVerificationRequestTemplate = (
  name: string,
  redirectTo: string
) => {
  return `
    <!DOCTYPE html>
    <html lang="de">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Apothekenverifizierung - Novacana</title>
      <style>
        body {
          font-family: 'Inter', Arial, sans-serif;
          line-height: 1.6;
          color: #403E43;
          margin: 0;
          padding: 0;
          background: #f5f5f7;
        }
        .header {
          background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%);
          padding: 40px 20px;
          text-align: center;
        }
        .header img {
          max-width: 200px;
          margin-bottom: 15px;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background: white;
          border-radius: 12px;
          box-shadow: 0 4px 25px rgba(0, 0, 0, 0.1);
          padding: 40px;
          margin-top: -30px;
          position: relative;
          z-index: 10;
        }
        h1 {
          color: #1c3e31;
          font-size: 28px;
          margin-bottom: 25px;
          text-align: center;
          font-weight: 700;
          background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        p {
          color: #403E43;
          font-size: 16px;
          margin-bottom: 20px;
          line-height: 1.6;
        }
        .info-box {
          background-color: #f8f9fa;
          border-left: 4px solid #9b87f5;
          padding: 20px;
          margin: 25px 0;
          border-radius: 6px;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .info-box p {
          margin-top: 0;
          margin-bottom: 10px;
          font-weight: 600;
        }
        ul {
          margin: 15px 0;
          padding-left: 20px;
        }
        li {
          margin-bottom: 12px;
          padding-left: 5px;
        }
        ol {
          counter-reset: item;
          padding-left: 0;
          margin: 25px 0;
        }
        ol li {
          display: block;
          margin-bottom: 18px;
          position: relative;
          padding-left: 40px;
        }
        ol li:before {
          content: counter(item) "";
          counter-increment: item;
          position: absolute;
          left: 0;
          top: 0;
          background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%);
          color: white;
          font-weight: bold;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          box-shadow: 0 3px 8px rgba(126, 105, 171, 0.3);
        }
        .button-container {
          text-align: center;
          margin: 35px 0;
        }
        .button {
          background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%);
          color: white !important;
          text-decoration: none;
          padding: 16px 32px;
          border-radius: 30px;
          font-weight: 600;
          font-size: 16px;
          display: inline-block;
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          box-shadow: 0 4px 15px rgba(126, 105, 171, 0.3);
        }
        .button:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(126, 105, 171, 0.4);
        }
        .footer {
          text-align: center;
          padding: 30px 20px;
          color: #777;
          font-size: 14px;
          background: #f8f9fa;
          border-radius: 0 0 12px 12px;
          margin-top: 20px;
        }
        .social-links {
          margin: 20px 0;
        }
        .social-links a {
          margin: 0 10px;
          color: #7E69AB;
          text-decoration: none;
          font-weight: 500;
          transition: color 0.2s ease;
        }
        .social-links a:hover {
          color: #9b87f5;
        }
        .note {
          background: #fff8e1;
          border-left: 4px solid #ffca28;
          padding: 15px;
          margin: 25px 0;
          border-radius: 6px;
          font-size: 15px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://jrvhqkilzxopesfmpjbz.supabase.co/storage/v1/object/public/public/novacana-logo.png" alt="Novacana Logo">
      </div>
      
      <div class="container">
        <h1>Verifizieren Sie Ihre Apotheke</h1>
        
        <p>Sehr geehrte(r) ${name},</p>
        
        <p>wir freuen uns, dass Sie sich für den Verifizierungsprozess interessieren. Um Ihre Apotheke zu verifizieren und Zugang zu allen Funktionen zu erhalten, benötigen wir einige Dokumente von Ihnen.</p>
        
        <div class="info-box">
          <p><strong>Benötigte Unterlagen:</strong></p>
          <ul>
            <li>Apothekenbetriebserlaubnis</li>
            <li>Handelsregisterauszug (falls vorhanden)</li>
            <li>Identitätsnachweis des verantwortlichen Apothekers</li>
          </ul>
        </div>
        
        <p>Der Verifizierungsprozess ist einfach und wird in wenigen Schritten abgeschlossen:</p>
        
        <ol>
          <li>Loggen Sie sich in Ihr Dashboard ein</li>
          <li>Laden Sie die benötigten Dokumente hoch</li>
          <li>Füllen Sie das Verifizierungsformular aus</li>
          <li>Warten Sie auf die Bestätigung unseres Teams</li>
        </ol>
        
        <div class="note">
          <strong>Wichtiger Hinweis:</strong> Falls Sie sich noch nicht bei uns registriert haben, nutzen Sie bitte den folgenden Link, um sich zunächst zu registrieren. Danach können Sie mit der Verifizierung fortfahren.
        </div>
        
        <div class="button-container">
          <a href="${redirectTo}" class="button">
            Zum Dashboard
          </a>
        </div>
        
        <p>Nach erfolgreicher Prüfung Ihrer Dokumente erhalten Sie vollen Zugriff auf alle Funktionen für Apotheken.</p>
        
        <p>Bei Fragen stehen wir Ihnen jederzeit zur Verfügung.</p>
        
        <p>Mit freundlichen Grüßen,<br>Ihr Novacana Team</p>
      </div>
      
      <div class="footer">
        <div class="social-links">
          <a href="#">LinkedIn</a> • 
          <a href="#">Instagram</a> • 
          <a href="#">Facebook</a>
        </div>
        <p>© ${new Date().getFullYear()} Novacana GmbH. Großhandelserlaubnis Nr. DE-HE-WDA_2019_0077</p>
        <p>Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
      </div>
    </body>
    </html>
  `;
};

