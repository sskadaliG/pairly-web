import { useState } from "react";
import { Link } from "react-router-dom";
import { validateSignup } from "../utils/validation";

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // Only show field errors after the first signup attempt
  const [submitted, setSubmitted] = useState(false);

  const fields = { firstName, lastName, email, password };
  const errors = submitted ? validateSignup(fields) : {};

  const handleSignup = (e) => {
    // Stop the browser from reloading the page on submit
    e.preventDefault();
    setSubmitted(true);

    if (Object.keys(validateSignup(fields)).length > 0) return;
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-md">
        <form className="card-body" onSubmit={handleSignup} noValidate>
          <h2 className="card-title justify-center text-2xl">Sign up</h2>

          <fieldset className="fieldset">
            <label className="label" htmlFor="firstName">
              First name
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
              Last name
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
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-error">{errors.password}</p>}
          </fieldset>

          <div className="card-actions mt-4">
            <button type="submit" className="btn btn-primary w-full">
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
