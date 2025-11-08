import { Icons } from "@/shared/utils/Icon";
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
    <div
      className={`flex items-center gap-1 ${
        isClickable ? "cursor-pointer" : ""
      }`}
    >
      {Array.from({ length: maxStars }, (_, i) => {
        let starColor = "gray";
        if (i < Math.floor(rating)) {
          starColor = "#FD8E1F";
        } else if (i === Math.floor(rating) && rating % 1 !== 0) {
          const decimalPartWidth = (rating % 1) * 100;
          return (
            <span
              className={`text-sm ${iconSize}`}
              key={i}
              onClick={() => isClickable && handleStarClick(i)}
              style={{
                color: starColor,
                position: "relative",
                width: "1em",
              }}
            >
              {Icons.starSolid}
              <span
                style={{
                  position: "absolute",
                  overflow: "hidden",
                  width: `${decimalPartWidth}%`,
                  color: "#FD8E1F",
                }}
              >
                {Icons.starSolid}
              </span>
            </span>
          );
        }
        return (
          <span
            className={`text-sm ${iconSize}`}
            key={i}
            onClick={() => isClickable && handleStarClick(i)}
            style={{
              color: starColor,
            }}
          >
            {Icons.starSolid}
          </span>
        );
      })}
    </div>
  );
};

export default Rating;
