import {useEffect } from 'react'
import { useDispatch,useSelector } from "react-redux";
import {Routes, Route} from "react-router-dom"
import {Navbar, Footer} from "./components/index"
import {SignupPage, LoginPage,Home, AdminDashboard, UserDashboard, PrivateRoute, PublicRoute,NotAuthorized,NoPageFound} from './pages/index'
import {checkCurrentUser} from "./appFeatures/authSlice"



function App() {
  const authReady = useSelector((state) => state.auth.authReady);
  
const dispatch = useDispatch()
useEffect(()=>{
  // Check current user on app load
  dispatch(checkCurrentUser())
},[dispatch])

if(!authReady){
 return <p>Loading...</p> 
};


  return (
    <>
    <Navbar/>
    <Routes>
<Route path="/" element={
  <PublicRoute>
    <Home/>
  </PublicRoute>
  }/>
<Route path="/register" element={
  <PublicRoute>
    <SignupPage/>
  </PublicRoute>
  }/>
<Route path="/login" element={
  <PublicRoute>
    <LoginPage/>
  </PublicRoute>
}/>
<Route path="/userDashboard/*" element={
  <PrivateRoute allowedRoles={["user"]}>
    <UserDashboard/>
  </PrivateRoute>
}/>
<Route path="/adminDashboard" element={
  <NotAuthorized>
  <PrivateRoute allowedRoles={["admin"]}>
    <AdminDashboard/>
  </PrivateRoute>
  </NotAuthorized>
  
}/>
<Route path="/NoPageFound" element={<NoPageFound />} />
    </Routes>
    <Footer/>
    </>
  )
}

export default App
