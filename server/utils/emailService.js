const nodemailer = require('nodemailer');


const sendOrderConfirmationEmail = (email, fullName, serviceName, serviceType, serviceId, startDate, startTime, serviceDetails) => {

  const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
      user: process.env.EMAIL_USER, 
      pass: process.env.EMAIL_PASS,  
    },
  });


  const formattedDate = new Date(startDate).toLocaleDateString('he-IL', {
    year: 'numeric', 
    month: 'long', 
    day: 'numeric'
  });


  const formattedDay = new Date(startDate).toLocaleDateString('he-IL', {
    weekday: 'long'
  });


  const formattedTime = new Date(`1970-01-01T${startTime}:00`).toLocaleTimeString('he-IL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false 
  });


  const subject = `אישור רכישה עבור ${serviceType === 'course' ? 'קורס' : 'סדנת'} ${serviceName}`;


  const text = `
  שלום ${fullName},

  תודה רבה על רכישת ה${serviceType === 'course' ? 'קורס' : 'סדנה'} שלי! אני שמחה שבחרת להעשיר את הידע שלך בתחום ${serviceName}.

  ה${serviceType === 'course' ? 'קורס שלך יתחיל' : 'סדנה שלך תתחיל'} בתאריך ${formattedDate}, ביום ${formattedDay}, בשעה ${formattedTime}.

  במהלך ה${serviceType === 'course' ? 'קורס' : 'סדנה'} נעמיק בנושאים של ${serviceDetails}, ואספק לך כלים מעשיים שיסייעו לך בפיתוח מקצועי ואישי.

  אם יש לך שאלות או אם תצטרך סיוע נוסף, אל תהסס לפנות אליי בעמוד הצור קשר.

  אשמח לראותך ב${serviceType === 'course' ? 'קורס הקרוב' : 'סדנה הקרובה'}!

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
      console.log('שגיאה בשליחת מייל:', error);
    } else {
      console.log('מייל נשלח:', info.response);
    }
  });
};

module.exports = {
  sendOrderConfirmationEmail,
};
