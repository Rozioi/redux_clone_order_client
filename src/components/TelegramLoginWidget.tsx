import { useEffect } from "react"
import {  TelegramUser } from "../@types/telegram";

type TTelegramWidget = {
  botId: string;
  onAuth?: (user: TelegramUser) => void;
};

const TelegramLoginWidget = ({ botId, onAuth }: TTelegramWidget) => {
  useEffect(() => {
    const button = document.createElement("script");
    button.src = "https://telegram.org/js/telegram-widget.js?22";
    button.setAttribute("data-telegram-login", botId);
    button.setAttribute("data-size", "large");
    button.setAttribute("data-radius", "20");
    button.setAttribute("data-onauth", "onTelegramAuth");
    button.async = true;

    window.onTelegramAuth = onAuth || ((user) => {
      alert("Авторизация через Telegram прошла успешно!");
    });

    document.body.appendChild(button);

    return () => {
      document.body.removeChild(button);
    };
  }, [botId, onAuth]);

  return <div id="telegram-widget-container"></div>
};

export default TelegramLoginWidget;