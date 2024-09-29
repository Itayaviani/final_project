const nodemailer = require('nodemailer');

// פונקציה לשליחת מייל למשתמש
const sendOrderConfirmationEmail = (email, fullName, courseName, courseId) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', // או כל שירות מייל אחר כמו Outlook, Yahoo וכו'
    auth: {
      user: process.env.EMAIL_USER, // מתוך הקובץ .env
      pass: process.env.EMAIL_PASS,  // מתוך הקובץ .env
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'אישור רכישה',
    text: `
      שלום ${fullName},

      תודה על רכישת הקורס ${courseName} (מזהה קורס: ${courseId}).

      אנחנו מודים לך על בחירתך בנו ומקווים שתהנה מהתכנים.

      פרטי הרכישה שלך:
      שם קורס: ${courseName}
      מזהה קורס: ${courseId}

      תודה,
      צוות האתר
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

module.exports = {
  sendOrderConfirmationEmail,
};
