const NavBar = () => {
  return (
    <div className="navbar bg-blue-300 shadow-sm">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl ml-1">Pairly</a>
      </div>
      <div className="avatar mr-4">
        <div className="w-10 rounded-full">
          <img
            alt="User photo"
            src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
          />
        </div>
      </div>
    </div>
  );
};

export default NavBar;
