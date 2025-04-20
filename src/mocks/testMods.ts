import { IModCard } from "../interfaces/mod.interface";

export const testMods: IModCard[] = [
    {
        mod: {

            _id: "1",
            modName: "Super Graphics Pack",
            description: "Улучшает графику в игре до 4K разрешения",
            previewLink: "https://i.pinimg.com/originals/46/e1/e9/46e1e92adf9e6fc8c87aebf1dd1513d8.jpg",
            fileLink: "https://example.com/download/mod1.zip",
            youtubeLink: "dQw4w9WgXcQ", // ID видео (пример - Rick Astley)
            downloads: 12500,
            categories: [
                { _id: "cat1", name: "redux" },
                { _id: "cat2", name: "freeprivat" }
            ]
        }
    },
    {
        mod: {

            _id: "2",
            modName: "Survival Mode+",
            description: "Добавляет сложный режим выживания с новыми механиками",
            previewLink: "https://avatars.mds.yandex.net/i?id=01d05a615c421bbfa4676ba15a7fed2d_l-5235427-images-thumbs&n=13",
            fileLink: "https://example.com/download/mod2.zip",
            downloads: 8700,
            categories: [
                { _id: "cat3", name: "gunpack" }
            ]
        }
    },
    {
        mod: {


            _id: "3",
            modName: "New Weapons Pack",
            description: "10 новых видов оружия с уникальными анимациями",
            previewLink: "https://i.pinimg.com/originals/c8/14/7e/c8147e4273c0e4d78168962504e1d4c7.jpg",
            fileLink: "https://example.com/download/mod3.zip",
            youtubeLink: "9bZkp7q19f0", // Другой пример видео
            downloads: 15600,
            categories: [
                { _id: "cat3", name: "gunpack" }
            ]
        }
    }
];