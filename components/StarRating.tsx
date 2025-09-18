
import React from 'react';
import { ICONS } from '../constants';

interface StarRatingProps {
  rating: number;
  reviewCount?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, reviewCount }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<span key={`full_${i}`}>{ICONS.starFull}</span>);
  }
  if (hasHalfStar) {
    stars.push(<span key="half">{ICONS.starHalf}</span>);
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(<span key={`empty_${i}`}>{ICONS.starEmpty}</span>);
  }

  return (
    <div className="flex items-center">
      {stars}
      {reviewCount && <span className="text-xs text-gray-500 ml-2">({reviewCount} reviews)</span>}
    </div>
  );
};

export default StarRating;
