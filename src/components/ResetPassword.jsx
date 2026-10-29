import axios from "axios";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { validateResetPassword } from "../utils/validation";

const ResetPassword = () => {
  // The reset link looks like /reset-password?token=abc123
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  // Only show field errors after the first attempt
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields = { newPassword, confirmPassword };
  const errors = submitted ? validateResetPassword(fields) : {};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    setServerError("");

    if (Object.keys(validateResetPassword(fields)).length > 0) return;

    setLoading(true);
    try {
      await axios.post(
        BASE_URL + "/reset-password",
        { resetToken: token, newPassword },
        { withCredentials: true },
      );
      setDone(true);
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
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">Reset password</h2>

          {!token ? (
            // Opened without a token, e.g. typed the address by hand
            <>
              <div role="alert" className="alert alert-error alert-soft mt-2">
                <span>This reset link is missing its token.</span>
              </div>
              <p className="mt-4 text-center text-sm">
                <Link to="/forgot-password" className="link link-primary">
                  Request a new reset link
                </Link>
              </p>
            </>
          ) : done ? (
            <>
              <div
                role="status"
                className="alert alert-success alert-soft mt-2"
              >
                <span>Your password has been reset.</span>
              </div>
              <Link to="/login" className="btn btn-primary mt-4 w-full">
                Go to login
              </Link>
            </>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <fieldset className="fieldset">
                <label className="label" htmlFor="newPassword">
                  New password
                </label>
                <input
                  id="newPassword"
                  type="password"
                  className={
                    "input w-full" + (errors.newPassword ? " input-error" : "")
                  }
                  placeholder="New password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                {errors.newPassword && (
                  <p className="text-error">{errors.newPassword}</p>
                )}

                <label className="label mt-2" htmlFor="confirmPassword">
                  Confirm new password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={
                    "input w-full" +
                    (errors.confirmPassword ? " input-error" : "")
                  }
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && (
                  <p className="text-error">{errors.confirmPassword}</p>
                )}
              </fieldset>

              {serverError && (
                <div role="alert" className="alert alert-error alert-soft mt-2">
                  <span>{serverError}</span>
                </div>
              )}
              {serverError === "Reset link is invalid or has expired" && (
                <p className="mt-2 text-center text-sm">
                  <Link to="/forgot-password" className="link link-primary">
                    Request a new reset link
                  </Link>
                </p>
              )}

              <button
                type="submit"
                className="btn btn-primary mt-4 w-full"
                disabled={loading}
              >
                {loading && <span className="loading loading-spinner"></span>}
                Reset password
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
