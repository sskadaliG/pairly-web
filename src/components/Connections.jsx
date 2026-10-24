import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import UserCard from "./UserCard";
import { addConnections } from "../utils/connectionsSlice";
import { BASE_URL } from "../utils/constants";

const Connections = () => {
  const dispatch = useDispatch();
  const connections = useSelector((store) => store.connections);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchConnections = async () => {
      try {
        const res = await axios.get(BASE_URL + "/user/connections", {
          withCredentials: true,
        });
        dispatch(addConnections(res.data.data));
      } catch (err) {
        console.log("error", err);
        setError(err.response?.data?.message || err.message);
      }
    };

    // Always refetch so newly accepted connections show up
    fetchConnections();
  }, [dispatch]);

  if (!connections) {
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
      <h1 className="text-2xl font-semibold">Connections</h1>

      {connections.length === 0 ? (
        <p className="text-lg">No connections yet.</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-6">
          {connections.map((connection) => (
            <UserCard key={connection._id} user={connection} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Connections;
