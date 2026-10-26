import axios from "axios";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validate = (email, password) => {
  const errors = {};
  if (!email.trim()) {
    errors.email = "Email is required.";
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = "Enter a valid email, like you@example.com.";
  }
  if (!password) {
    errors.password = "Password is required.";
  }
  return errors;
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Only show field errors after the first login attempt
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const errors = submitted ? validate(email, password) : {};

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (Object.keys(validate(email, password)).length > 0) return;

    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/login",
        { email: email.trim(), password },
        { withCredentials: true }
      );
      dispatch(addUser(res.data.body));
      navigate("/");
    } catch (err) {
      console.log("error", err);
      const data = err.response?.data;
      setServerError(
        (typeof data === "string" ? data : data?.message) || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-md">
        <form className="card-body" onSubmit={handleLogin} noValidate>
          <h2 className="card-title justify-center text-2xl">Login</h2>

          <fieldset className="fieldset">
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className={"input w-full" + (errors.email ? " input-error" : "")}
              placeholder="you@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-error">{errors.email}</p>}

            <label className="label mt-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className={
                "input w-full" + (errors.password ? " input-error" : "")
              }
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && (
              <p className="text-error">{errors.password}</p>
            )}
          </fieldset>

          {serverError && (
            <div role="alert" className="alert alert-error alert-soft mt-2">
              <span>{serverError}</span>
            </div>
          )}

          <div className="card-actions mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              Login
            </button>
          </div>

          <p className="mt-4 text-center text-sm">
            New here?{" "}
            <Link to="/signup" className="link link-primary">
              Sign up
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
