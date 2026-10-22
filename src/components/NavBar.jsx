import { useSelector } from "react-redux";

const NavBar = () => {
  const user = useSelector((store) => store.user);

  return (
    <div className="navbar bg-blue-300 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl ml-1">Pairly</a>
      </div>
      {user && (
        <div className="avatar mr-4">
          <div className="w-10 rounded-full">
            <img alt="User photo" src={user.photoURL} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;
