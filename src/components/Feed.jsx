import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UserCard from "./UserCard";
import { addFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  useEffect(() => {
    // Feed already loaded, no need to fetch again
    if (feed) return;

    const fetchFeed = async () => {
      try {
        const res = await axios.get(BASE_URL + "/feed", {
          withCredentials: true,
        });
        dispatch(addFeed(res.data.data));
      } catch (err) {
        console.log("error", err);
      }
    };

    fetchFeed();
  }, [feed, dispatch]);

  if (!feed) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (feed.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <p className="text-lg">No new people to show right now.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center p-4">
      <UserCard user={feed[0]}>
        <button className="btn btn-outline">Ignore</button>
        <button className="btn bg-blue-400 hover:bg-blue-500">Interested</button>
      </UserCard>
    </div>
  );
};

export default Feed;
