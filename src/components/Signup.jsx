import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { validateSignup } from "../utils/validation";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("");
  // Only show field errors after the first signup attempt
  const [submitted, setSubmitted] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const fields = { firstName, lastName, email, password, gender };
  const errors = submitted ? validateSignup(fields) : {};

  const handleSignup = async (e) => {
    // Stop the browser from reloading the page on submit
    e.preventDefault();
    setSubmitted(true);
    setServerError("");
    setSuccess(false);

    if (Object.keys(validateSignup(fields)).length > 0) return;

    const body = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      password,
      gender,
    };

    setLoading(true);
    try {
      await axios.post(BASE_URL + "/signup", body, { withCredentials: true });
      setSuccess(true);
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
        <form className="card-body" onSubmit={handleSignup} noValidate>
          <h2 className="card-title justify-center text-2xl">Sign up</h2>

          <p className="text-center text-sm text-base-content/60">
            Fields marked <span className="text-error">*</span> are required
          </p>

          <fieldset className="fieldset">
            <label className="label" htmlFor="firstName">
              First name <span className="text-error">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              className={
                "input w-full" + (errors.firstName ? " input-error" : "")
              }
              placeholder="First name"
              autoComplete="given-name"
              maxLength={20}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            {errors.firstName && (
              <p className="text-error">{errors.firstName}</p>
            )}

            <label className="label mt-2" htmlFor="lastName">
              Last name <span className="text-error">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              className={
                "input w-full" + (errors.lastName ? " input-error" : "")
              }
              placeholder="Last name"
              autoComplete="family-name"
              maxLength={10}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            {errors.lastName && <p className="text-error">{errors.lastName}</p>}

            <label className="label mt-2" htmlFor="email">
              Email <span className="text-error">*</span>
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
              Password <span className="text-error">*</span>
            </label>
            <input
              id="password"
              type="password"
              className={
                "input w-full" + (errors.password ? " input-error" : "")
              }
              placeholder="Password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-error">{errors.password}</p>}

            <label className="label mt-2" htmlFor="gender">
              Gender <span className="text-error">*</span>
            </label>
            <select
              id="gender"
              className={
                "select w-full" + (errors.gender ? " select-error" : "")
              }
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="" disabled>
                Select gender
              </option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            {errors.gender && <p className="text-error">{errors.gender}</p>}
          </fieldset>

          {serverError && (
            <div role="alert" className="alert alert-error alert-soft mt-2">
              <span>{serverError}</span>
            </div>
          )}

          {success && (
            <div role="alert" className="alert alert-success alert-soft mt-2">
              <span>Account created!</span>
            </div>
          )}

          <div className="card-actions mt-4">
            <button
              type="submit"
              className="btn btn-primary w-full"
              disabled={loading}
            >
              {loading && <span className="loading loading-spinner"></span>}
              Sign up
            </button>
          </div>

          <p className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link to="/login" className="link link-primary">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
