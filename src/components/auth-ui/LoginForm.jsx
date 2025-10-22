import {useState} from "react";
import {Input,Button} from "../index"
import {Link} from 'react-router-dom'

function LoginForm({onSubmit, isLoading}) {
const [form, setForm] = useState({
  email: "",
  password: "",
  role:""
})

  const [error, setError] = useState({});
  //  Validate input field
const validate = ()=>{
  const errs ={}
if(!form.email.trim()){
      errs.email = "Email is required";
}else if (!/\S+@\S+\.\S+/.test(form.email)){
      errs.email = "Invalid email";
}
 if (!form.password) {
      errs.password = "Password is required";
    }
    if (!form.role){
      errs.role = "Role is required, Select login as"
    }
    setError(errs);
    return Object.keys(errs).length === 0;


}

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

const handleSubmit =async (e)=>{
e.preventDefault()
if (!validate()) return;
const success = await onSubmit(form)
if (!success) {
    setError({ role: "Invalid role. You are not authorized as selected role" });
    return;
  }
setForm({
   email: "",
  password: "",
  role:""
})
}

  return (
   <>
   <div className="container mt-5 my-5">
      <h4 className="mb-4">Login to Your Account</h4>
      <form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm bg-light">

        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="you@example.com"
          className="form-control mb-3"
          required
        />
{error.email && (
        <p className="text-danger fs-6 mb-2">{error.email}</p>
      )}
        <Input
          label="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="********"
          className="form-control mb-3"
          required
        />
        {error.password && (
        <p className="text-danger fs-6 mb-2">{error.password}</p>
      )}


<Input
  label="Login As"
  type="select"
  name="role"
  value={form.role}
  onChange={handleChange}
  options= {["user","admin"]}
/>
{error.role && (
        <p className="text-danger fs-6 mb-2">{error.role}</p>
      )}
        <div className="d-grid">
          <Button
            type="submit"
            disabled={false}
            className="btn btn-primary"
          >
          {isLoading ? "Logging in..." : "Login"}
          </Button>
        </div>
                    <p className="text-center my-2">Dont't have an account? <Link to="/register" >Signup</Link></p>
        
      </form>
    </div>
   </>
  )
}

export default LoginForm
