import React,{useState} from 'react'
import { SignupForm,Alert,useAlert } from '../../components/index'
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {Link} from "react-router-dom"
import {signupUser} from "../../appFeatures/authSlice"


function SignupPage() {
const [alert, showAlert] = useAlert(2500)

const navigate = useNavigate()
const dispatch = useDispatch()
const {status, error , isLoading} = useSelector((state) => state.auth)

const handleSignup = async (formData) => {
  const { name, email, password } = formData;

  const result = await dispatch(signupUser({ name, email, password,role:"user" }));
console.log(result);

  if (signupUser.fulfilled.match(result)) {
        showAlert("success", "Signup successful!");

    setTimeout(() => {
      navigate("/userDashboard");
    }, 2000);
  } else {
      showAlert("error", "Something went wrong.");
  }
};


  return (
    <div>
      {alert.message && (
        <Alert type={alert.type} message={alert.message} />
      )}
      <SignupForm onSubmit={handleSignup} isLoading={isLoading}/>
         {/* ❌ Show error message if signup fails */}
          {status === "failed" && (
            <p className="container text-danger">{error}</p>
          )}
          
    </div>
  )
}

export default SignupPage
