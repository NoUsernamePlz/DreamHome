import axios from "axios";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";

function Login() {
    const navigate = useNavigate();
  const [error ,setError] = useState(); 
  const [isLoading ,setIsLoading] = useState(false); 
  const handleSubmit = async(e)=>{
    setIsLoading(true);
    e.preventDefault();
    const formdata = new FormData(e.target);
   const username = formdata.get("username");
   const password = formdata.get("password");

   try{
      const res = await apiRequest.post("/auth/login",{username,password});
      // navigate("/login");
      localStorage.setItem("user",JSON.stringify(res.data));
      navigate("/");
   }catch(err){
      setError(err.response.data.message);
   }finally{
    setIsLoading(false);
   
  }
}

  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h1>Welcome back</h1>
          <input name="username" required minLength={3} maxLength={20} type="text" placeholder="Username" />
          <input name="password" required  type="password" placeholder="Password" />
          <button disabled={isLoading}>Login</button>
          {error && <span>{error}</span>}
          <Link to="/register">{"Don't"} you have an account?</Link>
        </form>
      </div>
      <div className="imgContainer">
        <img src="/bg.png" alt="" />
      </div>
    </div>
  );
}

export default Login;