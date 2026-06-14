import React, { useState } from 'react';

const StarRating = ({ value = 0, onChange, readonly = false, small = false }) => {
  const [hoverValue, setHoverValue] = useState(0);

  const displayValue = hoverValue || value;

  return (
    <div className={`star-rating ${small ? 'star-rating-small' : ''} ${readonly ? 'readonly' : ''}`}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${star <= displayValue ? 'filled' : ''}`}
          onMouseEnter={() => !readonly && setHoverValue(star)}
          onMouseLeave={() => !readonly && setHoverValue(0)}
          onClick={() => !readonly && onChange && onChange(star)}
          role={readonly ? undefined : 'button'}
          aria-label={`${star} star`}
        >
          &#9733;
        </span>
      ))}
    </div>
  );
};

export default StarRating;
