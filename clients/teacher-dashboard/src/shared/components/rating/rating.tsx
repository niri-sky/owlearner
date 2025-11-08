import cls from "classnames";
import { FaStar } from "react-icons/fa";
import React, { useState } from "react";

const Rating: React.FC<any> = ({
  maxStars,
  initialRating = 0,
  onRatingChange,
  isClickable = true,
  iconSize,
}) => {
  const [rating, setRating] = useState(initialRating);

  const handleStarClick = (starIndex: number) => {
    const newRating = starIndex + 1;
    setRating(newRating);

    if (onRatingChange) {
      onRatingChange(newRating);
    }
  };

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxStars }, (_, i) => (
        <span
          className={`text-sm ${cls(`${iconSize}`)}`}
          key={i}
          onClick={() => isClickable && handleStarClick(i)}
          style={{
            cursor: isClickable ? "pointer" : "default",
            color: i < rating ? "#FD8E1F" : "gray",
          }}
        >
          <FaStar />
        </span>
      ))}
    </div>
  );
};

export default Rating;
