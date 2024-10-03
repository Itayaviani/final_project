import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Signup from './components/register/register';
import Login from './components/Login/Login';
import HomePage from './pages/homePage/HomePage';
import NavBar from './components/navBar/NavBar';
import Workshops from './pages/workshops/Workshops';
import AddWorkshop from './pages/workshops/add workshop/AddWorkshop';
import EditWorkshop from './pages/workshops/edit workshop/EditWorkshop';
import WorkshopDetail from './pages/workshops/workshop detail/WorkshopDetail';
import WorkshopPayment from './pages/workshops/Payment/WorkshopPayment'; 
import Courses from './pages/courses/Courses';
import AddCourse from './pages/courses/add course/AddCourse';
import EditCourse from './pages/courses/Edit Course/EditCourse';
import CourseDetails from './pages/courses/Course Details/CourseDetails';
import CoursePayment from './pages/courses/Payment/CoursePayment';
import ThankYou from './pages/courses/thankYou/ThankYou';
import FeminineLook from './pages/feminineLook/FeminineLook';
import NiceToMeet from './pages/niceToMeet/NiceToMeet';
import PersonalProcess from './pages/personalProcess/PersonalProcess';
import CommunitiesAndOrganizations from './pages/communitiesAndOrganizations/CommunitiesAndOrganizations';
import Projects from './pages/projects/Projects';
import Header from './components/header/Header';
import AdminPanel from './components/admin/AdminPanel';
import EditUser from './components/EditUser/EditUser';
import Profile from './components/Profile/Profile';
import ContactsUs from './pages/contactsUs/ContactsUs';
import UserList from './components/admin/users/UserList';
import CoursesList from './components/admin/courses/CoursesList';
import MyPurchases from './components/Profile/purchases/MyPurchases'
import Inquiries from './components/admin/Inquiries/Inquiries'; // ייבוא רכיב הפניות

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null); // הגדרת userId כמצב (state)

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  // בדיקה אם המשתמש מחובר
  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId'); // משיכת userId מה-LocalStorage

    if (storedUsername && token) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setIsAdmin(storedIsAdmin);
      setUserId(storedUserId); // הגדרת userId מה-LocalStorage
    }
  }, []);

  // ניתוק המשתמש
  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    localStorage.removeItem('userId'); // מחיקת userId בעת ניתוק
    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false);
    setUserId(null); // איפוס userId
  };

  const [courses, setCourses] = useState([]);
  const [workshops, setWorkshops] = useState([]);

  const addCourse = (course) => {
    setCourses([...courses, course]);
  };

  const addWorkshop = (workshop) => {
    setWorkshops([...workshops, workshop]);
  };

  return (
    <div>
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <NavBar isLoggedIn={isLoggedIn} username={username} isAdmin={isAdmin} onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setIsAdmin={setIsAdmin} />} />
          <Route path='/feminineLook' element={<FeminineLook />} />
          
          {/* ניהול קורסים */}
          <Route path='/courses' element={<Courses courses={courses} isAdmin={isAdmin} userId={userId} />} />

          <Route path="/add-course" element={<AddCourse addCourse={addCourse} />} />
          <Route path="/edit-course/:courseId" element={<EditCourse />} />
          <Route path="/course-details/:courseId" element={<CourseDetails />} />
          <Route path="/payment/courses/:courseId" element={<CoursePayment />} />
          <Route path="/thank-you" element={<ThankYou />} />
          
          {/* ניהול סדנאות */}
          <Route path='/workshops' element={<Workshops workshops={workshops} isAdmin={isAdmin} />} />
          <Route path="/add-workshop" element={<AddWorkshop addWorkshop={addWorkshop}/>} />
          <Route path="/edit-workshop/:workshopId" element={<EditWorkshop />} />
          <Route path="/workshop-details/:workshopId" element={<WorkshopDetail />} />
          <Route path="/payment/workshops/:workshopId" element={<WorkshopPayment />} />

          {/* דפים נוספים */}
          <Route path='/niceToMeet' element={<NiceToMeet />} />
          <Route path='/personalProcess' element={<PersonalProcess />} />
          <Route path='/communitiesAndOrganizations' element={<CommunitiesAndOrganizations />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/contactUs' element={<ContactsUs />} />

          {/* ניהול מערכת */}
          {isAdmin && <Route path='/admin' element={<AdminPanel />} />}
          {isAdmin && <Route path='/users' element={<UserList />} />}
          {isAdmin && <Route path='/admin/coursesList' element={<CoursesList />} />}
          {isAdmin && <Route path='/admin/Inquiries' element={<Inquiries />} />}

          {/* פרופיל משתמש */}
          {isLoggedIn && <Route path='/profile' element={<Profile />} />}
          <Route path="/my-purchases" element={<MyPurchases userId={userId} />} />
          {isLoggedIn && <Route path='/edit-user/:id' element={<EditUser setUsername={setUsername} />} />}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
