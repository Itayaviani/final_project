import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Signup from './components/register/register';
import Login from './components/Login/Login';
import HomePage from './pages/homePage/HomePage';
import NavBar from './components/navBar/NavBar';
import Workshops from './pages/workshops/Workshops';
import Courses from './pages/courses/Courses';
import AddCourse from './pages/courses/add course/AddCourse';
import FeminineLook from './pages/feminineLook/FeminineLook';
import NiceToMeet from './pages/niceToMeet/NiceToMeet';
import PersonalProcess from './pages/personalProcess/PersonalProcess';
import CommunitiesAndOrganizations from './pages/communitiesAndOrganizations/CommunitiesAndOrganizations';
import Projects from './pages/projects/Projects';
import Header from './components/header/Header';
import AdminPanel from './components/admin/AdminPanel';
import EditUser from './components/EditUser/EditUser'; // ייבוא הקומפוננטה החדשה
import Profile from './components/Profile/Profile';
import ContactsUs from './pages/contactsUs/ContactsUs';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    const token = localStorage.getItem('token');

    if (storedUsername && token) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setIsAdmin(storedIsAdmin);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false);
  };

  const [courses, setCourses] = useState([]);

  const addCourse = (course) => {
    setCourses([...courses, course]);
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
          <Route path='/courses' element={<Courses courses={courses}/>} />
          <Route path="/add-course" element={<AddCourse addCourse={addCourse} />} />
          <Route path='/niceToMeet' element={<NiceToMeet />} />
          <Route path='/personalProcess' element={<PersonalProcess />} />
          <Route path='/communitiesAndOrganizations' element={<CommunitiesAndOrganizations />} />
          <Route path='/workshops' element={<Workshops />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/contactUs' element={<ContactsUs />} />
          {isAdmin && <Route path='/admin' element={<AdminPanel />} />}
          {isAdmin && <Route path='/edit-user/:id' element={<EditUser />} />}
          {isLoggedIn && <Route path='/profile' element={<Profile />} />}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
