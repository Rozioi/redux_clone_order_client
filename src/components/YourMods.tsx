import React, { useState } from "react";
import styles from "../assets/YourMods.module.scss";
import { FaUpload, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import { AiOutlineFileMarkdown } from "react-icons/ai";

import { Notification } from "./Notification";

interface ModFormData {
  name: string;
  description: string;
  youtubeLink: string;
  downloadLink: string;
  isVisibleDiscord: boolean;
}

const YourMods: React.FC = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [formData, setFormData] = useState<ModFormData>({
    name: "",
    description: "",
    youtubeLink: "",
    downloadLink: "",
    isVisibleDiscord: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Добавить логику отправки данных на сервер
    setShowNotification(true);
    setNotificationMessage("Мод успешно добавлен!");
    setIsFormOpen(false);
    setFormData({
      name: "",
      description: "",
      youtubeLink: "",
      downloadLink: "",
      isVisibleDiscord: true
    });
  };

  const handleImagePaste = (e: React.ClipboardEvent) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf("image") !== -1) {
        const file = items[i].getAsFile();
        if (file) {
          // TODO: Добавить логику загрузки изображения
          setShowNotification(true);
          setNotificationMessage("Изображение загружено!");
        }
      }
    }
  };

  return (
    <div className={styles.yourMods}>
      <div className={styles.header}>
        <h1>Ваши моды</h1>
        <button 
          className={styles.uploadButton}
          onClick={() => setIsFormOpen(true)}
        >
          <FaUpload />
          Выложить мод
        </button>
      </div>

      {isFormOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Выложить новый мод</h2>
            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label>Название:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ультра мега хуита"
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Описание:</label>
                <div className={styles.markdownEditor}>
                  <div className={styles.toolbar}>
                    <button type="button">
                      <AiOutlineFileMarkdown />
                      Markdown
                    </button>
                  </div>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Поддерживает markdown"
                    onPaste={handleImagePaste}
                    required
                  />
                </div>
              </div>

              <div className={styles.formGroup}>
                <label>Ссылка на YouTube или imgur:</label>
                <input
                  type="text"
                  value={formData.youtubeLink}
                  onChange={(e) => setFormData({...formData, youtubeLink: e.target.value})}
                  placeholder="https://youtu.be/... или https://i.imgur.com/......png"
                  required
                />
                <p className={styles.hint}>
                  Вы можете вставить изображение прямо сюда, нажав Ctrl + V.
                </p>
              </div>

              <div className={styles.formGroup}>
                <label>Ссылка на Google / Yandex / Mega / Mediaire:</label>
                <input
                  type="text"
                  value={formData.downloadLink}
                  onChange={(e) => setFormData({...formData, downloadLink: e.target.value})}
                  placeholder="https://drive.google.com/..."
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={formData.isVisibleDiscord}
                    onChange={(e) => setFormData({...formData, isVisibleDiscord: e.target.checked})}
                  />
                  Скрыть Discord
                </label>
              </div>

              <div className={styles.formActions}>
                <button type="button" onClick={() => setIsFormOpen(false)}>
                  Отмена
                </button>
                <button type="submit">
                  Выложить
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className={styles.modsList}>
        {/* TODO: Добавить список модов пользователя */}
        <div className={styles.emptyState}>
          <p>У вас пока нет выложенных модов</p>
        </div>
      </div>

      <Notification 
        message={notificationMessage}
        show={showNotification}
        onHide={() => setShowNotification(false)}
      />
    </div>
  );
};

export default YourMods; 