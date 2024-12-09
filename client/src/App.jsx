import React, { useState, useEffect } from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import Signup from './components/register/register';
import Login from './components/Login/Login';
import HomePage from './pages/homePage/HomePage';
import AddProject from './pages/homePage/add project/AddProject';
import EditProject from './pages/homePage/edit project/EditProject';
import ProjectDetails from './pages/homePage/project details/ProjectDetails';

import NavBar from './components/navBar/NavBar';
import Workshops from './pages/workshops/Workshops';
import AddWorkshop from './pages/workshops/add workshop/AddWorkshop';
import EditWorkshop from './pages/workshops/edit workshop/EditWorkshop';
import WorkshopDetail from './pages/workshops/workshop detail/WorkshopDetail';
import WorkshopPayment from './pages/workshops/Payment/WorkshopPayment';
import WorkshopsList from './components/admin/workshops/WorkshopsList';
import ThankYouWorkshop from './pages/workshops/ThankYouWorkshop/ThankYouWorkshop';

import Courses from './pages/courses/Courses';
import AddCourse from './pages/courses/add course/AddCourse';
import EditCourse from './pages/courses/Edit Course/EditCourse';
import CourseDetails from './pages/courses/Course Details/CourseDetails';
import CoursePayment from './pages/courses/Payment/CoursePayment';
import ThankYouCourse from './pages/courses/thankYouCourse/ThankYouCourse';

import PersonalProcess from './pages/personalProcess/PersonalProcess';
import Header from './components/header/Header';
import AdminPanel from './components/admin/AdminPanel';
import EditUser from './components/EditUser/EditUser';
import Profile from './components/Profile/Profile';
import ContactsUs from './pages/contactsUs/ContactsUs';
import UserList from './components/admin/users/UserList';
import CoursesList from './components/admin/courses/CoursesList';
import Inquiries from './components/admin/Inquiries/Inquiries'; 
import PurchasesAdmin from './components/admin/purchasesAdmin/PurchasesAdmin'
import MyPurchases from './components/Profile/purchases/MyPurchases'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);

  // שליפת הנתונים מ-localStorage בעת טעינת הדף
  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    const storedIsAdmin = localStorage.getItem('isAdmin') === 'true';
    const token = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');

    if (storedUsername && token) {
      setIsLoggedIn(true);
      setUsername(storedUsername);
      setIsAdmin(storedIsAdmin);
      setUserId(storedUserId);
    }
  }, []);


  const handleLogout = () => {
    localStorage.removeItem('username');
    localStorage.removeItem('isAdmin');
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsLoggedIn(false);
    setUsername('');
    setIsAdmin(false);
    setUserId(null);
  };

  const [courses, setCourses] = useState([]);
  const [workshops, setWorkshops] = useState([]);


  const addCourse = (course) => {
    setCourses([...courses, course]);
  };


  const addWorkshop = (workshop) => {
    setWorkshops([...workshops, workshop]);
  };

  const [projects, setProjects] = useState([]);


  const addProject = (newProject) => {
    setProjects([...projects, newProject]);
  };

  return (
    <div>
      <BrowserRouter>
        <Header isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <NavBar isLoggedIn={isLoggedIn} username={username} isAdmin={isAdmin} onLogout={handleLogout} />
        <Routes>
          <Route path='/' element={<HomePage isAdmin={isAdmin}/>} />
          <Route path="/add-project" element={<AddProject addProject={addProject}/>} />
          <Route path="/project-details/:projectId" element={<ProjectDetails />} />
          <Route path="/edit-project/:projectId" element={<EditProject />} />

          <Route path='/register' element={<Signup />} />
          <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} setUsername={setUsername} setIsAdmin={setIsAdmin} />} />
          
          {}
          <Route path='/courses' element={<Courses courses={courses} isAdmin={isAdmin} userId={userId} />} />
          <Route path="/add-course" element={<AddCourse addCourse={addCourse} />} />
          <Route path="/edit-course/:courseId" element={<EditCourse />} />
          <Route path="/course-details/:courseId" element={<CourseDetails />} />
          <Route path="/payment/courses/:courseId" element={<CoursePayment />} />
          <Route path="/thank-you-course" element={<ThankYouCourse />} />
          
          {}
          <Route path='/workshops' element={<Workshops workshops={workshops} isAdmin={isAdmin} />} />
          <Route path="/add-workshop" element={<AddWorkshop addWorkshop={addWorkshop} />} />
          <Route path="/edit-workshop/:workshopId" element={<EditWorkshop />} />
          <Route path="/workshop-details/:workshopId" element={<WorkshopDetail />} />
          <Route path="/payment/workshops/:workshopId" element={<WorkshopPayment />} />
          <Route path="/admin/workshopsList" element={<WorkshopsList />} /> 
          <Route path="/thank-you-workshop" element={<ThankYouWorkshop />} />

        
          <Route path='/personalProcess' element={<PersonalProcess />} />
          <Route path='/contactUs' element={<ContactsUs />} />

          {}
          {isAdmin && <Route path='/admin' element={<AdminPanel />} />}
          {isAdmin && <Route path='/users' element={<UserList />} />}
          {isAdmin && <Route path='/admin/coursesList' element={<CoursesList />} />}
          {isAdmin && <Route path='/admin/Inquiries' element={<Inquiries />} />}
          {isAdmin && <Route path='/admin/workshopsList' element={<WorkshopsList />} />}
          {isAdmin && <Route path='/admin/purchases' element={<PurchasesAdmin />} />}

          {}
          {isLoggedIn && <Route path='/profile' element={<Profile />} />}
          {isLoggedIn && <Route path='/my-purchases' element={<MyPurchases userId={userId} />} />} {/* מעביר את ה-userId ל-MyPurchases */}
          {isLoggedIn && <Route path='/edit-user/:id' element={<EditUser setUsername={setUsername} />} />}
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
