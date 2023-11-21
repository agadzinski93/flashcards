import { useDispatch } from "react-redux";
import { setToken,logout } from "../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import {useState} from 'react'
import { useNavigate } from "react-router-dom";
type Inputs = {
    username:string,
    password:string
}

const LoginScreen = () => {
  const {register,handleSubmit,formState:{errors}} = useForm<Inputs>();
    const [loginError,setLoginError] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmission = async (data:Inputs)=>{
      
      const result = await fetch('/api/auth/login',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(data)
      });
      const final = await result.json();
      
      if (final.response === 'error') {
        dispatch(logout());
        setLoginError("Username or Email is Incorrect.");
      } else {
        dispatch(setToken(final.data.token));
        setLoginError("");
        navigate('/dashboard');
      }
    }
    const handleSubmissionError = () => {
      console.log('Something went wrong!');
    }

    return (
      <form onSubmit={handleSubmit(handleSubmission,handleSubmissionError)}>
        {loginError && <p>{loginError}</p>}
        <label htmlFor="username">Username: </label>
        <input {...register("username",{required:"Username is required",})} 
            id="username" type="text" placeholder="Enter Username Here" />
        {errors.username && <p>{errors.username?.message}</p>}

        <label htmlFor="password">Password: </label>
        <input {...register("password",{
            required:"Password is required.",})} 
            id="password" type="password" placeholder="Enter Password Here" />
        {errors.password && <p>{errors.password?.message}</p>}

        <button type="submit">Log In</button>
      </form>
    )
  }
  
  export default LoginScreen