import React, { useEffect, useState } from "react";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./purchasesAdmin.css";

const PurchasesAdmin = () => {
  const [purchases, setPurchases] = useState([]);
  const [error, setError] = useState("");
  const [filteredType, setFilteredType] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const [totalRevenue, setTotalRevenue] = useState(0);
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
        const purchasesResponse = await axios.get(
          "http://localhost:3000/api/v1/users/purchases/all",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        const allPurchases = purchasesResponse.data.data.purchases
          .flatMap((userPurchase) => [
            ...userPurchase.courses.map((course) => ({
              ...course,
              type: "קורס",
              userName: userPurchase.name,
              uniqueId: `${course._id}-${userPurchase.name}`,
            })),
            ...userPurchase.workshops.map((workshop) => ({
              ...workshop,
              type: "סדנה",
              userName: userPurchase.name,
              uniqueId: `${workshop._id}-${userPurchase.name}`,
            })),
          ])
          .reduce((acc, item) => {
            if (!acc.some((existingItem) => existingItem.uniqueId === item.uniqueId)) {
              acc.push(item);
            }
            return acc;
          }, [])
          .sort((a, b) => new Date(b.purchaseDate) - new Date(a.purchaseDate));

        setPurchases(allPurchases);

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
        console.error("Error fetching purchases or statistics:", err);
        setError("שגיאה בטעינת הרכישות או הסטטיסטיקות");
      }
    };

    fetchPurchasesAndStats();
  }, []);

  const showAll = () => {
    setFilteredType(null);
  };

  const showCourses = () => {
    setFilteredType("קורס");
  };

  const showWorkshops = () => {
    setFilteredType("סדנה");
  };

  const filteredPurchases = purchases.filter((purchase) => {
    const purchaseDate = new Date(purchase.purchaseDate);
    const isWithinType = !filteredType || purchase.type === filteredType;
    const isWithinSearch = purchase.userName.toLowerCase().startsWith(searchTerm.toLowerCase());
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

  const calculateFilteredStatistics = () => {
    const total = filteredPurchases.reduce(
      (acc, purchase) => acc + (purchase.price || 0),
      0
    );

    if (total !== totalRevenue) {
      setTotalRevenue(total);
    }

    const getStats = (type) => {
      const items = filteredPurchases.filter(
        (purchase) => purchase.type === type
      );
      const itemCount = items.reduce((count, item) => {
        count[item.name] = (count[item.name] || 0) + 1;
        return count;
      }, {});

      const maxCount = Math.max(...Object.values(itemCount), 0);
      const minCount = Math.min(
        ...Object.values(itemCount).filter((count) => count > 0),
        Infinity
      );

      const mostPurchasedItems = Object.keys(itemCount)
        .filter((name) => itemCount[name] === maxCount)
        .map((name) => ({ name, count: itemCount[name] }));

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

    if (JSON.stringify(newCourseStats) !== JSON.stringify(courseStats)) {
      setCourseStats(newCourseStats);
    }
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
                        <td colSpan="2" className="least-purchased-title">הכי פחות נרכשים:</td>
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
                        <td colSpan="2" className="least-purchased-title">הכי פחות נרכשות:</td>
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
  );
};

export default PurchasesAdmin;
