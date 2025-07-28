import React, { useState } from "react";
import { Button, Input,Alert,useAlert } from "../index";
import { Link } from "react-router-dom";

const DashboardUi = ({onSubmit}) => {
  const [errors, setError] = useState({});
  const [alert, showAlert] = useAlert(3000)


  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const complaintType = form[1].value.trim();
    const fullName = form[2].value.trim();
    const instagramUsername = form[3].value.trim();
    const description = form.querySelector("#complaint").value.trim();
    let validationErrors = {};
    if (!complaintType)
      validationErrors.complaintType = "Please select complaint type";
    if (!fullName) validationErrors.fullName = "Full name is required";
    if (!instagramUsername)
      validationErrors.instagramUsername = "Instagram username is required";
    if (!description) validationErrors.description = "Description is required";

    setError(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      
      onSubmit({ complaintType, fullName, instagramUsername, description, status:"pending" });
      showAlert(
        "success",
        "Complaint submitted successfully!"
      );
    }else{
      showAlert(
        "error",
        "Please fill all the required fields correctly."
      );
    }
  };
  return (
    <>
      <div className="container my-4">
        <h1 className="text-center">User Dashboard</h1>
        <p className="text-center">Log your complaints here.</p>
{alert && <Alert type={alert.type} message={alert.message} />}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <label>Complaint Type</label>
              <Button variant="outline-primary" className="mb-2">
              <Link to="user-complaint" className="text-decoration-none text-white">Check Complaint Status</Link>
              </Button>
            </div>
            <Input
              type="select"
              options={["billing", "technical", "courier", "general", "other"]}
              required
            />
            {errors.complaintType && (
              <small className="text-danger">{errors.complaintType}</small>
            )}

            <Input
              label="Full Name"
              type="text"
              placeholder="Enter your full name"
              required
            />
            {errors.fullName && (
              <small className="text-danger">{errors.fullName}</small>
            )}

            <Input
              label="Instagram Username"
              type="text"
              placeholder="Enter your Instagram username"
              required
            />
            {errors.instagramUsername && (
              <small className="text-danger">{errors.instagramUsername}</small>
            )}

            <label htmlFor="complaint">Description:</label>
            <textarea
              className="form-control"
              id="complaint"
              rows="4"
              required
            ></textarea>
            {errors.description && (
              <small className="text-danger">{errors.description}</small>
            )}
          </div>
          <Button type="submit" className="btn btn-primary mt-3">
            Submit Complaint
          </Button>
        </form>
      </div>
    </>
  );
};

export default DashboardUi;
