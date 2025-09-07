
export const commonStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap');
  
  body {
    font-family: 'Inter', Arial, sans-serif;
    line-height: 1.6;
    color: #403E43;
    margin: 0;
    padding: 0;
    background: linear-gradient(135deg, #f5f3ff 0%, #ffffff 100%);
  }
  .header {
    background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%);
    padding: 40px 20px;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
  .header img {
    max-width: 200px;
    margin-bottom: 20px;
    transition: transform 0.3s ease;
  }
  .container {
    max-width: 600px;
    margin: 0 auto;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.98) 100%);
    border-radius: 24px;
    box-shadow: 0 10px 30px rgba(126, 105, 171, 0.08);
    padding: 40px;
    margin-top: -40px;
    position: relative;
    z-index: 10;
    border: 1px solid rgba(155, 135, 245, 0.1);
  }
  h1 {
    font-family: 'Montserrat', sans-serif;
    color: #1c3e31;
    font-size: 28px;
    margin-bottom: 24px;
    text-align: center;
    background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    font-weight: 700;
    letter-spacing: -0.025em;
  }
  p {
    color: #403E43;
    font-size: 16px;
    margin-bottom: 20px;
    line-height: 1.6;
  }
  .button {
    display: inline-block;
    background: linear-gradient(135deg, #9b87f5 0%, #7E69AB 100%);
    color: white !important;
    text-decoration: none;
    padding: 16px 32px;
    border-radius: 30px;
    font-weight: 600;
    margin: 30px auto;
    text-align: center;
    transition: all 0.3s ease;
    box-shadow: 0 4px 15px rgba(126, 105, 171, 0.3);
    font-family: 'Inter', sans-serif;
  }
  .button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(126, 105, 171, 0.4);
  }
  .footer {
    text-align: center;
    padding: 30px 0;
    color: #666;
    font-size: 14px;
  }
  .social-links {
    margin: 20px 0;
    text-align: center;
  }
  .social-links a {
    margin: 0 10px;
    color: #7E69AB;
    text-decoration: none;
    transition: color 0.3s;
    font-weight: 500;
  }
  .social-links a:hover {
    color: #9b87f5;
  }
`;

export const generateFooter = (year: number = new Date().getFullYear()) => `
  <div class="footer">
    <div class="social-links">
      <a href="#">LinkedIn</a> • 
      <a href="#">Instagram</a> • 
      <a href="#">Facebook</a>
    </div>
    <p>© ${year} Novacana GmbH. Großhandelserlaubnis Nr. DE-HE-WDA_2019_0077</p>
    <p style="color: #666; font-size: 13px;">Diese E-Mail wurde automatisch generiert. Bitte antworten Sie nicht auf diese E-Mail.</p>
  </div>
`;

