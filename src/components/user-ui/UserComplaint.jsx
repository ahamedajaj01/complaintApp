import React, { useEffect} from 'react';
import {useDispatch, useSelector } from 'react-redux';
import {fetchUserComplaints} from "../../appFeatures/complainSlice"
import {Button} from "../index"
import { useNavigate } from 'react-router-dom';


function UserComplaint() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
const {complaints =[], loading, error } = useSelector((state)=> state.complaint)
  const userData = useSelector((state) => state.auth.userData);

  useEffect(()=>{
    if(userData && userData.$id){
      dispatch(fetchUserComplaints(userData.$id))
    }
  }, [dispatch, userData])

    if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
   <>
  <div className="container my-4">
      <h2 className="text-center mb-4">Your Complaints</h2>
<Button className="my-2" onClick={() => navigate("/userDashboard")}>
    Go Back
</Button>
      {complaints.length === 0 ? (
        <p>No complaints found.</p>
      ) : (
        <>
          {complaints.map((complaint) => (
            <div key={complaint.$id} className="card mb-3">
              <div className="card-header d-flex justify-content-between">
                <span><strong>Category:</strong> {complaint.complaintType}</span>
                <span>
                  <strong>Date:</strong>{" "}
                  {complaint.$createdAt
                    ? new Date(complaint.$createdAt).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
              <div className="card-body">
                <p><strong>Message:</strong> {complaint.description}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={`badge ${
                      complaint.status === "pending"
                        ? "bg-warning text-dark"
                        : complaint.status === "in-progress"
                        ? "bg-info text-dark"
                        : complaint.status === "resolved"
                        ? "bg-success"
                        : "bg-secondary"
                    }`}
                  >
                    {complaint.status || "pending"}
                  </span>
                </p>
                <p>
                  <strong>Admin Response:</strong>{" "}
                  {complaint.adminReply || "Not responded yet."}
                </p>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
   </>
  )
}

export default UserComplaint

