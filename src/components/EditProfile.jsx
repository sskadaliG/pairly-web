import { useState } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import UserCard from "./UserCard";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const EditProfile = ({ user }) => {
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [photoURL, setPhotoURL] = useState(user.photoURL || "");
  const [age, setAge] = useState(user.age || "");
  const [gender, setGender] = useState(user.gender || "");
  const [bio, setBio] = useState(user.bio || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const dispatch = useDispatch();

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        {
          firstName,
          lastName,
          photoURL,
          age: age ? Number(age) : undefined,
          gender,
          bio,
        },
        { withCredentials: true }
      );
      dispatch(addUser(res.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.log("error", err);
      // No response means the request never reached the server (network or CORS issue)
      setError(err.response?.data || err.message);
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-start justify-center gap-8 p-6">
      <div className="card w-full max-w-md bg-base-100 shadow-md">
        <div className="card-body">
          <h2 className="card-title justify-center text-2xl">Edit Profile</h2>

          <fieldset className="fieldset">
            <label className="label" htmlFor="firstName">
              First name
            </label>
            <input
              id="firstName"
              type="text"
              className="input w-full"
              maxLength={20}
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            <label className="label mt-2" htmlFor="lastName">
              Last name
            </label>
            <input
              id="lastName"
              type="text"
              className="input w-full"
              maxLength={10}
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            <label className="label mt-2" htmlFor="photoURL">
              Photo URL
            </label>
            <input
              id="photoURL"
              type="url"
              className="input w-full"
              maxLength={200}
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
            />

            <label className="label mt-2" htmlFor="age">
              Age
            </label>
            <input
              id="age"
              type="number"
              className="input w-full"
              min={18}
              max={100}
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />

            <label className="label mt-2" htmlFor="gender">
              Gender
            </label>
            <select
              id="gender"
              className="select w-full"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <label className="label mt-2" htmlFor="bio">
              Bio
            </label>
            <textarea
              id="bio"
              className="textarea w-full"
              maxLength={200}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </fieldset>

          {error && <p className="text-sm text-error">{error}</p>}

          <div className="card-actions mt-4">
            <button
              className="btn btn-primary w-full"
              onClick={saveProfile}
            >
              Save profile
            </button>
          </div>
        </div>
      </div>

      <UserCard
        user={{ firstName, lastName, photoURL, age, gender, bio }}
      />

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile saved successfully.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;
