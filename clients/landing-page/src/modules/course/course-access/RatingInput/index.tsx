import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

function RatingInput({
  className,
  onChange = (v) => {},
  height,
  width,
  value = 0,
}: {
  className?: string;
  onChange?: (rating: number) => any;
  height?: number | string;
  width?: number | string;
  value?: number;
}) {
  const [hoverCount, setHoverCount] = useState(0);

  return (
    <div className={"flex items-center gap-[5px] " + className}>
      {[...Array(5)].map((v, i) => (
        <motion.img
          height={height}
          width={width}
          key={i}
          whileTap={{ scale: 1.5 }}
          onMouseEnter={() => setHoverCount(i + 1)}
          onMouseLeave={() => setHoverCount(0)}
          src={
            !hoverCount
              ? i < value
                ? "/icons/star.svg"
                : "/icons/white-star.svg"
              : hoverCount < i + 1
              ? "/icons/white-star.svg"
              : "/icons/star.svg"
          }
          onClick={() => onChange(i + 1)}
          alt=""
          className="cursor-pointer"
        />
      ))}
    </div>
  );
}

export default RatingInput;
