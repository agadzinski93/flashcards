import { Outlet, Navigate } from "react-router-dom"
import { useSelector } from "react-redux/es/hooks/useSelector"

const PublicOnlyRoute = () => {
    const auth = useSelector(state => state.auth);
    return (
      (!auth.token) ? <Outlet /> : <Navigate to="/dashboard" replace={true} />
    )
}

export default PublicOnlyRoute