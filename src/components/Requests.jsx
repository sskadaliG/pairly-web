import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UserCard from "./UserCard";
import { addRequests, removeRequest } from "../utils/requestsSlice";
import { BASE_URL } from "../utils/constants";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);
  const [reviewingId, setReviewingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/requests/received", {
          withCredentials: true,
        });
        // Skip requests whose sender no longer exists
        dispatch(addRequests(res.data.data.filter((r) => r.fromUserId)));
      } catch (err) {
        console.log("error", err);
        setError(err.response?.data?.message || err.message);
      }
    };

    // Always refetch so new requests show up when the page is opened
    fetchRequests();
  }, [dispatch]);

  // status is "accepted" or "rejected"
  const reviewRequest = async (status, requestId) => {
    setReviewingId(requestId);
    setError("");
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + requestId,
        {},
        { withCredentials: true },
      );
      dispatch(removeRequest(requestId));
    } catch (err) {
      // 404: already reviewed, so it no longer belongs in the list
      if (err.response?.status === 404) {
        dispatch(removeRequest(requestId));
      } else {
        setError(err.response?.data?.message || err.message);
      }
    } finally {
      setReviewingId(null);
    }
  };

  if (!requests) {
    return (
      <div className="flex flex-1 items-center justify-center">
        {error ? (
          <div role="alert" className="alert alert-error">
            <span>{error}</span>
          </div>
        ) : (
          <span className="loading loading-spinner loading-lg"></span>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Connection Requests</h1>

      {error && (
        <div role="alert" className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {requests.length === 0 ? (
        <p className="text-lg">No new connection requests.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {requests.map((request) => (
            <UserCard key={request._id} user={request.fromUserId}>
              <button
                className="btn btn-outline"
                disabled={reviewingId === request._id}
                onClick={() => reviewRequest("rejected", request._id)}
              >
                Reject
              </button>
              <button
                className="btn bg-blue-400 hover:bg-blue-500"
                disabled={reviewingId === request._id}
                onClick={() => reviewRequest("accepted", request._id)}
              >
                Accept
              </button>
            </UserCard>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
