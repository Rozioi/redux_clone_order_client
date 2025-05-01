import { IModCard } from "../interfaces/mod.interface";

export const testMods: IModCard[] = [
    {
        mod: {
            _id: "1",
            modName: "black redux",
            description: "Улучшает графику в игре до 4K разрешения",
            previewLink: "https://img.youtube.com/vi/Ht6X5Sez5z8/0.jpg",
            fileLink: "https://example.com/download/mod1.zip",
            youtubeLink: "dQw4w9WgXcQ",
            createdAt: "2023-01-15T10:30:00Z",
            rating: {
                like: 892,
                dislike: 24,
                downloads: 12500
            },
            size: '8.66GB',
            isVisibleDiscord: true,
            discord: "rozioi",
            categories: [
                { _id: "cat1", name: "redux" },
                { _id: "cat2", name: "privat" }
            ]
        }
    },
    {
        mod: {
            _id: "2",
            modName: "new black redux",
            description: "Режим выживания с экстремальными условиями",
            previewLink: "https://i.imgur.com/aImBbNo.png",
            fileLink: "https://example.com/download/mod2.zip",
            createdAt: new Date(2023, 1, 20), // Вариант с Date объектом
            rating: {
                like: 645,
                dislike: 38,
                downloads: 8700
            },
            size: '1.66GB',
            isVisibleDiscord: false,
            discord: "rozioi",
            categories: [
                { _id: "cat1", name: "redux" },
                { _id: "cat2", name: "privat" }
            ]
        }
    },
    {
        mod: {
            _id: "3",
            modName: "ULTRA FPS BOOST REDUX by quezik",
            description: "15 новых видов оружия",
            previewLink: "https://img.youtube.com/vi/K1C5r4haeCo/0.jpg",
            fileLink: "https://example.com/download/mod3.zip",
            youtubeLink: "9bZkp7q19f0",
            createdAt: "2023-03-10T08:45:00Z",
            rating: {
                like: 1204,
                dislike: 56,
                downloads: 15600
            },
            size: '4.41GB',
            isVisibleDiscord: true,
            discord: "rozioi",
            categories: [
                { _id: "cat1", name: "redux" },
                { _id: "cat2", name: "privat" }
            ]
        }
    },
    {
        mod: {
            _id: "4",
            modName: "V27 FLOW Sounds",
            description: "Полный редизайн интерфейса",
            previewLink: "https://img.youtube.com/vi/4YFEHonILo8/0.jpg",
            fileLink: "https://example.com/download/mod4.zip",
            createdAt: new Date(), // Текущая дата
            rating: {
                like: 321,
                dislike: 12,
                downloads: 4200
            },
            size: '0.66GB',
            isVisibleDiscord: false,
            discord: "rozioi",
            categories: [
                { _id: "cat4", name: "gunpack" },
                { _id: "cat5", name: "sounds" }
            ]
        }
    },
    {
        mod: {
            _id: "5",
            modName: "MOST BEAUTIFUL REDUX",
            description: "Переработанная звуковая система",
            previewLink: "https://i.imgur.com/Xln79jK.png",
            fileLink: "https://example.com/download/mod5.zip",
            youtubeLink: "y7SYN7VKJ4E",
            createdAt: "2022-11-05T16:20:00Z",
            rating: {
                like: 487,
                dislike: 19,
                downloads: 5300
            },
            size: '18.66GB',
            isVisibleDiscord: true,
            discord: "rozioi",
            categories: [
                { _id: "cat1", name: "redux" }
            ]
        }
    }
];