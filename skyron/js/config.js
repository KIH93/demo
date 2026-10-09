/* Все данные клиента в одном месте. Правьте здесь, страница подтянет их сама. */
window.SITE_CONFIG = {
  name: "Скайрон",
  nameLatin: "Skyron",
  tagline: "салон мобильной связи",
  since: 2002,

  address: "Казань, ул. Островского, 57в",
  addressDetails: "1 этаж, правое крыло, офис 1-07",
  district: "Вахитовский район",
  parking: "Рядом бесплатная парковка",
  coords: { lat: 55.784819, lon: 49.124143 },

  /* Режим работы: день недели (0 = вс, 1 = пн ... 6 = сб) -> [открытие, закрытие] или null */
  timezone: "Europe/Moscow",
  hours: {
    0: null,
    1: ["10:00", "18:00"],
    2: ["10:00", "18:00"],
    3: ["10:00", "18:00"],
    4: ["10:00", "18:00"],
    5: ["10:00", "18:00"],
    6: ["10:00", "15:00"]
  },

  /* Основные кнопки (шапка и нижняя панель на телефоне) */
  mainPhone: "+78432402403",
  mainPhoneText: "+7 (843) 240-24-03",
  mainWhatsApp: "79872908904",
  mainTelegram: "Skyron1",

  managers: [
    { name: "Евгений", phone: "+79872908904", phoneText: "+7 (987) 290-89-04", whatsapp: "79872908904", telegram: "Skyron1" },
    { name: "Дмитрий", phone: "+79172402403", phoneText: "+7 (917) 240-24-03", whatsapp: "79172402403", telegram: "Dimonikstar" }
  ],

  links: {
    telegramChannel: "https://t.me/skyron_apple",
    vk: "https://vk.com/skyron",
    instagram: "https://instagram.com/skyron_kzn/",
    gis: "https://go.2gis.com/97m02",
    yandex: "https://yandex.ru/maps/org/1064716815",
    yandexReviews: "https://yandex.ru/maps/org/1064716815/reviews/",
    price: "https://docs.google.com/spreadsheets/d/11mQwL7oV5bT6CgpWCnG1f26FoHwvAF0oTHXadsrSz4w/edit"
  },

  rating: { value: "4.8", votes: 214, reviews: 125, source: "2ГИС" }
};

/* Контакт разработчика демо (подвал) */
window.DEVELOPER_CONTACT = {
  name: "Ильдар",
  text: "Telegram @Ildar_kih",
  url: "https://t.me/Ildar_kih"
};
