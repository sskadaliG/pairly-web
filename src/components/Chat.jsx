import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  // The :userId part of the URL /chat/:userId
  const { userId } = useParams();
  // { user, messages } from the backend, or null while loading
  const [chat, setChat] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchChat = async () => {
      try {
        const res = await axios.get(BASE_URL + "/chat/" + userId, {
          withCredentials: true,
        });
        setChat(res.data.data);
      } catch (err) {
        console.log("error", err);
        setError(err.response?.data?.message || err.message);
      }
    };

    fetchChat();
  }, [userId]);

  if (!chat) {
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

  const { user, messages } = chat;

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">
        {user.firstName + " " + user.lastName}
      </h1>

      {messages.length === 0 ? (
        <p className="text-base-content/70">No messages yet. Say hi!</p>
      ) : (
        <ul>
          {messages.map((message) => (
            <li key={message._id}>{message.text}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Chat;
