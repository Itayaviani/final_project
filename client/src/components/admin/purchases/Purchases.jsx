import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './purchases.css';

const Purchases = () => {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/purchases');
        setPurchases(response.data.data); // גישה נכונה ל-`data.data`
      } catch (err) {
        setError('שגיאה בטעינת הרכישות');
      }
    };

    fetchPurchases();
  }, []);

  const calculateRevenue = (items) => {
    return items.reduce((acc, item) => acc + (item.price * (item.participants || 0)), 0);
  };

  const getCoursesByYear = (year) => {
    return purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      return purchase.type === 'course' && purchaseDate.getFullYear() === year;
    });
  };

  const getWorkshopsByYear = (year) => {
    return purchases.filter((purchase) => {
      const purchaseDate = new Date(purchase.createdAt);
      return purchase.type === 'workshop' && purchaseDate.getFullYear() === year;
    });
  };

  const getMostPurchased = (items) => {
    return items.reduce((prev, current) => (prev.participants > current.participants) ? prev : current, null);
  };

  const getLeastPurchased = (items) => {
    return items.reduce((prev, current) => (prev.participants < current.participants) ? prev : current, null);
  };

  const uniqueYears = [...new Set(purchases.map((purchase) => new Date(purchase.createdAt).getFullYear()))];

  return (
    <div className="purchases-list">
      <h1>היסטוריית רכישות קורסים וסדנאות</h1>
      {error && <p className="error-message">{error}</p>}
      {uniqueYears.map((year) => {
        const courses = getCoursesByYear(year);
        const workshops = getWorkshopsByYear(year);
        const totalCourseRevenue = calculateRevenue(courses);
        const totalWorkshopRevenue = calculateRevenue(workshops);

        const mostPurchasedCourse = getMostPurchased(courses) || {};
        const leastPurchasedCourse = getLeastPurchased(courses) || {};
        const mostPurchasedWorkshop = getMostPurchased(workshops) || {};
        const leastPurchasedWorkshop = getLeastPurchased(workshops) || {};

        return (
          <div key={year} className="year-section">
            <h2>שנה: {year}</h2>
            <div className="revenue-section">
              <h3>רווח כולל קורסים: {totalCourseRevenue} ש"ח</h3>
              <h3>רווח כולל סדנאות: {totalWorkshopRevenue} ש"ח</h3>
            </div>
            <div className="ranking-section">
              <h4>הקורס עם הכי הרבה רכישות: {mostPurchasedCourse.name || 'אין נתונים'} ({mostPurchasedCourse.participants || 0} רכישות)</h4>
              <h4>הקורס עם הכי מעט רכישות: {leastPurchasedCourse.name || 'אין נתונים'} ({leastPurchasedCourse.participants || 0} רכישות)</h4>
              <h4>הסדנא עם הכי הרבה רכישות: {mostPurchasedWorkshop.name || 'אין נתונים'} ({mostPurchasedWorkshop.participants || 0} רכישות)</h4>
              <h4>הסדנא עם הכי מעט רכישות: {leastPurchasedWorkshop.name || 'אין נתונים'} ({leastPurchasedWorkshop.participants || 0} רכישות)</h4>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Purchases;
