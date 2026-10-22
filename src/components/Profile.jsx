import { useSelector } from "react-redux";
import EditProfile from "./EditProfile";

const Profile = () => {
  const user = useSelector((store) => store.user);

  // Wait until the logged-in user is loaded before showing the form
  if (!user) return null;

  return <EditProfile user={user} />;
};

export default Profile;
