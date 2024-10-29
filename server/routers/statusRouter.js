const express = require('express');
const router = express.Router();

// ייבוא המודלים
const User = require('../models/UserModel');
const Course = require('../models/CourseModel');
const Workshop = require('../models/WorkshopModel');
const Contact = require('../models/ContactModel');

// מסלול לקבלת סטטיסטיקות
router.get('/stats', async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const courseCount = await Course.countDocuments();
        const workshopCount = await Workshop.countDocuments();
        const contactCount = await Contact.countDocuments();

        // שליפת כל המשתמשים עם המידע המלא על הרכישות
        const users = await User.find().lean();

        let calculatedPurchaseCount = 0;

        users.forEach(user => {
            const userCoursesCount = user.purchasedCourses ? user.purchasedCourses.length : 0;
            const userWorkshopsCount = user.purchasedWorkshops ? user.purchasedWorkshops.length : 0;
            const totalUserPurchases = userCoursesCount + userWorkshopsCount;

            console.log(`User: ${user.name}`);
            console.log(`Purchased Courses: ${userCoursesCount}`);
            console.log(`Purchased Workshops: ${userWorkshopsCount}`);
            console.log(`Total Purchases: ${totalUserPurchases}`);
            console.log('-------------------------');

            calculatedPurchaseCount += totalUserPurchases;
        });

        console.log('Calculated Total Purchases:', calculatedPurchaseCount); // בדיקת התוצאה של כמות הרכישות

        res.json({
            users: userCount,
            courses: courseCount,
            workshops: workshopCount,
            contacts: contactCount,
            purchases: calculatedPurchaseCount // הוספת כמות הרכישות למענה
        });
    } catch (error) {
        console.error('Error retrieving data:', error); // בדיקת שגיאות
        res.status(500).json({ message: 'Error retrieving data' });
    }
});

module.exports = router;
