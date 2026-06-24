import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./comps/common/Home.jsx";
import Header from "./comps/common/Header.jsx";
import Contact from "./comps/common/Contact.jsx";
import About from "./comps/common/About.jsx"
import StudentForm from "./comps/common/studentRegistration.jsx";

import StudentLogin from "./comps/student/components/StudentLogin.jsx";
import StudentDashboard from "./comps/student/components/StudentDashboard";
import StudentProfile from "./comps/student/components/StudentProfile";
import StudentAttendance from "./comps/student/components/StudentAttendance.jsx";
import AssignmentList from "./comps/student/components/AssignmentList.jsx";
import StudentResult from "./comps/student/components/Result.jsx";

import TeacherDashboard from "./comps/teacher/TeacherDashboard";
import TeacherRegistration from "./comps/teacher/TeacherRegistration.jsx";
import TeacherLogin from "./comps/teacher/TeacherLogin.jsx";
import Attendance from "./comps/teacher/Attendance.jsx";
import TeacherResults from "./comps/teacher/TeacherResult.jsx";

import PrincipalLogin from "./comps/principal/PrincipalLogin.jsx";
import AssignSubject from "./comps/principal/AssignSubject.jsx";
import PrincipalDashboard from "./comps/principal/PrincipalDashboard.jsx";
import ViewStudent from "./comps/principal/ViewStudent.jsx";
import ViewTeachers from "./comps/principal/ViewTeachers.jsx";
import ViewAttendance from "./comps/principal/ViewAttendance.jsx";
import GenerateResult from "./comps/principal/GenerateResult.jsx";

// 🔥 Session protection
import ProtectedRoute from "./utils/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      {/* 🔥 Header har page pe dikhega */}
      <Header />

      <Routes>

        {/* ✅ Default Route (IMPORTANT FIX) */}
        <Route path="/" element={<Home />} />

        {/* Common Pages */}
        <Route path="/home" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About/>} />

        {/* Student */}
        <Route path="/admission" element={<StudentForm />} />
        <Route path="/student-login" element={<StudentLogin />} />
        <Route path="/student-dashboard" element={<ProtectedRoute userType="student"><StudentDashboard /></ProtectedRoute>} />
        <Route path="/student-profile" element={<ProtectedRoute userType="student"><StudentProfile /></ProtectedRoute>} />
        <Route path="/student-attendance" element={<ProtectedRoute userType="student"><StudentAttendance /></ProtectedRoute>} />
        <Route path="/student-assignments" element={<ProtectedRoute userType="student"><AssignmentList /></ProtectedRoute>} />
        <Route path="/student-results" element={<ProtectedRoute userType="student"><StudentResult /></ProtectedRoute>} />

        {/* Teacher */}
       <Route path="/teacher" element={<Navigate to="/teacher-form" />} />
       <Route path="/teacher-form" element={<TeacherRegistration />} />
       <Route path="/teacher-login" element={<TeacherLogin />} />
       <Route path="/teacher-dashboard" element={<ProtectedRoute userType="teacher"><TeacherDashboard /></ProtectedRoute>} />
       <Route path="/teacher-results" element={<ProtectedRoute userType="teacher"><TeacherResults /></ProtectedRoute>} />

        {/* Principal */}
        <Route path="/assign-subject" element={<ProtectedRoute userType="principal"><AssignSubject /></ProtectedRoute>} />
        <Route path="/principal-login" element={<PrincipalLogin />} />
        <Route path="/principal" element={<ProtectedRoute userType="principal"><PrincipalDashboard /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute userType="principal"><PrincipalDashboard /></ProtectedRoute>} />
        <Route path="/view-students" element={<ProtectedRoute userType="principal"><ViewStudent /></ProtectedRoute>} />
        <Route path="/view-teachers" element={<ProtectedRoute userType="principal"><ViewTeachers /></ProtectedRoute>} />
        <Route path="/view-attendance" element={<ProtectedRoute userType="principal"><ViewAttendance /></ProtectedRoute>} />
        <Route path="/generate-result" element={<ProtectedRoute userType="principal"><GenerateResult /></ProtectedRoute>} />


        {/* ❌ Unknown route handle */}
        <Route path="*" element={<Navigate to="/" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
