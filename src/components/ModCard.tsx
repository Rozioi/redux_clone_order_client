import React, { useState } from "react";
import styles from "../assets/ModCard.module.scss";
import { FaInfo, FaShare, FaDownload, FaRegComments } from "react-icons/fa";

import { IModCard } from "../interfaces/mod.interface";
import { TbHeart, TbHeartBroken } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import Modal from "./Modal";
import { copyClipboard, copyUrl } from "../utils/clipboard";
import { Notification } from "./Notification";
interface ModCardProps {
  mod: IModCard;
  showVideo?: boolean;
}

const ModCard: React.FC<ModCardProps> = ({ mod, showVideo }) => {
  const navigate = useNavigate();
  const [showNotification, setShowNotification] = useState<boolean>(false);
  const handleShare = () => {
    if (mod?.mod._id) {
      copyUrl(mod.mod._id, "/mod/");
      setShowNotification(true);
    }
  };
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const formateDate = (data: Date | string | undefined): string => {
    if (!data) return "N/A";
    const date = new Date(data);
    const formDate = date.toLocaleDateString("ru-RU", {});
    return formDate;
  };

  return (
    <div className={styles.modCard}>
      <div className={styles.modImage}>
        {showVideo && mod.mod.youtubeLink ? (
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
            fetchPriority="high"
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

        <div className={styles.categoriesAndComments}>
          <div className={styles.categories}>
            {mod.mod.categories?.map((category) => (
              <span key={category._id} className={styles.category}>
                {category.name}
              </span>
            ))}
          </div>

          <button
            className={styles.commentsButton}
            onClick={() => setIsOpen(true)}
          >
            comments
            <FaRegComments />
          </button>
        </div>

        <div className={styles.actions}>
          <div className={styles.actionEstimateButton}>
            <div>
              <TbHeart />
              {mod.mod.rating.like}
            </div>
            <div>
              <TbHeartBroken />
              {mod.mod.rating.dislike}
            </div>
          </div>
          <button
            className={styles.actionButton}
            onClick={handleShare}
          >
            По приказу
            <FaShare />
          </button>
        </div>

        <div className={styles.details}>
          <div
            title="Описание и т.д"
            onClick={() => navigate(`/mod/${mod.mod._id}`)}
            className={styles.detailsButton}
          >
            <span>Details</span>
            <FaInfo />
          </div>
          <div className={styles.verified}>
            <span>Verifed</span>
            <span className={styles.verifiedIcon}>✓</span>
          </div>
          <button className={styles.downloadButton}>
            <span>{mod.mod.rating.downloads?.toLocaleString() ?? 0}</span>
            <FaDownload />
          </button>
        </div>

        <div className={styles.metaInfo}>
          <span
            onClick={(e: React.MouseEvent<HTMLSpanElement>) => {
              const target = e.currentTarget;
              const textToCopy = mod.mod.isVisibleDiscord
                ? mod.mod.discord
                : "скрыто";

              if (textToCopy) {
                copyClipboard(textToCopy);
                const originalText = target.textContent;
                target.textContent = "Скопировано!";
                setTimeout(() => {
                  target.textContent = originalText;
                }, 1500);
              }
            }}
            className={styles.discord}
          >
            {mod.mod.isVisibleDiscord ? `${mod.mod.discord}` : `скрыто`}
          </span>
          <span className={styles.size}>{mod.mod.size}</span>
          <span className={styles.date}>{formateDate(mod.mod.createdAt)}</span>
        </div>
      </div>
      <Modal isOpen={isOpen}>
        <div className={styles["modal-content"]}>
          <div className={styles["modal-header"]}>
            <h2>Комментариев пока нет. Будь первым!</h2>
            <button
              className={styles["closeButtonStyles"]}
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
          </div>
          <div className={styles["comment-input-container"]}>
            <textarea
              className={styles["comment-input"]}
              placeholder="Написать комментарий..."
              rows={3}
            />
            <button className={styles["submit-button"]}>Отправить</button>
          </div>
        </div>
      </Modal>
      <Notification
        message="Ссылка скопирована!"
        show={showNotification}
        onHide={() => setShowNotification(false)}
      />
    </div>
  );
};

export default ModCard;
