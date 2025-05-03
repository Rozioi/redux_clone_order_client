import React, { useState } from "react";
import styles from "../assets/ModList.module.scss";
import {
  FaSortAmountDown,
  FaSortAmountUp,
  FaSearch,
  FaImage,
  FaVideo,
} from "react-icons/fa";
import { testMods } from "../mocks/testMods";
import { IModCard } from "../interfaces/mod.interface";
import ModCard from "./ModCard";

interface ModListProps {
  mods?: IModCard[];
}

const ModList: React.FC<ModListProps> = ({ mods = testMods }) => {
  const [sortBy, setSortBy] = useState<"downloads" | "date">("downloads");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [showVideo, setShowVideo] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState("");

  const sortedMods = [...mods]
    .filter((mod) =>
      mod.mod.modName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === "downloads") {
        const downloadsA = a.mod.rating.downloads ?? 0;
        const downloadsB = b.mod.rating.downloads ?? 0;
        return sortOrder === "asc"
          ? downloadsA - downloadsB
          : downloadsB - downloadsA;
      } else {
        const dateA = a.mod.createdAt ? new Date(a.mod.createdAt).getTime() : 0;
        const dateB = b.mod.createdAt ? new Date(b.mod.createdAt).getTime() : 0;
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      }
    });

  return (
    <div className={styles.modList}>
      <div className={styles.controls}>
        <div className={styles.controlsGroup}>
          <div className={styles.sortContainer}>
            <label className={styles.sortLabel}>Сортировать по:</label>
            <div className={styles.sortGroup}>
              <select
                className={styles.sortSelect}
                value={sortBy}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === "date" || value === "downloads") {
                    setSortBy(value);
                  }
                }}
              >
                <option value="date">Дате</option>
                <option value="downloads">Количество загрузок</option>
              </select>
              <button
                className={styles.sortDirection}
                onClick={() =>
                  setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                }
                title={sortOrder === "asc" ? "По убыванию" : "По возрастанию"}
              >
                {sortOrder === "asc" ? (
                  <FaSortAmountDown />
                ) : (
                  <FaSortAmountUp />
                )}
              </button>
            </div>
          </div>

          {/* Добавлен отсутствующий поиск и переключатель */}
          <div className={styles.searchContainer}>
            <FaSearch className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Поиск модов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          <div
            className={`${styles.previewType} ${
              showVideo ? styles.videoActive : ""
            }`}
          >
            <button
              onClick={() => setShowVideo(false)}
              className={`${styles.previewButton} ${
                !showVideo ? styles.active : ""
              }`}
            >
              <span>Картинка</span>
            </button>
            <button
              onClick={() => setShowVideo(true)}
              className={`${styles.previewButton} ${
                showVideo ? styles.active : ""
              }`}
            >
              <span>Видео</span>
            </button>
          </div>
        </div>
      </div>

      <div className={styles.modsGrid}>
        {sortedMods.map((mod) => (
          <ModCard key={mod.mod._id} mod={mod} showVideo={showVideo} />
        ))}
      </div>
    </div>
  );
};

export default ModList;
