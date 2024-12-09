import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./userList.css";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        //משיכת המשתמשים מהשרת
        const response = await axios.get("http://localhost:3000/api/v1/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data.data.users);
      } catch (err) {
        setError("שגיאה בטעינת המשתמשים");
      }
    };

    fetchUsers();
  }, []);

  // פונקציה למחיקת משתמש לפי מזהה
  const handleDeleteUser = async (id) => {
    try {
      const token = localStorage.getItem("token");
      //שליפת המשתמש עם המזהה שצריך למחוק
      await axios.delete(`http://localhost:3000/api/v1/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // עדכון רשימת המשתמשים לאחר מחיקת משתמש
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      setError("שגיאה במחיקת המשתמש");
    }
  };

  // פונקציה לעריכת פרטי משתמש, ניווט לעמוד עריכת המשתמש
  const handleEditUser = (id) => {
    navigate(`/edit-user/${id}`);
  };

  // סינון המשתמשים לפי ערך החיפוש, כך שיבדוק אם השם מתחיל בערך החיפוש
  const filteredUsers = users.filter((user) =>
    user.name.startsWith(searchTerm)
  );

  return (
    <div className="user-list-wrapper">
      <div className="user-list">
        <h1>רשימת משתמשים</h1>
        {error && <p className="error-message">{error}</p>}
        
        <input
          type="text"
          placeholder="חפש משתמש לפי שם"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />

        <table>
          <thead>
            <tr>
              <th>פעולות</th>
              <th>אימייל</th>
              <th>מספר פלאפון</th>
              <th>שם משתמש</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="action-buttons">
                    <button
                      className="edit-btn"
                      onClick={() => handleEditUser(user._id)}
                    >
                      ערוך
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      מחק
                    </button>
                  </div>
                </td>

                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{user.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserList;
