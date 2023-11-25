import { useDispatch } from "react-redux";
import { setToken, logout } from "../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLoginUserMutation } from "../redux/apis/authApi";

import "./LoginScreen.scss";

type Inputs = {
  username: string;
  password: string;
};

interface RTKApiResponse {
  data: {
    response: string;
    message: string;
    data?: {
      token: string;
    };
  };
}

const LoginScreen = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const [loginError, setLoginError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loginUser, { isLoading }] = useLoginUserMutation();

  const handleSubmission = async (formData: Inputs) => {
    const res = await loginUser(formData);
    const final = (res as RTKApiResponse).data;

    if (final.response === "error") {
      dispatch(logout());
      setLoginError("Username or Email is Incorrect.");
    } else {
      dispatch(setToken(final.data?.token));
      setLoginError("");
      navigate("/dashboard");
    }
  };

  const handleSubmissionError = () => {
    console.log("Something went wrong!");
  };

  return !isLoading ? (
    <form
      className="loginRegisterForm"
      onSubmit={handleSubmit(handleSubmission, handleSubmissionError)}
    >
      <h1>Sign In</h1>
      {loginError && <p>{loginError}</p>}
      <input
        {...register("username", { required: "Username is required" })}
        id="username"
        type="text"
        placeholder="Enter Username Here"
      />
      {errors.username && <p>{errors.username?.message}</p>}

      <input
        {...register("password", {
          required: "Password is required.",
        })}
        id="password"
        type="password"
        placeholder="Enter Password Here"
      />
      {errors.password && <p>{errors.password?.message}</p>}

      <button type="submit">Sign In</button>
    </form>
  ) : (
    <p>Loading...</p>
  );
};

export default LoginScreen;
