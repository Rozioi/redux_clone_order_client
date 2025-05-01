import styles from "../assets/Reviews.module.scss";
import React, {useState} from "react";
import { StarRating } from "./StarRating";

const Reviews: React.FC = () => {
  const [rating, setRating] = useState(0);
  return (
    <div className={styles.reviews}>
      <div className={styles.header}>
        <h1>Отзывы</h1>
      </div>
      <div className={styles.mainBlock}>
        <div className={styles.createReviewBlock}>
          <h1>Текст отзыва</h1>
          <p>Поддерживает <a href="https://www.markdownguide.org/basic-syntax/" target="_blank">Markdown</a></p>
          <textarea  placeholder="Ну давай давай, нападай"/>
          <div className={styles.reviewsHeart}>
            {/*   five heart */}
            <StarRating  />
          </div>
          <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                  />
                  Скрыть Discord
                </label>
              </div>
              <button>Отправить отзыв</button>
        </div>
        <div className={styles.reviewsBlock}></div>
      </div>
    </div>
  );
};

export default Reviews;
