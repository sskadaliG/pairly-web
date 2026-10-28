import { motion, useMotionValue, useTransform } from "motion/react";
import UserCard from "./UserCard";

// How far (in px) the card has to move for the tilt and labels to be at full strength
const SWIPE_DISTANCE = 150;

const SwipeCard = ({ user, children }) => {
  // x follows the drag: 0 is the middle, negative is left, positive is right
  const x = useMotionValue(0);

  // Turn the drag distance into a tilt: -15deg at full left, 15deg at full right
  const rotate = useTransform(x, [-SWIPE_DISTANCE, SWIPE_DISTANCE], [-15, 15]);

  // Fade the labels in as the card moves towards their side
  const interestedOpacity = useTransform(x, [20, SWIPE_DISTANCE], [0, 1]);
  const nopeOpacity = useTransform(x, [-SWIPE_DISTANCE, -20], [1, 0]);

  return (
    <motion.div
      className="relative cursor-grab active:cursor-grabbing"
      style={{ x, rotate }}
      drag="x"
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={1}
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

      <UserCard user={user}>{children}</UserCard>
    </motion.div>
  );
};

export default SwipeCard;
