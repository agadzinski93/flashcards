import { useDispatch } from "react-redux";
import { setToken, logout } from "../redux/slices/authSlice";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterUserMutation } from "../redux/apis/authApi";

import "./LoginScreen.scss";

import type { RegisterInputs } from "../shared/interfaces/FormInputs.interface";
import type { RTKApiResponse } from "../shared/interfaces/RTKApiResponse.interface";

const RegisterScreen = () => {
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
    setError,
  } = useForm<RegisterInputs>();

  const [passError, setPassError] = useState(false);
  const [exists, setUserExists] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [registerUser, { isLoading }] = useRegisterUserMutation();

  const handleSubmission = async (data: RegisterInputs) => {
    const passwordInputs = getValues(["password", "confirmPassword"]);
    if (passwordInputs[0] === passwordInputs[1]) {
      setPassError(false);
      const res = await registerUser(data);
      const final = (res as RTKApiResponse)?.data;

      if (final.response === "error") {
        setUserExists(true);
        setError("username", { type: "custom", message: final.message });
        dispatch(logout());
      } else {
        setUserExists(false);
        dispatch(setToken(final.data?.token));
        navigate("/dashboard");
      }
    } else {
      setPassError(true);
    }
  };

  const handleSubmissionError = () => {};

  return isLoading ? (
    <p>Loading...</p>
  ) : (
    <form
      className="loginRegisterForm"
      onSubmit={handleSubmit(handleSubmission, handleSubmissionError)}
    >
      <h1>Register</h1>
      {exists && <p>Username or email already exists.</p>}
      <input
        {...register("username", {
          required: "Username is required",
          minLength: {
            value: 6,
            message: "Username must be at least 6 characters.",
          },
          maxLength: {
            value: 24,
            message: "Username can be no more than 24 characters.",
          },
        })}
        id="username"
        type="text"
        placeholder="Enter Username Here"
      />
      {errors.username && <p>{errors.username?.message}</p>}

      <input
        {...register("email", {
          required: "Email is required.",
          minLength: {
            value: 4,
            message: "Email must be at least 4 characters.",
          },
          maxLength: {
            value: 45,
            message: "Email can be no more than 45 characters.",
          },
        })}
        id="email"
        type="email"
        placeholder="Enter Email Here"
      />
      {errors.email && <p>{errors.email?.message}</p>}

      <input
        {...register("password", {
          required: "Password is required.",
          minLength: {
            value: 6,
            message: "Password must be at least 6 characters.",
          },
          maxLength: {
            value: 24,
            message: "Password can be no more than 24 characters.",
          },
        })}
        id="password"
        type="password"
        placeholder="Enter Password Here"
      />
      {errors.password && <p>{errors.password?.message}</p>}

      <input
        {...register("confirmPassword", {
          required: "Please confirm your password.",
          minLength: 6,
          maxLength: 24,
        })}
        id="confirmPassword"
        type="password"
        placeholder="Enter Username Here"
      />
      {errors.confirmPassword && <p>{errors.confirmPassword?.message}</p>}
      {passError && <p>Passwords do not match.</p>}

      <button type="submit">Register</button>
    </form>
  );
};

export default RegisterScreen;
