import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./coursesList.css";

const CoursesList = () => {
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState(""); 
  const [showTable, setShowTable] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchCourses = async () => {
      try {

        const response = await axios.get(
          "http://localhost:3000/api/v1/courses"
        );
        console.log(response.data);
        setCourses(response.data);
      } catch (err) {
        setError("שגיאה בטעינת הקורסים");
      }
    };

    fetchCourses();
  }, []);

  // פונקציה למחיקת קורס
  const handleDeleteCourse = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/courses/${id}`);
      setCourses(courses.filter((course) => course._id !== id)); // עדכון הסטייט לאחר המחיקה
    } catch (err) {
      setError("שגיאה במחיקת הקורס");
    }
  };


  const handleEditCourse = (id) => {
    navigate(`/edit-course/${id}`); 
  };


  const calculateRevenue = (course) => {
    return course.participants * course.price;
  };


  const calculateAvailableSpots = (course) => {
    return course.capacity - course.participants;
  };


  const filteredCourses = courses.filter((course) => {
    if (filter === "available") {
      return course.participants < course.capacity; 
    } else if (filter === "full") {
      return course.participants >= course.capacity;   
    } else {
      return true; 
    }
  });


  const searchedCourses = filteredCourses.filter((course) =>
    course.name.toLowerCase().startsWith(searchTerm.toLowerCase())
  );


  const sortedCourses = searchedCourses.sort(
    (a, b) => calculateRevenue(b) - calculateRevenue(a)
  );


  const handleShowTable = (filterType) => {
    setFilter(filterType); 
    setShowTable(true); 
  };

  return (
    <div className="courses-wrapper">
      <div className="courses-list">
        <h1>רשימת קורסים</h1>
        {error && <p className="error-message">{error}</p>}

        <div className="filter-buttons">
          <button onClick={() => handleShowTable("all")}>
            הצג את כל הקורסים
          </button>
          <button onClick={() => handleShowTable("available")}>
            קורסים עם מקומות פנויים
          </button>
          <button onClick={() => handleShowTable("full")}>
            קורסים בתפוסה מלאה
          </button>
        </div>

        {showTable && (
          <input
            type="text"
            placeholder="חפש קורס לפי שם"
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
                <th>שם קורס</th>
              </tr>
            </thead>
            <tbody>
              {sortedCourses.map((course) => (
                <tr key={course._id}>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="edit"
                        onClick={() => handleEditCourse(course._id)}
                      >
                        ערוך
                      </button>
                      <button
                        className="delete"
                        onClick={() => handleDeleteCourse(course._id)}
                      >
                        מחק
                      </button>
                    </div>
                  </td>
                  <td>
                    {}
                    {course.participants >= course.capacity ? (
                      <span className="full-course">הקורס מלא</span>
                    ) : (
                      <span className="available-course">
                        נשארו {calculateAvailableSpots(course)} מקומות
                      </span>
                    )}
                  </td>
                  <td className="price-cell-courseList">
                    {calculateRevenue(course)} ש"ח
                  </td>{" "}
                  {}
                  <td>
                    {course.participants} / {course.capacity}
                  </td>
                  <td>{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td>{course.courseDescription}</td>
                  <td className="price-cell-courseList">{course.price} ש"ח</td>
                  <td>{course.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CoursesList;
