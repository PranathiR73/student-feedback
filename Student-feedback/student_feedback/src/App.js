import './App.css';
import { Route, Routes } from 'react-router-dom';
import Home from './components/Home';
import StudentLoginPage from './Pages/Student/Login';
import FacultyLoginPage from './Pages/Faculty/Login';
import AdminLoginPage from './Pages/Admin/Login';
import StudentDashboard from './Pages/Student/Dashboard';
import FacultyDashboard from './Pages/Faculty/Dashboard';
import AdminDashboard from './Pages/Admin/Dashboard';
import ProtectedRoute from './routes/ProtectedRoute';
import StudentSettings from './Pages/Student/StudentSettings';
import SendFeedbackPage from './Pages/Student/FeedbackForm';
import FacultySettings from './Pages/Faculty/FacultySettings';

function App() {

  return (
    <div >
    <Routes>
      <Route path='/' element={<Home />}></Route>
      <Route path='/studentLoginPage' element={<StudentLoginPage/>}></Route>
      <Route path='/facultyLoginPage' element={<FacultyLoginPage/>}></Route>
      <Route path='/adminLoginPage' element={<AdminLoginPage/>}></Route>
         <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/settings" element={<StudentSettings />} />
            <Route path="/student/sendfeedback" element={<SendFeedbackPage />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["faculty"]} />}>
            <Route path="/faculty/dashboard" element={<FacultyDashboard />} />
            <Route path="/faculty/settings" element={<FacultySettings />} />
          </Route>

          <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
    </Routes>
    </div>
  );
}






export default App;
