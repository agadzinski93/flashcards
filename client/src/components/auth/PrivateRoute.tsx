import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux/es/hooks/useSelector"

const PrivateRoute = () => {
  const auth = useSelector(state => state.auth);
  return (
    (auth.token) ? <Outlet /> : <Navigate to="/auth/login" replace={true} />
  )
}

export default PrivateRoute