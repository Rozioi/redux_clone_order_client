import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IModCard } from "../interfaces/mod.interface";
import { testMods } from "../mocks/testMods";
import { FaInfo, FaShare, FaDownload, FaRegComments } from "react-icons/fa";
import { TbHeart, TbHeartBroken } from "react-icons/tb";
import styles from "../assets/ModDetail.module.scss";
import { copyClipboard, copyUrl } from "../utils/clipboard";
import { Notification } from "./Notification";

interface ModProps {
  mods?: IModCard[];
}

const ModDetail: React.FC<ModProps> = ({ mods = testMods }) => {
  const { id } = useParams<{ id: string }>();
  const [mod, setMod] = useState<IModCard | undefined>();
  const [showNotification, setShowNotification] = useState(false);
  const navigate = useNavigate();

  const formateDate = (data: Date | string | undefined): string => {
    if (!data) return "N/A";
    const date = new Date(data);
    const formDate = date.toLocaleDateString("ru-RU", {});
    return formDate;
  };

  const handleShare = () => {
    if (mod?.mod._id) {
      copyUrl(mod.mod._id, "/mod/");
      setShowNotification(true);
    }
  };

  useEffect(() => {
    const foundMod = mods.find((m) => m.mod._id === id);
    setMod(foundMod);
  }, [id, mods]);

  if (!mod) {
    return <div>Мод не найден</div>;
  }

  return (
    <div className={styles.modDetail}>
      <div className={styles.videoFrame}>
        <iframe
          src={`https://www.youtube.com/embed/${mod.mod.youtubeLink}`}
          title="YouTube video player"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <div className={styles.content}>
        <div className={styles.mainInfo}>
          <div className={styles.promoImage}>
            <img src="https://reduxhub.ru/assets/img/promo2.webp" alt="Promo" />
          </div>
          <div className={styles.infoBlock}>
            <h1 className={styles.title}>{mod.mod.modName}</h1>
            <div className={styles.categories}>
              {mod.mod.categories?.map((category) => (
                <div key={category._id} className={styles.category}>
                  {category.name}
                </div>
              ))}
            </div>
            <div className={styles.topActions}>
              <div className={styles.backButton} onClick={() => navigate(-1)}>
                Назад
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
              <span className={styles.date}>
                {formateDate(mod.mod.createdAt)}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.bottomActions}>
          <div className={styles.actionEstimateButton}>
            <div className={styles.actionButton}>
              <TbHeart />
              {mod.mod.rating.like}
            </div>
            <div className={styles.actionButton}>
              <TbHeartBroken />
              {mod.mod.rating.dislike}
            </div>
          </div>
          <button
            className={styles.shareButton}
            onClick={handleShare}
          >
            По приказу
            <FaShare />
          </button>
        </div>
      </div>
      <Notification 
        message="Ссылка скопирована!" 
        show={showNotification} 
        onHide={() => setShowNotification(false)} 
      />
    </div>
  );
};

export default ModDetail;
