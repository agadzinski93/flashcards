import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux/es/hooks/useSelector";

interface authObject {
  auth: {
    token: string | null;
  };
}

const PublicOnlyRoute = () => {
  const auth = useSelector((state: authObject) => state.auth);
  return !auth.token ? <Outlet /> : <Navigate to="/dashboard" replace={true} />;
};

export default PublicOnlyRoute;
