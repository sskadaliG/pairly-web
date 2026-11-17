import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";

const Chat = () => {
  // The :userId part of the URL /chat/:userId
  const { userId } = useParams();
  // The logged-in user, to tell my messages from theirs
  const me = useSelector((store) => store.user);
  // { user, messages } from the backend, or null while loading
  const [chat, setChat] = useState(null);
  const [error, setError] = useState("");
  // What's typed in the message box
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState("");
  // Keeps the socket between renders, so sendMessage can use the one the effect opened
  const socketRef = useRef(null);

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

  // Connect when the chat page opens, disconnect when it closes
  useEffect(() => {
    const socket = createSocketConnection();
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Chat connected:", socket.id);
    });
    // Runs when the backend's io.use refuses us, e.g. "Please login again"
    socket.on("connect_error", (err) => {
      console.log("Chat connection refused:", err.message);
    });

    // The backend sends every message I send or receive to my room, from all my chats.
    // Only add the ones that belong to the chat on this page.
    socket.on("newMessage", (message) => {
      if (message.fromUserId !== userId && message.toUserId !== userId) {
        return;
      }
      // Use the latest state (prev), and copy it instead of changing it
      setChat((prev) =>
        prev ? { ...prev, messages: [...prev.messages, message] } : prev,
      );
    });

    // Cleanup: React runs this when you leave the page
    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [userId]);

  const sendMessage = (e) => {
    e.preventDefault();
    const socket = socketRef.current;
    if (!text.trim() || !socket) {
      return;
    }

    setSending(true);
    setSendError("");
    // The last argument is the callback: the backend's reply({ ok, error }) runs it.
    // timeout gives up after 5 seconds, e.g. if the connection dropped.
    socket
      .timeout(5000)
      .emit("sendMessage", { toUserId: userId, text }, (err, reply) => {
        setSending(false);
        if (err) {
          setSendError("Couldn't reach the server. Please try again.");
        } else if (reply.ok) {
          // The message itself arrives through newMessage, so just clear the box
          setText("");
        } else {
          setSendError(reply.error);
        }
      });
  };

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
        <div className="w-full max-w-2xl">
          {messages.map((message) => {
            const isMine = message.fromUserId === me?._id;
            return (
              <div
                key={message._id}
                className={"chat " + (isMine ? "chat-end" : "chat-start")}
              >
                <div
                  className={
                    "chat-bubble " + (isMine ? "chat-bubble-primary" : "")
                  }
                >
                  {message.text}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <form onSubmit={sendMessage} className="flex w-full max-w-2xl gap-2">
        <input
          type="text"
          className="input flex-1"
          placeholder="Type a message"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={1000}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={sending || !text.trim()}
        >
          {sending ? (
            <span className="loading loading-spinner loading-sm"></span>
          ) : (
            "Send"
          )}
        </button>
      </form>

      {sendError && (
        <div role="alert" className="alert alert-error w-full max-w-2xl">
          <span>{sendError}</span>
        </div>
      )}
    </div>
  );
};

export default Chat;
