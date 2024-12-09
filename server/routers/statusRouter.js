const express = require('express');
const router = express.Router();

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


        const users = await User.find().lean();

        let calculatedPurchaseCount = 0;

        users.forEach(user => {
            const userCoursesCount = user.purchasedCourses ? user.purchasedCourses.length : 0;
            const userWorkshopsCount = user.purchasedWorkshops ? user.purchasedWorkshops.length : 0;
            const totalUserPurchases = userCoursesCount + userWorkshopsCount;

            calculatedPurchaseCount += totalUserPurchases;
        });

        console.log('Calculated Total Purchases:', calculatedPurchaseCount); 

        res.json({
            users: userCount,
            courses: courseCount,
            workshops: workshopCount,
            contacts: contactCount,
            purchases: calculatedPurchaseCount 
        });
    } catch (error) {
        console.error('שגיאה באחזור נתונים:', error); 
        res.status(500).json({ message: 'שגיאה באחזור נתונים' });
    }
});

module.exports = router;
