const nodemailer = require('nodemailer');

// פונקציה לשליחת מייל למשתמש עבור קורס או סדנה
const sendOrderConfirmationEmail = (email, fullName, serviceName, serviceType, serviceId, startDate, startTime, serviceDetails) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,  
    },
  });

  // הפיכת התאריך לפורמט קריא יותר ללא השעה
  const formattedDate = new Date(startDate).toLocaleDateString('he-IL', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });

  // הפיכת היום לפורמט קריא
  const formattedDay = new Date(startDate).toLocaleDateString('he-IL', {
    weekday: 'long'
  });

  // הפיכת השעה לפורמט קריא
  const formattedTime = new Date(`1970-01-01T${startTime}:00`).toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false 
  });

  // התאמת המייל על פי סוג השירות - קורס או סדנה
  const subject = serviceType === 'course' 
    ? `אישור רכישה עבור קורס ${serviceName}` 
    : `אישור רכישה עבור סדנה ${serviceName}`;

  const text = serviceType === 'course' 
    ? `
      שלום ${fullName},

      תודה רבה על רכישת הקורס שלי! אני שמחה שבחרת להעשיר את הידע שלך בתחום ${serviceName}.

      הקורס שלך יתחיל בתאריך ${formattedDate}, ביום ${formattedDay}, בשעה ${formattedTime}.

      במהלך הקורס נעמיק בנושאים של ${serviceDetails}, ואספק לך כלים מעשיים שיסייעו לך בפיתוח מקצועי ואישי.

      אם יש לך שאלות או אם תצטרך סיוע נוסף, אל תהסס לפנות אליי בעמוד הצור קשר.

      אשמח לראותך בקורס הקרוב!

      בברכה,
      טלי גל
    ` 
    : `
      שלום ${fullName},

      תודה רבה על רכישת הסדנה שלי! אני שמחה שבחרת להעשיר את הידע שלך בתחום ${serviceName}.

      הסדנה שלך תתחיל בתאריך ${formattedDate}, ביום ${formattedDay}, בשעה ${formattedTime}.

      במהלך הסדנה נעמיק בנושאים של ${serviceDetails}, ואספק לך כלים מעשיים שיסייעו לך בפיתוח מקצועי ואישי.

      אם יש לך שאלות או אם תצטרך סיוע נוסף, אל תהסס לפנות אליי בעמוד הצור קשר.

      אשמח לראותך בסדנה הקרובה!

      בברכה,
      טלי גל
    `;

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    text: text,
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
