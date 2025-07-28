import React from 'react'
import { DashboardUi,UserComplaint } from '../../components'
import {Routes,Route} from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import {createComplaint} from "../../appFeatures/complainSlice"


function UserDashboard() {
  const dispatch = useDispatch()
  const { userData } = useSelector((state) => state.auth);

    if (!userData) return <div>Loading user info...</div>;
  // Function to handle complaint submission
  const handleComplaintSubmit = async (formData)=>{
     const complaintWithUserId = {
    ...formData,
    userId: userData.$id  // <-- add the logged-in user's id here
  };
  await dispatch(createComplaint(complaintWithUserId))
  }


  return (
    <div>
      <Routes>
        <Route path='/' element={<DashboardUi onSubmit={handleComplaintSubmit}/>}/>
        <Route path="user-complaint" element={<UserComplaint/>}/>
      </Routes>
      
    </div>
  )
}

export default UserDashboard
