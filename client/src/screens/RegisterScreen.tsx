import { useDispatch } from "react-redux";
import { setToken,logout } from "../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import {useState} from 'react'
import { useNavigate } from "react-router-dom";
type Inputs = {
    username:string,
    email:string,
    password:string,
    confirmPassword:string
}

const RegisterScreen = () => {
    const {register,handleSubmit,getValues,formState:{errors},setError} = useForm<Inputs>();
    const [passError,setPassError] = useState(false);
    const [exists,setUserExists] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmission = async (data:Inputs)=>{
      const passwordInputs = getValues(["password","confirmPassword"]);
      if (passwordInputs[0] === passwordInputs[1]) {
          setPassError(false);
          const result = await fetch('/api/auth/register',{
            method:'POST',
            headers:{
              'Content-Type':'application/json'
            },
            body:JSON.stringify(data)
          });
          const final = await result.json();
          
          if (final.response === 'error') {
            setUserExists(true);
            setError('username', {type:"custom",message:final.message});
            dispatch(logout());
          } else {
            setUserExists(false);
            dispatch(setToken(final.data.token));
            navigate('/dashboard');
          }
      } else {
          setPassError(true);
      }
    }
    const handleSubmissionError = () => {
      console.log('Something went wrong!');
    }

    return (
      <form onSubmit={handleSubmit(handleSubmission,handleSubmissionError)}>
        {exists && <p>Username or email already exists.</p>}
        <label htmlFor="username">Username: </label>
        <input {...register("username",{required:"Username is required",
            minLength:{value:6,message:"Username must be at least 6 characters."},
            maxLength:{value:24,message:"Username can be no more than 24 characters."}})} 
            id="username" type="text" placeholder="Enter Username Here" />
        {errors.username && <p>{errors.username?.message}</p>}

        <label htmlFor="email">Email: </label>
        <input {...register("email",{
            required:"Email is required.",
            minLength:{value:4,message:"Email must be at least 4 characters."},
            maxLength:{value:45,message:"Email can be no more than 45 characters."}})}
            id="email" type="email" placeholder="Enter Email Here" />
        {errors.email && <p>{errors.email?.message}</p>}

        <label htmlFor="password">Password: </label>
        <input {...register("password",{
            required:"Password is required.",
            minLength:{value:6,message:"Password must be at least 6 characters."},
            maxLength:{value:24,message:"Password can be no more than 24 characters."}})} 
            id="password" type="password" placeholder="Enter Password Here" />
        {errors.password && <p>{errors.password?.message}</p>}

        <label htmlFor="confirmPassword">Confirm Password: </label>
        <input {...register("confirmPassword",{
            required:"Please confirm your password.",
            minLength:6,
            maxLength:24})} 
            id="confirmPassword" type="password" placeholder="Enter Username Here" />
        {errors.confirmPassword && <p>{errors.confirmPassword?.message}</p>}
        {passError && <p>Passwords do not match.</p>}

        <button type="submit">Register</button>
      </form>
    )
  }
  
export default RegisterScreen