import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { removeUser } from "../utils/userSlice";
import { removeFeed } from "../utils/feedSlice";
import { removeRequests } from "../utils/requestsSlice";
import { BASE_URL } from "../utils/constants";
import { hasPhoto, getInitial } from "../utils/photo";

// daisyUI dropdowns stay open while focused, so blur to close after a click
const closeDropdown = () => document.activeElement?.blur();

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    closeDropdown();
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      dispatch(removeFeed());
      dispatch(removeRequests());
      navigate("/login");
    } catch (err) {
      console.log("error", err);
    }
  };

  return (
    <div className="navbar bg-blue-300 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl ml-1">
          <Link to="/">Pairly</Link>
        </a>
      </div>
      {user && (
        <div className="mr-4 flex items-center gap-3">
          <p>Welcome, {user.firstName}</p>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className={
                "btn btn-ghost btn-circle avatar" +
                (hasPhoto(user.photoURL) ? "" : " avatar-placeholder")
              }
            >
              {hasPhoto(user.photoURL) ? (
                <div className="w-10 rounded-full">
                  <img alt="User photo" src={user.photoURL} />
                </div>
              ) : (
                <div className="w-10 rounded-full bg-blue-600 text-white">
                  <span className="text-lg">{getInitial(user.firstName)}</span>
                </div>
              )}
            </div>
            <ul
              tabIndex={-1}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-52 p-2 shadow"
            >
              <li>
                <Link to="/profile" onClick={closeDropdown}>
                  Edit profile
                </Link>
              </li>
              <li>
                <Link to="/profile/password" onClick={closeDropdown}>
                  Edit Password
                </Link>
              </li>
              <li>
                <Link to="/requests" onClick={closeDropdown}>
                  Requests
                </Link>
              </li>
              <li>
                <button onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
