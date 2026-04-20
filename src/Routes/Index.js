import React from 'react'
import { ToastContainer } from 'react-toastify'
import PublicRoutes from './PublicRoutes'
import Login from 'Screen/Auth/Login'
import ProtectedRoutes from './ProtectedRoutes'
import Dashboard from 'Screen/Autherised/Dashboard/Dashboard'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Forget from 'Screen/Auth/Forget'
import SignupPage from 'Screen/Auth/Signup'
import OtpVerify from 'Screen/Auth/OtpVerify'
import ResetPassword from 'Screen/Auth/ResetPassword'
import Clt from 'Screen/Autherised/Clt'
import Messages from 'Screen/Autherised/Messages'
import EmployeeDetails from 'Screen/Autherised/Companies/EmployeeDetails'
import ComapanyCLT from 'Screen/Autherised/Companies'
import { CompanyDetails } from 'Screen/Autherised/Companies/CompanyDetails'
import Employees from 'Screen/Autherised/Companies/Employees'
import Profile from 'Screen/Autherised/CommonScreens/Profile/Profile'
import HC from 'Screen/Autherised/HC'
import HappCoaches from 'Screen/Autherised/HappCoaches'
import HappCoachCompDetails from 'Screen/Autherised/HappCoaches/HappCoachCompDetails'
import AssignedMembers from 'Screen/Autherised/HappCoaches/AssignedMembers'
import AddEditAction from 'Screen/Autherised/HC/AddEditAction'
import ManageCompany from 'Screen/Autherised/Companies/ManageCompany'
import Settings from 'Screen/Autherised/Settings'
import FAQ from 'Screen/Autherised/Faq'

const MyRoutes = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>

          <Route element={<ProtectedRoutes />}>
            <Route path='/profile' element={<Profile />} />
            <Route path='/companydetails' element={<CompanyDetails />} />
            <Route path='/compemployee' element={<Employees />} />
            <Route path='/compemployeedetails' element={<EmployeeDetails />} />
            <Route path='/messages' element={<Messages />} />
            <Route path='/hc' element={<HC />} />
            <Route path='/AddEditAction' element={<AddEditAction />} />
            <Route path='/managecomp' element={<ManageCompany />} />
            <Route path='/dashboard' element={<Dashboard />} />
            <Route path='/clt' element={<Clt />} />
            <Route path='/happcoaches' element={<HappCoaches />} />
            <Route path='/happcoachcompdetails' element={<HappCoachCompDetails />} />
            <Route path='/assignedactions' element={<AssignedMembers />} />
            <Route path='/settings' element={<Settings />} />
            <Route path='/company' element={<ComapanyCLT />} />
            <Route path='/faq' element={<FAQ />} />
          </Route>

          <Route element={<PublicRoutes />}>
            <Route path='/' element={<Login />} />
            <Route path='/forget' element={<Forget />} />
            <Route path='/signup' element={<SignupPage />} />
            <Route path='/otpVerify' element={<OtpVerify />} />
            <Route path='/resetPassword' element={<ResetPassword />} />
            <Route path='*' element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  )
}

export default MyRoutes