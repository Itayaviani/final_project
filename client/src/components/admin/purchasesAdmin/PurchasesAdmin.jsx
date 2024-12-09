import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./purchasesAdmin.css";

const PurchasesAdmin = () => {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");
  // הגדרת מצב לסינון לפי סוג פריט (קורס/סדנה).
  const [filteredType, setFilteredType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

    // הגדרת מצב לשמירת תאריכים לתחילת וסיום הסינון.
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  // הגדרת מצב לשמירת סכום ההכנסות הכולל.
  const [totalRevenue, setTotalRevenue] = useState(0);

  // הגדרת מצבים לסטטיסטיקות של קורסים וסדנאות: הכי נרכשים והכי פחות נרכשים.
  const [courseStats, setCourseStats] = useState({
    mostPurchased: [],
    leastPurchased: [],
  });
  const [workshopStats, setWorkshopStats] = useState({
    mostPurchased: [],
    leastPurchased: [],
  });

  useEffect(() => {
    const fetchPurchasesAndStats = async () => {
      try {
        //ייבוא הרכישות מהשרת
        const purchasesResponse = await axios.get(
          "http://localhost:3000/api/v1/users/purchases/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        // שליפת רכישות מתוך התשובה שהתקבלה מה-API
        const allPurchases = purchasesResponse.data.data.purchases
         // ריכוז של מערך רכישות הקורסים והסדנאות לכל משתמש
          .flatMap((userPurchase) => [
            // מיפוי קורסים לכל רכישת קורס
            ...userPurchase.courses.map((course) => ({
              ...course,
              type: "קורס",
              userName: userPurchase.name,
              uniqueId: `${course._id}-${userPurchase.name}`,
            })),
            // מיפוי סדנאות לכל רכישת סדנה
            ...userPurchase.workshops.map((workshop) => ({
              ...workshop,
              type: "סדנה",
              userName: userPurchase.name,
              uniqueId: `${workshop._id}-${userPurchase.name}`,
            })),
          ])
          // הסרת כפילויות על פי מזהה ייחודי
          .reduce((acc, item) => {
            // אם לא קיים פריט עם אותו uniqueId במאגר, הוסף את הפריט למאגר
            if (!acc.some((existingItem) => existingItem.uniqueId === item.uniqueId)) {
              acc.push(item);
            }
            return acc;
          }, [])
           // מיון הרכישות לפי תאריך, מהחדש ביותר לישן ביותר
          .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

        setPurchases(allPurchases);

        // שליחה של בקשה לשרת לקבלת נתוני סטטיסטיקות רכישות
        const statsResponse = await axios.get(
          "http://localhost:3000/api/v1/users/purchases/statistics",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const { totalRevenue, courseStats, workshopStats } = statsResponse.data.data;
        setTotalRevenue(totalRevenue);
        setCourseStats(courseStats);
        setWorkshopStats(workshopStats);
      } catch (err) {
        console.error("שגיאה באחזור רכישות או נתונים סטטיסטיים:", err);
        setError("שגיאה בטעינת הרכישות או הסטטיסטיקות");
      }
    };

    fetchPurchasesAndStats();
  }, []);

  //הצגת כל השירותים
  const showAll = () => {
    setFilteredType(null);
  };

  //הצגת הקורסים
  const showCourses = () => {
    setFilteredType("קורס");
  };

  //הצגת הסדנה
  const showWorkshops = () => {
    setFilteredType("סדנה");
  };

  // פילטור הרכישות לפי קריטריונים שנמסרו (סוג, שם משתמש, תאריך)
  const filteredPurchases = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.purchaseDate);
    // בדיקה אם סוג הרכישה תואם לסוג המבוקש (אם לא נבחר סוג, כל סוג יתאים)
    const isWithinType = !filteredType || purchase.type === filteredType;

    const isWithinSearch = purchase.userName.toLowerCase().startsWith(searchTerm.toLowerCase());
    // בדיקה אם תאריך הרכישה נמצא בטווח התאריכים המבוקש
    const isWithinDateRange =
      (!startDate || purchaseDate >= new Date(startDate.setHours(0, 0, 0, 0))) &&
      (!endDate || purchaseDate <= new Date(endDate.setHours(23, 59, 59, 999)));

    return isWithinType && isWithinSearch && isWithinDateRange;
  });

  const filteredTotal = filteredPurchases.length;

  const hasCoursePurchases = filteredPurchases.some(
    (purchase) => purchase.type === "קורס"
  );
  const hasWorkshopPurchases = filteredPurchases.some(
    (purchase) => purchase.type === "סדנה"
  );

  // פונקציה לחישוב הסטטיסטיקות של הרכישות המסוננות
  const calculateFilteredStatistics = () => {
    // חישוב סך כל ההכנסות מכל הרכישות המסוננות
    const total = filteredPurchases.reduce(
      (acc, purchase) => acc + (purchase.price || 0),
      0
    );

    // אם הסכום הכולל שונה מההכנסות הכוללות הנוכחיות, מעדכנים את הערך
    if (total !== totalRevenue) {
      setTotalRevenue(total);
    }

    // פונקציה לחישוב הסטטיסטיקות עבור סוג רכישה מסוים (קורס או סדנה)
    const getStats = (type) => {
      const items = filteredPurchases.filter(
        (purchase) => purchase.type === type
      );

      // יצירת אובייקט שכולל את הספירה של כל פריט שנרכש
      const itemCount = items.reduce((count, item) => {
        count[item.name] = (count[item.name] || 0) + 1;
        return count;
      }, {});

      const maxCount = Math.max(...Object.values(itemCount), 0);
      const minCount = Math.min(
        ...Object.values(itemCount).filter((count) => count > 0),
        Infinity
      );

      // יצירת רשימה של פריטים עם מספר הרכישות המקסימלי
      const mostPurchasedItems = Object.keys(itemCount)
        .filter((name) => itemCount[name] === maxCount)
        .map((name) => ({ name, count: itemCount[name] }));

      // יצירת רשימה של פריטים עם מספר הרכישות המינימלי
      const leastPurchasedItems = Object.keys(itemCount)
        .filter((name) => itemCount[name] === minCount)
        .map((name) => ({ name, count: itemCount[name] }));

      return {
        mostPurchased: mostPurchasedItems,
        leastPurchased: leastPurchasedItems,
      };
    };

    const newCourseStats = getStats("קורס");
    const newWorkshopStats = getStats("סדנה");

    // אם הסטטיסטיקות עבור הקורסים השתנו, מעדכנים את הערך
    if (JSON.stringify(newCourseStats) !== JSON.stringify(courseStats)) {
      setCourseStats(newCourseStats);
    }
    // אם הסטטיסטיקות עבור הסדנאות השתנו, מעדכנים את הערך
    if (JSON.stringify(newWorkshopStats) !== JSON.stringify(workshopStats)) {
      setWorkshopStats(newWorkshopStats);
    }
  };

  useEffect(() => {
    calculateFilteredStatistics();
  }, [filteredPurchases]);

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
            <div className="total-count">סה"כ כמות רכישות : {filteredTotal}</div>
            <div className="total-revenue">סה"כ רווח כספי: {totalRevenue.toLocaleString()} ש"ח</div>

            <div className="purchase-stats">
              {hasCoursePurchases && (
                <>
                  <h4>קורסים</h4>
                  <p>:הכי נרכשים</p>
                  <table>
                    <thead>
                      <tr>
                        <th>כמות רכישות</th>
                        <th>שם קורס</th>
                      </tr>
                    </thead>
                    <tbody>
                      {courseStats.mostPurchased?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.count}</td>
                          <td>{item.name}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="2" className="least-purchased-title">:הכי פחות נרכשים</td>
                      </tr>
                      {courseStats.leastPurchased?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.count}</td>
                          <td>{item.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
              {hasWorkshopPurchases && (
                <>
                  <h4>סדנאות</h4>
                  <p>:הכי נרכשות</p>
                  <table>
                    <thead>
                      <tr>
                        <th>כמות רכישות</th>
                        <th>שם סדנה</th>
                      </tr>
                    </thead>
                    <tbody>
                      {workshopStats.mostPurchased?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.count}</td>
                          <td>{item.name}</td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan="2" className="least-purchased-title">:הכי פחות נרכשות</td>
                      </tr>
                      {workshopStats.leastPurchased?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.count}</td>
                          <td>{item.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </>
              )}
            </div>
          </div>

          <div className="purchases-table-container">
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
                    <td>
                      {purchase.purchaseDate
                        ? new Date(purchase.purchaseDate).toLocaleString()
                        : "תאריך לא זמין"}
                    </td>
                    <td className="price-cell-purchasesAdmin">
                      {purchase.price} ש"ח
                    </td>
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
    </div>
  );
};

export default PurchasesAdmin;
