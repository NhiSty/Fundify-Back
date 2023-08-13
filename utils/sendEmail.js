const SibApiV3Sdk = require('sib-api-v3-sdk');

module.exports = async function sendMail(emailTo, receiverName) {
  const apiKey = process.env.SENDINBLUE_API_KEY;

  const senderInfos = {
    email: process.env.SENDINBLUE_SENDER_EMAIL,
    name: process.env.SENDINBLUE_SENDER_NAME,
  };

  const receiverInfos = {
    email: emailTo,
  };

  const htmlContent = `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
        }
        .container {
          width: 80%;
          margin: 0 auto;
          padding: 20px;
          border: 1px solid #ccc;
          border-radius: 10px;
          background-color: #f7f7f7;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div style="text-align: center; margin-bottom: 20px">
          <h1>Bienvenu sur Fundify !</h1>
        </div>
        <div style="font-size: 16px; line-height: 1.6; margin-bottom: 20px">
          <p>Bonjour ${receiverName},</p>
          <p>Notre équipe vous remercie pour votre confiance.</p>
          <p>Nous traitons votre inscription <span style="color:red; font-weight: bold">dans les meilleurs délais</span>.</p>
          <p>Cordialement,</p>
        </div>
        <div style="font-size: 12px">  
          <p style="text-decoration: underline; font-weight: bold">Equipe Nhitsy</p>
          <p>Deveci Serkan</p>
          <p>Kanoute Hamidou</p>
          <p>Barbarisi Nicolas</p>
          <p>Jallu Thomas</p>
        </div>
      </div>
    </body>
  </html>

  `;

  const emailMessage = {
    to: [receiverInfos],
    sender: senderInfos,
    subject: 'Confirmation de votre inscription',
    htmlContent,
  };

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  defaultClient.authentications['api-key'].apiKey = apiKey;

  try {
    console.log(`Mail is sending to ${emailTo}`);
    await apiInstance.sendTransacEmail(emailMessage);
  } catch (error) {
    console.log(`Echec of sending mail to ${emailTo}`);
    console.error(error);
  }
};
