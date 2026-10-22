import { hasPhoto, getInitial } from "../utils/photo";

const UserCard = ({ user, children }) => {
  const { firstName, lastName, photoURL, age, gender, bio } = user;

  return (
    <div className="card w-80 bg-base-100 shadow-md">
      <figure>
        {hasPhoto(photoURL) ? (
          <img
            className="h-80 w-full object-cover"
            src={photoURL}
            alt={firstName + " " + lastName}
          />
        ) : (
          <div className="flex h-80 w-full items-center justify-center bg-blue-200 text-9xl font-semibold text-blue-700">
            {getInitial(firstName)}
          </div>
        )}
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
