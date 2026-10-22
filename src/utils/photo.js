import { DEFAULT_PHOTO_URL } from "./constants";

// True when the user has set their own photo
export const hasPhoto = (photoURL) =>
  Boolean(photoURL) && photoURL !== DEFAULT_PHOTO_URL;

export const getInitial = (firstName) =>
  firstName ? firstName.trim().charAt(0).toUpperCase() : "?";
