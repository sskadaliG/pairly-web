import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);
  // Signup sends { newUser: true } when it navigates here
  const { state } = useLocation();
  const isNewUser = state?.newUser;

  // Wait until the logged-in user is loaded before showing the form
  if (!user) return null;

  return (
    <>
      {isNewUser && (
        <div className="px-6 pt-6">
          <div
            role="alert"
            className="alert alert-info alert-soft mx-auto max-w-3xl"
          >
            <span>
              Welcome to Pairly, {user.firstName}! Complete your profile to get
              better matches.
            </span>
            <Link to="/" className="link link-primary">
              Skip for now
            </Link>
          </div>
        </div>
      )}
      <EditProfile user={user} />
    </>
  );
};

export default Profile;
