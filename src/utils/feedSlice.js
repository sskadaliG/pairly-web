import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => action.payload,
    removeFeed: () => null,
    removeUserFromFeed: (state, action) => {
      const remaining = state.filter((user) => user._id !== action.payload);
      // Back to null when the batch is used up, so Feed fetches the next batch
      return remaining.length > 0 ? remaining : null;
    },
  },
});

export const { addFeed, removeFeed, removeUserFromFeed } = feedSlice.actions;

export default feedSlice.reducer;
