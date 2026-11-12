import { useParams } from "react-router-dom";

const Chat = () => {
  // The :userId part of the URL /chat/:userId
  const { userId } = useParams();

  return (
    <div className="flex flex-1 flex-col items-center gap-6 p-6">
      <h1 className="text-2xl font-semibold">Chat</h1>
      <p className="text-base-content/70">Chatting with user {userId}</p>
    </div>
  );
};

export default Chat;
