import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { logout } from "../../redux/slices/authSlice"
import { Navigate } from "react-router-dom"

type responseData = {
  response : string,
  message: string
}

const Logout = () => {
  const dispatch = useDispatch();

  const logoutUser = async () => {
      const result = await fetch('/api/auth/logout',{
        method:'POST',
        headers:{
          'Content-Type':'application/json'
        }
      });
      const data = await result.json();
      return data;
  }
  useEffect(()=>{
    logoutUser().then((data : responseData)=>{
        if (data.response === 'success') {
            dispatch(logout());
        }
    }).catch((err) => {
      console.log(`Error Logging Out: ${err.message}`);
    })
  },[dispatch]);
  return (
    <Navigate to="/" replace={true} />
  )
}

export default Logout