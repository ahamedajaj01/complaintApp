import React, { useEffect,useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllComplaints,updateComplaint } from '../../appFeatures/complainSlice';
import {Input} from "../../components/index"


function DashboardUiAdmin() {
  const [formData, setFormData] = useState({});
  const [selectedStatus, setSelectedStatus] = useState("")
  const dispatch = useDispatch()
  const {error,loading,adminComplaints =[]} = useSelector((state) => state.complaint)
  const userData = useSelector((state) => state.auth.userData);

const handleUpdateComplaint = (comp) => {
  // Prepare the updated data
  const data = formData[comp.$id] || {};
  const updated = {
    adminReply: data.adminReply || comp.adminReply || "",
    status: data.status || comp.status,
  };

  dispatch(updateComplaint({ complaintId: comp.$id, updatedData: updated }));
};

  useEffect(()=>{
    if(userData && userData.$id){
    dispatch(fetchAllComplaints())
 
  }
  },[dispatch,userData])

// if you're filtering by this
const handleFilterChange = (e)=>{
e.preventDefault()
setSelectedStatus(e.target.value)
}


  if (loading) return <p>Loading complaints...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
   <>
    <div className="container my-5">
   {/* Header & Filter Row */}
  <div className="d-flex justify-content-between align-items-center mb-4">
    <h2 className="text-center flex-grow-1">📋 All User Complaints</h2>
    <div className="ms-3">
      <Input
        label="Filter by Status"
        type="select"
        options={["pending", "in-progress", "resolved"]}
        onChange={handleFilterChange} 

      />
    </div>
  </div>
  {/* Complaint List */}
  {adminComplaints.length === 0 ? (
    <div className="alert alert-info text-center">No complaints found.</div>
  ) : (
    <div className="row g-4">
      {adminComplaints.filter(comp => selectedStatus === "" || comp.status === selectedStatus)
      .map((comp) => (
        <div key={comp.$id} className="col-md-6">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body">
                            <div className="card-header d-flex justify-content-between">

              <h5 className="card-title text-primary">Category: {comp.complaintType}</h5>
 <span>
                  <strong>Date:</strong>{" "}
                  {comp.$createdAt
                    ? new Date(comp.$createdAt).toLocaleDateString()
                    : "Unknown"}
                </span>
              </div>
              <p className="mb-1"><strong>User ID:</strong> <span className="text-muted">{comp.userId}</span></p>
              <p className="mb-1"><strong>Name:</strong> <span className="text-muted">{comp.fullName}</span></p>
              <p className="mb-1"><strong>Instagram Username:</strong> <span className="text-muted">{comp.instagramUsername}</span></p>
              <p className="mb-3"><strong>Description:</strong> {comp.description}</p>

              <p><strong>Status:</strong> 
                <span className={`badge ms-2 px-3 py-2 rounded-pill ${
                  comp.status === "pending" ? "bg-warning text-dark" :
                  comp.status === "in-progress" ? "bg-info text-dark" : "bg-success"
                }`}>
                  {comp.status.toUpperCase()}
                </span>
              </p>

              {/* Reply TextArea */}
              <div className="mb-2">
                <label htmlFor={`reply-${comp.$id}`} className="form-label">Admin Reply:</label>
                <textarea
                  id={`reply-${comp.$id}`}
                  className="form-control"
                  rows="2"
                  defaultValue={comp.adminReply || ""}
                  onChange={(e) => setFormData(prev => ({ ...prev, [comp.$id]: { ...prev[comp.$id], adminReply: e.target.value } }))} // Store temp in object
                ></textarea>
              </div>

              {/* Status Dropdown */}
              <div className="mb-2">
                <label className="form-label">Update Status:</label>
                <select
                  defaultValue={comp.status}
                  className="form-select"
                  onChange={(e) => setFormData(prev => ({ ...prev, [comp.$id]: { ...prev[comp.$id], status: e.target.value } }))} // Temp store
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                className="btn btn-primary mt-2"
                disabled={( comp.status) === "resolved"}
                onClick={() => handleUpdateComplaint(comp)}
              >
                Submit Reply & Update Status
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )}
</div>


   </>
  )
}

export default DashboardUiAdmin
