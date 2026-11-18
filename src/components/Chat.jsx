import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { createSocketConnection } from "../utils/socket";
import { hasPhoto, getInitial } from "../utils/photo";

// "2026-11-17T10:42:00.000Z" -> "10:42 AM", in the viewer's own time zone and style
const formatTime = (date) =>
  new Date(date).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });

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
  // Points at the scrolling messages area on the page, so we can scroll it
  const messagesRef = useRef(null);

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

  // Scroll to the newest message when the chat loads and whenever one arrives
  const messages = chat?.messages;
  useEffect(() => {
    const box = messagesRef.current;
    if (box) {
      // scrollHeight is the full height of everything inside, so this scrolls to the very bottom
      box.scrollTop = box.scrollHeight;
    }
  }, [messages]);

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

  const { user } = chat;

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-6">
      {/* The chat window: a fixed height, so only the messages scroll */}
      <div className="flex h-[70vh] w-full max-w-2xl flex-col rounded-box bg-base-100 shadow-md">
        {/* Header: back to connections, then who you're chatting with */}
        <div className="flex items-center gap-3 border-b border-base-300 p-3">
          <Link
            to="/connections"
            className="btn btn-circle btn-ghost btn-sm"
            aria-label="Back to connections"
          >
            ←
          </Link>
          {hasPhoto(user.photoURL) ? (
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img alt={user.firstName} src={user.photoURL} />
              </div>
            </div>
          ) : (
            <div className="avatar avatar-placeholder">
              <div className="w-10 rounded-full bg-primary text-primary-content">
                <span className="text-lg">{getInitial(user.firstName)}</span>
              </div>
            </div>
          )}
          <h1 className="text-lg font-semibold">
            {user.firstName + " " + user.lastName}
          </h1>
        </div>

        {/* flex-1 takes all the height the form doesn't use; overflow-y-auto adds a scrollbar when needed */}
        <div ref={messagesRef} className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <p className="text-center text-base-content/70">
              No messages yet. Say hi!
            </p>
          ) : (
            messages.map((message) => {
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
                  <div className="chat-footer opacity-50">
                    <time dateTime={message.createdAt}>
                      {formatTime(message.createdAt)}
                    </time>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <form
          onSubmit={sendMessage}
          className="flex gap-2 border-t border-base-300 p-3"
        >
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
      </div>

      {sendError && (
        <div role="alert" className="alert alert-error w-full max-w-2xl">
          <span>{sendError}</span>
        </div>
      )}
    </div>
  );
};

export default Chat;
