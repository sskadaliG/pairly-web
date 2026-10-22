const UserCard = ({ user, children }) => {
  const { firstName, lastName, photoURL, age, gender, bio } = user;

  return (
    <div className="card w-80 bg-base-100 shadow-md">
      <figure>
        <img
          className="h-80 w-full object-cover"
          src={photoURL}
          alt={firstName + " " + lastName}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{firstName + " " + lastName}</h2>
        {(age || gender) && (
          <p className="flex-none text-sm text-base-content/70">
            {[age, gender].filter(Boolean).join(", ")}
          </p>
        )}
        <p>{bio}</p>
        {children && (
          <div className="card-actions mt-2 justify-center">{children}</div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
