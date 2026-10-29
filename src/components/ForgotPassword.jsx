import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { validateForgotPassword } from "../utils/validation";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  // Only show field errors after the first attempt
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const errors = submitted ? validateForgotPassword({ email }) : {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    setMessage("");

    if (Object.keys(validateForgotPassword({ email })).length > 0) return;

    setLoading(true);
    try {
      const res = await axios.post(
        BASE_URL + "/forgot-password",
        { email: email.trim() },
        { withCredentials: true },
      );
      // The backend sends the same message whether or not the email exists
      setMessage(res.data);
    } catch (err) {
      console.log("error", err);
      const data = err.response?.data;
      setServerError(
        (typeof data === "string" ? data : data?.message) || err.message,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-md">
        <form className="card-body" onSubmit={handleSubmit} noValidate>
          <h2 className="card-title justify-center text-2xl">
            Forgot password
          </h2>
          <p className="text-center text-sm text-base-content/70">
            Enter your email and we'll send you a link to reset your password.
          </p>

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
          </fieldset>

          {serverError && (
            <div role="alert" className="alert alert-error alert-soft mt-2">
              <span>{serverError}</span>
            </div>
          )}

          {message && (
            <div role="status" className="alert alert-success alert-soft mt-2">
              <span>{message}</span>
            </div>
          )}

          <div className="card-actions mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              Send reset link
            </button>
          </div>

          <p className="mt-4 text-center text-sm">
            Remembered it?{" "}
            <Link to="/login" className="link link-primary">
              Back to login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
