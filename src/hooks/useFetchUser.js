import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

// Pages that logged-out users are allowed to see
const PUBLIC_PATHS = ["/login", "/signup"];

const useFetchUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    // Already have the user (e.g. just logged in), no need to fetch again
    if (user) return;

    const fetchUser = async () => {
      try {
        const res = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(res.data));
      } catch (err) {
        // 401: no token or expired token, 404: user no longer exists
        if (err.response?.status === 401 || err.response?.status === 404) {
          if (!PUBLIC_PATHS.includes(pathname)) {
            navigate("/login");
          }
        } else {
          console.log("error", err);
        }
      }
    };

    fetchUser();
  }, [user, pathname, dispatch, navigate]);
};

export default useFetchUser;
