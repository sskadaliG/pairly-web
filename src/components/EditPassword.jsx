import { useState } from "react";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const EditPassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const savePassword = async () => {
    setError("");

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    try {
      await axios.patch(
        BASE_URL + "/profile/password",
        { currentPassword, newPassword },
        { withCredentials: true }
      );
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.log("error", err);
      setError(err.response?.data?.message || err.message);
    }
  };

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <div className="card w-full max-w-sm bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">Edit Password</h2>

          <fieldset className="fieldset">
            <label className="label" htmlFor="currentPassword">
              Current password
            </label>
            <input
              id="currentPassword"
              type="password"
              className="input w-full"
              autoComplete="current-password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />

            <label className="label mt-2" htmlFor="newPassword">
              New password
            </label>
            <input
              id="newPassword"
              type="password"
              className="input w-full"
              autoComplete="new-password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <label className="label mt-2" htmlFor="confirmPassword">
              Confirm new password
            </label>
            <input
              id="confirmPassword"
              type="password"
              className="input w-full"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <p className="label mt-1 whitespace-normal">
              At least 8 characters, with an uppercase letter, a lowercase
              letter, a number and a symbol.
            </p>
          </fieldset>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="card-actions mt-4">
            <button
              className="btn w-full bg-blue-400 hover:bg-blue-500"
              onClick={savePassword}
            >
              Update password
            </button>
          </div>
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Password updated successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditPassword;
