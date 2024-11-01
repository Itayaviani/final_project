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
          ...userPurchase.courses.map(course => ({
            ...course,
            type: 'קורס',
            userName: userPurchase.name,
          })),
          ...userPurchase.workshops.map(workshop => ({
            ...workshop,
            type: 'סדנה',
            userName: userPurchase.name,
          })),
        ]).sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

        setPurchases(allPurchases);
      } catch (err) {
        console.error('Error fetching purchases:', err);
        setError('שגיאה בטעינת הרכישות');
      }
    };

    fetchPurchases();
  }, []);

  const showCourses = () => {
    setFilteredType(null); // Clear the previous filter type
    setTimeout(() => setFilteredType('קורס'), 0); // Set the filter type to 'קורס'
  };

  const showWorkshops = () => {
    setFilteredType(null); // Clear the previous filter type
    setTimeout(() => setFilteredType('סדנה'), 0); // Set the filter type to 'סדנה'
  };

  const filteredPurchases = purchases.filter(purchase => {
    const purchaseDate = new Date(purchase.purchaseDate);
    const isWithinType = !filteredType || purchase.type === filteredType;
    const isWithinSearch = purchase.userName.toLowerCase().startsWith(searchTerm.toLowerCase());
    const isWithinDateRange =
      (!startDate || purchaseDate >= startDate) &&
      (!endDate || purchaseDate <= endDate);

    return isWithinType && isWithinSearch && isWithinDateRange;
  });

  return (
    <div className="purchases-admin-page">
      <div className="purchases-wrapper">
        <div className="purchases-list">
          <h1>היסטוריית רכישות</h1>
          {error && <p className="error-message">{error}</p>}

          <div className="filter-buttons">
            <button onClick={showCourses}>הצג קורסים</button>
            <button onClick={showWorkshops}>הצג סדנאות</button>
          </div>

          {filteredType && (
            <input
              type="text"
              placeholder="חפש לפי שם משתמש"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
          )}

          {/* תאריכון לבחירת טווח תאריכים */}

          <div className="date-picker-wrapper">
          <label>בחר תאריך התחלה:</label>
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              isClearable
              placeholderText="תאריך התחלה"
            />
           <label>בחר תאריך סיום:</label>
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              isClearable
              placeholderText="תאריך סיום"
            />
            
          </div>

          {filteredType && (
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
                  <tr key={purchase._id}>
                    <td>{purchase.purchaseDate ? new Date(purchase.purchaseDate).toLocaleString() : 'תאריך לא זמין'}</td>
                    <td className="price-cell-purchasesAdmin">{purchase.price} ש"ח</td>
                    <td>{purchase.name}</td>
                    <td>{purchase.type}</td>
                    <td>{purchase.userName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default PurchasesAdmin;
