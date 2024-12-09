import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./workshopsList.css";

const WorkshopsList = () => {
  const [workshops, setWorkshops] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("");
  const [showTable, setShowTable] = useState(false); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchWorkshops = async () => {
      try {

        const response = await axios.get(
          "http://localhost:3000/api/v1/workshops"
        );
        setWorkshops(response.data);
      } catch (err) {
        setError("שגיאה בטעינת הסדנאות");
      }
    };

    fetchWorkshops();
  }, []);


  const handleDeleteWorkshop = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/workshops/${id}`);
      setWorkshops(workshops.filter((workshop) => workshop._id !== id)); 
    } catch (err) {
      setError("שגיאה במחיקת הסדנה");
    }
  };


  const handleEditWorkshop = (id) => {
    navigate(`/edit-workshop/${id}`); 
  };


  const calculateRevenue = (workshop) => {
    return workshop.participants * workshop.price;
  };


  const calculateAvailableSpots = (workshop) => {
    return workshop.capacity - workshop.participants;
  };


  const filteredWorkshops = workshops.filter((workshop) => {
    if (filter === "available") {
      return workshop.participants < workshop.capacity;
    } else if (filter === "full") {
      return workshop.participants >= workshop.capacity; 
    } else {
      return true; 
    }
  });


  const searchedWorkshops = filteredWorkshops.filter((workshop) =>
    workshop.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );


  const sortedWorkshops = searchedWorkshops.sort(
    (a, b) => calculateRevenue(b) - calculateRevenue(a)
  );


  const handleShowTable = (filterType) => {
    setFilter(filterType); 
    setShowTable(true); 
  };

  return (
    <div className="workshops-wrapper">
      <div className="workshops-list">
        <h1>רשימת סדנאות</h1>
        {error && <p className="error-message">{error}</p>}

        {}
        <div className="filter-buttons">
          <button onClick={() => handleShowTable("all")}>
            הצג את כל הסדנאות
          </button>
          <button onClick={() => handleShowTable("available")}>
            סדנאות עם מקומות פנויים
          </button>
          <button onClick={() => handleShowTable("full")}>
            סדנאות בתפוסה מלאה
          </button>
        </div>

        {showTable && (
          <input
            type="text"
            placeholder="חפש סדנה לפי שם"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        )}

        
        {showTable && (
          <table>
            <thead>
              <tr>
                <th>פעולות</th>
                <th>סטטוס</th>
                <th>הכנסות</th>
                <th>משתתפים</th>
                <th>תאריך יצירה</th>
                <th>תיאור בקצרה</th>
                <th>מחיר</th>
                <th>שם סדנה</th>
              </tr>
            </thead>
            <tbody>
              {sortedWorkshops.map((workshop) => (
                <tr key={workshop._id}>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit"
                        onClick={() => handleEditWorkshop(workshop._id)}
                      >
                        ערוך
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDeleteWorkshop(workshop._id)}
                      >
                        מחק
                      </button>
                    </div>
                  </td>
                  <td>
                    {}
                    {workshop.participants >= workshop.capacity ? (
                      <span className="full-workshop">הסדנה מלאה</span>
                    ) : (
                      <span className="available-workshop">
                        נשארו {calculateAvailableSpots(workshop)} מקומות
                      </span>
                    )}
                  </td>
                  <td className="price-cell-workshopList">
                    {calculateRevenue(workshop)} ש"ח
                  </td>{" "}
                  {}
                  <td>
                    {workshop.participants} / {workshop.capacity}
                  </td>
                  <td>{new Date(workshop.createdAt).toLocaleDateString()}</td>
                  <td>{workshop.workshopDescription}</td>
                  <td className="price-cell-workshopList">
                    {workshop.price} ש"ח
                  </td>
                  <td>{workshop.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default WorkshopsList;
