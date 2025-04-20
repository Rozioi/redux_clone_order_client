import React from "react";
import styles from "../assets/ModCard.module.scss";
import { FaInfo, FaShare, FaDownload } from "react-icons/fa";
import { IModCard } from "../interfaces/mod.interface";
import { TbHeart, TbHeartBroken } from "react-icons/tb";

interface ModCardProps {
  mod: IModCard;
  sortOptions?: boolean;
}

const ModCard: React.FC<ModCardProps> = ({ mod, sortOptions }) => {
  return (
    <div className={styles.modCard}>
      <div className={styles.modImage}>
        {sortOptions && mod.mod.youtubeLink ? (
          <iframe
            src={`https://www.youtube.com/embed/${mod.mod.youtubeLink}`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className={styles.video}
          />
        ) : mod.mod.previewLink ? (
          <img
            src={mod.mod.previewLink}
            alt={mod.mod.modName}
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = "none";
              target.nextElementSibling?.classList.remove(styles.hidden);
            }}
          />
        ) : null}
      </div>
      <div className={styles.modInfo}>
        <h3 className={styles.modName}>{mod.mod.modName}</h3>

        <div className={styles.categories}>
          {mod.mod.categories?.map((category) => (
            <span key={category._id} className={styles.category}>
              {category.name}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <div className={styles.actionEstimateButton}>
            <div>
              <TbHeart />
            </div>
            <div>
              <TbHeartBroken />
            </div>
          </div>
          <button className={styles.actionButton}>
            По приказу
            <FaShare />
          </button>
        </div>

        <div className={styles.details}>
          <div className={styles.detailsButton}>
            <span>Details</span>
            <FaInfo />
          </div>
          <div className={styles.verified}>
            <span>Verifed</span>
            <span className={styles.verifiedIcon}>✓</span>
          </div>
          <button className={styles.downloadButton}>
            <span>{mod.mod.downloads?.toLocaleString() ?? 0}</span>
            <FaDownload />
          </button>
        </div>

        <div className={styles.metaInfo}>
          <span className={styles.size}>Размер: 2.5 MB</span>
          <span className={styles.date}>Дата: 12.03.2024</span>
        </div>
      </div>
    </div>
  );
};

export default ModCard;
