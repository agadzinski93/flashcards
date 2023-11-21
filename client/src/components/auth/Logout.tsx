import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { logout } from "../../redux/slices/authSlice"
import { Navigate } from "react-router-dom"

const Logout = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    const logoutUser = async () => {
        const result = await fetch('/api/auth/logout',{
            method:'GET'
        });
        return result;
    }
    logoutUser().then(async (data)=>{
        const result = await data.json();
        if (result.response === 'success') {
            dispatch(logout());
        }
    }).catch((err) => {
        console.log(err.message);
    })
  },[dispatch]);
  return (
    <Navigate to="/" replace={true} />
  )
}

export default Logout