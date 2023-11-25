import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { Navigate } from "react-router-dom";
import { useLogoutUserMutation } from "../../redux/apis/authApi";

interface RTKApiResponse {
  data: {
    response: string;
    message: string;
    data?: {
      token: string;
    };
  };
}

const Logout = () => {
  const dispatch = useDispatch();
  const [logoutUser, { error }] = useLogoutUserMutation();

  const handleLogoutUser = useCallback(async () => {
    const res = await logoutUser(null);
    let output = null;
    if ((res as RTKApiResponse).data) {
      output = (res as RTKApiResponse).data;
    }
    return output;
  }, [logoutUser]);

  useEffect(() => {
    handleLogoutUser()
      .then((data) => {
        if (data?.response === "success") {
          dispatch(logout());
        } else if (error) {
          throw Error("Error Logging Out");
        }
      })
      .catch((err) => {
        console.log(`Error Logging Out: ${err.message}`);
      });
  }, [handleLogoutUser, dispatch, error]);

  return <Navigate to="/" replace={true} />;
};

export default Logout;
