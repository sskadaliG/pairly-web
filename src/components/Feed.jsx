import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import SwipeCard from "./SwipeCard";
import { addFeed, removeUserFromFeed } from "../utils/feedSlice";
import { BASE_URL } from "../utils/constants";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

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

  // status is "interested" or "not_interested"
  const handleSendRequest = async (status, userId) => {
    setSending(true);
    setError("");
    try {
      await axios.post(
        BASE_URL + "/request/send/" + status + "/" + userId,
        {},
        { withCredentials: true },
      );
      dispatch(removeUserFromFeed(userId));
    } catch (err) {
      // 400 (request already exists) or 404 (user gone): skip this card anyway
      if (err.response?.status === 400 || err.response?.status === 404) {
        dispatch(removeUserFromFeed(userId));
      } else {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setSending(false);
    }
  };

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
    <div className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      {/* key: a new person gets a fresh card, back in the middle */}
      <SwipeCard key={feed[0]._id} user={feed[0]}>
        <button
          className="btn btn-outline"
          disabled={sending}
          onClick={() => handleSendRequest("not_interested", feed[0]._id)}
        >
          Ignore
        </button>
        <button
          className="btn btn-primary"
          disabled={sending}
          onClick={() => handleSendRequest("interested", feed[0]._id)}
        >
          Interested
        </button>
      </SwipeCard>
      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default Feed;
