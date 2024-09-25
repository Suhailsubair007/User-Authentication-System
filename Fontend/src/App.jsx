import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './components/user/Login'
import Signup from './components/user/Signup'
import Home from './components/user/Home'
import Profile from './components/user/Profile'
import AdminDashboard from './components/admin/AdminDashboard'
import AdminEditUser from './components/admin/AdminEditUser'
import AminaddUser from './components/admin/AminaddUser'
import AdminLogin from './components/admin/AdminLogin'
import ErrorPage from './components/ErrorPage'
import UserLoginAuth from './components/private/userLoginAuth'
import UserAuth from './components/private/UserAuth'
import RequireAdminAuth from './components/private/RequireAdminAuth'
import AdminAuthLogin from './components/private/AdminAuthLogin'

function App () {
  return (
    <div className='App'>
      <Router>
        <Routes>
          <Route
            path='/'
            element={
              <UserLoginAuth>
                <Login />
              </UserLoginAuth>
            }
          />
          <Route
            path='/login'
            element={
              <UserLoginAuth>
                <Login />
              </UserLoginAuth>
            }
          />

          <Route
            path='/register'
            element={
              <UserLoginAuth>
                <Signup />
              </UserLoginAuth>
            }
          />

          <Route
            path='/home'
            element={
              <UserAuth>
                <Home></Home>
              </UserAuth>
            }
          />
          <Route
            path='/profile/:userId'
            element={
              <UserAuth>
                <Profile />
              </UserAuth>
            }
          />
          <Route
            path='/adminLogin'
            element={
              <AdminAuthLogin>
                <AdminLogin />
              </AdminAuthLogin>
            }
          />
          <Route
            path='/admin/dashboard'
            element={
              <RequireAdminAuth>
                <AdminDashboard />
              </RequireAdminAuth>
            }
          />
          <Route path='/admin/edit/:userId' element={<AdminEditUser />} />
          <Route path='/admin/add' element={<AminaddUser />} />
          <Route path='*' element={<ErrorPage />} />
        </Routes>
      </Router>
    </div>
  )
}

export default App
