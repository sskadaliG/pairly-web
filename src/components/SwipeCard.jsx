import { useState } from "react";
import { animate, motion, useMotionValue, useTransform } from "motion/react";
import UserCard from "./UserCard";

// How far (in px) the card has to move for the tilt and labels to be at full strength
const SWIPE_DISTANCE = 150;

// Let go past this distance (px), or flick faster than this speed (px/s), to swipe
const SWIPE_THRESHOLD = 100;
const SWIPE_VELOCITY = 500;

// onSwipe(status) sends the request and returns true if the card can be removed
const SwipeCard = ({ user, onSwipe }) => {
  // True while the card flies away and the request is sent, so it can't be dragged again
  const [leaving, setLeaving] = useState(false);
  // x follows the drag: 0 is the middle, negative is left, positive is right
  const x = useMotionValue(0);

  // Turn the drag distance into a tilt: -15deg at full left, 15deg at full right
  const rotate = useTransform(x, [-SWIPE_DISTANCE, SWIPE_DISTANCE], [-15, 15]);

  // Fade the labels in as the card moves towards their side
  const interestedOpacity = useTransform(x, [20, SWIPE_DISTANCE], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_DISTANCE, -20], [1, 0]);

  // direction: 1 = right (interested), -1 = left (not interested)
  // Used by both dragging and the buttons, so they look the same
  const swipe = async (direction) => {
    setLeaving(true);
    // Fly off the screen on the side it was swiped to
    await animate(x, direction * window.innerWidth, { duration: 0.3 });

    const removed = await onSwipe(
      direction === 1 ? "interested" : "not_interested",
    );

    // The request failed, so bring the card back to try again
    if (!removed) {
      animate(x, 0);
      setLeaving(false);
    }
  };

  const handleDragEnd = (event, info) => {
    const { offset, velocity } = info;

    if (offset.x > SWIPE_THRESHOLD || velocity.x > SWIPE_VELOCITY) {
      swipe(1);
    } else if (offset.x < -SWIPE_THRESHOLD || velocity.x < -SWIPE_VELOCITY) {
      swipe(-1);
    }
    // Otherwise it wasn't far or fast enough: dragConstraints springs it back
  };

  return (
    <motion.div
      className="relative cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag={leaving ? false : "x"}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
      onDragEnd={handleDragEnd}
    >
      <motion.div
        className="pointer-events-none absolute top-8 left-6 z-10 -rotate-12 rounded-lg border-4 border-success bg-base-100/70 px-3 py-1 text-3xl font-extrabold tracking-wider text-success"
        style={{ opacity: interestedOpacity }}
      >
        INTERESTED
      </motion.div>
      <motion.div
        className="pointer-events-none absolute top-8 right-6 z-10 rotate-12 rounded-lg border-4 border-error bg-base-100/70 px-3 py-1 text-3xl font-extrabold tracking-wider text-error"
        style={{ opacity: nopeOpacity }}
      >
        NOPE
      </motion.div>

      <UserCard user={user}>
        <button
          className="btn btn-outline"
          disabled={leaving}
          onClick={() => swipe(-1)}
        >
          Ignore
        </button>
        <button
          className="btn btn-primary"
          disabled={leaving}
          onClick={() => swipe(1)}
        >
          Interested
        </button>
      </UserCard>
    </motion.div>
  );
};

export default SwipeCard;
