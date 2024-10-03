import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Inquiries.css'; // וודא שה-CSS תואם לשם הקובץ הנכון

const Inquiries = () => {
  const [inquiries, setInquiries] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/contacts');
        setInquiries(response.data.data);
      } catch (err) {
        setError('שגיאה בטעינת פניות');
      }
    };

    fetchInquiries();
  }, []);

  const handleDeleteInquiry = async (id) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/contacts/${id}`);
      setInquiries(inquiries.filter(inquiry => inquiry._id !== id));
    } catch (err) {
      setError('שגיאה במחיקת הפנייה');
    }
  };

  return (
    <div className="inquiries-list-wrapper">
      <div className="inquiries-list">
        <h1>רשימת פניות צור קשר</h1>
        {error && <p className="error-message">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>שם פרטי</th>
              <th>שם משפחה</th>
              <th>נייד</th>
              <th>אימייל</th>
              <th>הודעה</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.map((inquiry) => (
              <tr key={inquiry._id}>
                <td>{inquiry.firstName}</td>
                <td>{inquiry.lastName}</td>
                <td>{inquiry.phone}</td>
                <td>{inquiry.email}</td>
                <td>{inquiry.message}</td>
                <td>
                  <button onClick={() => handleDeleteInquiry(inquiry._id)}>מחק</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Inquiries;
