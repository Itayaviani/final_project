import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './purchasesAdmin.css';

const PurchasesAdmin = () => {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState('');
  const [filteredType, setFilteredType] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/users/purchases/all', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });

        const allPurchases = response.data.data.purchases.flatMap(userPurchase => [
          ...userPurchase.courses
            .map(course => ({
              ...course,
              type: 'קורס',
              userName: userPurchase.name,
              uniqueId: `${course._id}-${userPurchase.name}`
            })),
          ...userPurchase.workshops
            .map(workshop => ({
              ...workshop,
              type: 'סדנה',
              userName: userPurchase.name,
              uniqueId: `${workshop._id}-${userPurchase.name}`
            })),
        ]).reduce((acc, item) => {
          if (!acc.some(existingItem => existingItem.uniqueId === item.uniqueId)) {
            acc.push(item);
          }
          return acc;
        }, []).sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

        setPurchases(allPurchases);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError('שגיאה בטעינת הרכישות');
      }
    };

    fetchPurchases();
  }, []);

  const showAll = () => {
    setFilteredType(null);
  };

  const showCourses = () => {
    setFilteredType('קורס');
  };

  const showWorkshops = () => {
    setFilteredType('סדנה');
  };

  const filteredPurchases = purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.purchaseDate);
    const isWithinType = !filteredType || purchase.type === filteredType;
    const isWithinSearch = purchase.userName.toLowerCase().startsWith(searchTerm.toLowerCase());
    const isWithinDateRange =
      (!startDate || purchaseDate >= new Date(startDate.setHours(0, 0, 0, 0))) &&
      (!endDate || purchaseDate <= new Date(endDate.setHours(23, 59, 59, 999)));

    return isWithinType && isWithinSearch && isWithinDateRange;
  });

  const filteredTotal = filteredPurchases.length;

  // חישוב הרווח הכספי הכולל בהתאם לסינון
  const totalRevenue = filteredPurchases.reduce((acc, purchase) => acc + (purchase.price || 0), 0);

  // פונקציה למציאת הפריט הנרכש ביותר והפחות נרכש בהתאם לסינון תאריכים
  const getPurchaseStats = (type) => {
    const items = filteredPurchases.filter(purchase => purchase.type === type);
    const itemCount = items.reduce((count, item) => {
      count[item.name] = (count[item.name] || 0) + 1;
      return count;
    }, {});
    const mostPurchasedItem = Object.keys(itemCount).reduce((a, b) => itemCount[a] > itemCount[b] ? a : b, null);
    const leastPurchasedItem = Object.keys(itemCount).reduce((a, b) => itemCount[a] < itemCount[b] ? a : b, null);
    return { 
      mostPurchased: { name: mostPurchasedItem, count: itemCount[mostPurchasedItem] || 0 },
      leastPurchased: { name: leastPurchasedItem, count: itemCount[leastPurchasedItem] || 0 }
    };
  };

  const courseStats = getPurchaseStats('קורס');
  const workshopStats = getPurchaseStats('סדנה');

  return (
    <div className="purchases-admin-page">
      <div className="purchases-wrapper">
        <div className="purchases-list">
          <h1>היסטוריית רכישות</h1>
          {error && <p className="error-message">{error}</p>}

          <div className="filter-buttons">
            <button onClick={showAll}>הצג הכל</button>
            <button onClick={showCourses}>הצג קורסים</button>
            <button onClick={showWorkshops}>הצג סדנאות</button>
          </div>

          <input
            type="text"
            placeholder="חפש לפי שם משתמש"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />

          <div className="date-picker-wrapper">
            <label>בחר תאריך התחלה:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              isClearable
              placeholderText="תאריך התחלה"
              dateFormat="dd/MM/yyyy"
            />
            <label>בחר תאריך סיום:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              isClearable
              placeholderText="תאריך סיום"
              dateFormat="dd/MM/yyyy"
            />
          </div>

          <div className="stats-card">
  <div className="total-count">סה"כ: {filteredTotal}</div>
  <div className="total-revenue">סה"כ רווח כספי: {totalRevenue.toLocaleString()} ש"ח</div>

  <div className="purchase-stats">
    {filteredType === 'קורס' && (
      <>
        <p>הקורס הנרכש ביותר: {courseStats.mostPurchased.name} ({courseStats.mostPurchased.count} רכישות)</p>
        <p>הקורס הפחות נרכש: {courseStats.leastPurchased.name} ({courseStats.leastPurchased.count} רכישות)</p>
      </>
    )}
    {filteredType === 'סדנה' && (
      <>
        <p>הסדנה הנרכשת ביותר: {workshopStats.mostPurchased.name} ({workshopStats.mostPurchased.count} רכישות)</p>
        <p>הסדנה הפחות נרכשת: {workshopStats.leastPurchased.name} ({workshopStats.leastPurchased.count} רכישות)</p>
      </>
    )}
    {filteredType === null && (
      <>
        <p>הקורס הנרכש ביותר: {courseStats.mostPurchased.name} ({courseStats.mostPurchased.count} רכישות)</p>
        <p>הקורס הפחות נרכש: {courseStats.leastPurchased.name} ({courseStats.leastPurchased.count} רכישות)</p>
        <p>הסדנה הנרכשת ביותר: {workshopStats.mostPurchased.name} ({workshopStats.mostPurchased.count} רכישות)</p>
        <p>הסדנה הפחות נרכשת: {workshopStats.leastPurchased.name} ({workshopStats.leastPurchased.count} רכישות)</p>
      </>
    )}
  </div>
</div>

          <table className="purchases-table">
            <thead>
              <tr>
                <th>תאריך רכישה</th>
                <th>מחיר</th>
                <th>שם פריט</th>
                <th>סוג פריט</th>
                <th>שם משתמש</th>
              </tr>
            </thead>
            <tbody>
              {filteredPurchases.map((purchase) => (
                <tr key={purchase.uniqueId}>
                  <td>{purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleString() : 'תאריך לא זמין'}</td>
                  <td className="price-cell-purchasesAdmin">{purchase.price} ש"ח</td>
                  <td>{purchase.name}</td>
                  <td>{purchase.type}</td>
                  <td>{purchase.userName}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PurchasesAdmin;
