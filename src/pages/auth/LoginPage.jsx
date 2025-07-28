import React,{useEffect} from 'react'
import {Link} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import {loginUser, checkCurrentUser, logoutUser} from "../../appFeatures/authSlice"
import {LoginForm,Alert,useAlert} from "../../components/index"
import { useNavigate} from "react-router-dom";


function LoginPage() {
  const [ alert , showAlert] = useAlert(3000)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {error, status, isLoading} = useSelector((state)=>state.auth)



const handleLogin = async (formData) => {
  const { email, password, role } = formData;


  // Dispatch the loginUser thunk with email and password
  const result = await dispatch(loginUser({ email, password }));

  // Check if login succeeded
  if (loginUser.fulfilled.match(result)) {
    // After login, fetch current user details
    const userResult = await dispatch(checkCurrentUser());

    if (checkCurrentUser.fulfilled.match(userResult)) {
      const user = userResult.payload;

      // Check if role is set in user prefs
      if (!user.prefs?.role) {
        showAlert("error", "User role not set. Contact support.");
        return false;
      }

      // Validate if selected role matches stored user role
      if (user.prefs.role !== role) {
        showAlert("error", `Unauthorized! You are registered as ${user.prefs.role}, not as ${role}.`);
                await dispatch(logoutUser());  // logout immediately
        return false;
      }

      // Successful login & role match
      showAlert("success", "Login successful!");
      // Redirect based on role
      setTimeout(() =>{
        if( role === "admin" ){
          navigate("/adminDashboard");
        }else{
           navigate("/userDashboard");
        }
      }, 2000); // Redirect after 2 seconds

      return true;
    } else {
      // Failed to get current user details after login
      showAlert("error", "Failed to get user details.");
              await dispatch(logoutUser());  // logout immediately
      return false;
    }
  } else {
    // Login failed (wrong password, user not found, etc.)
    showAlert("error", "Login failed");
    return false;
  }
};



  return (
    <div>
        {alert.message && (
              <Alert type={alert.type} message={alert.message} />
            )}
      <LoginForm onSubmit={handleLogin} isLoading={isLoading}/>
    </div>
  )
}

export default LoginPage
