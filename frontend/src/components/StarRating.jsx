import React from "react";
import { FaRegStar, FaStar, FaStarHalfAlt } from "react-icons/fa";

const StarRating = ({ rating }) => {
  const stars = [];

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} className="text-yellow-400 w-4 h-4" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} className="text-yellow-400 w-4 h-4" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-gray-300 w-4 h-4" />);
    }
  }
  return <div className="flex">{stars}</div>;
};

export default StarRating;
