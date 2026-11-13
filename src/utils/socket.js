import { io } from "socket.io-client";
import { BASE_URL } from "./constants";

// Opens a live connection to the backend. withCredentials sends the login cookie,
// which the backend's io.use checks before letting the connection in.
export const createSocketConnection = () =>
  io(BASE_URL, { withCredentials: true });
