// StarRating.tsx
import { useState } from "react";
import styles from "../assets/Reviews.module.scss";

export const StarRating = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);

  return (
    <div className={styles.reviewsHeart}>
      {[...Array(5)].map((_, index) => {
        const ratingValue = index + 1;

        return (
          <button
            key={index}
            type="button"
            onClick={() => setRating(ratingValue)}
            onMouseEnter={() => setHover(ratingValue)}
            onMouseLeave={() => setHover(0)}
            className={styles.starButton}
          >
            <span
              className={`${styles.star} ${
                ratingValue <= (hover || rating) ? styles.filled : ""
              }`}
            >
              {ratingValue <= (hover || rating) ? "❤️" : "🤍"}
            </span>
          </button>
        );
      })}
    </div>
  );
};
