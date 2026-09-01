export type Client = {
  id: string;
  name: string;
  role: string;
  avatar: string;
};

export const CLIENTS: Record<string, Client> = {
  sato: {
    id: "sato",
    name: "株式会社 Northstar",
    role: "佐藤 / Web 担当",
    avatar: "/assets/avatars/sato.svg",
  },
  yamada: {
    id: "yamada",
    name: "山田商店",
    role: "山田 / 店主",
    avatar: "/assets/avatars/yamada.svg",
  },
  takahashi: {
    id: "takahashi",
    name: "合同会社 Lumio",
    role: "高橋 / 広報",
    avatar: "/assets/avatars/takahashi.svg",
  },
  suzuki: {
    id: "suzuki",
    name: "Orion inc.",
    role: "鈴木 / 事業部",
    avatar: "/assets/avatars/suzuki.svg",
  },
  tanaka: {
    id: "tanaka",
    name: "Orion inc.",
    role: "田中 / エンジニア",
    avatar: "/assets/avatars/tanaka.svg",
  },
  ito: {
    id: "ito",
    name: "グリーン企画",
    role: "伊藤 / 制作進行",
    avatar: "/assets/avatars/ito.svg",
  },
  kato: {
    id: "kato",
    name: "合同会社 Mintpath",
    role: "加藤 / デザイナー",
    avatar: "/assets/avatars/kato.svg",
  },
  hayashi: {
    id: "hayashi",
    name: "Shopfolio",
    role: "林 / EC 担当",
    avatar: "/assets/avatars/hayashi.svg",
  },
  nakamura: {
    id: "nakamura",
    name: "Cloudnest",
    role: "中村 / PdM",
    avatar: "/assets/avatars/nakamura.svg",
  },
  watanabe: {
    id: "watanabe",
    name: "株式会社 Harbor",
    role: "渡辺 / マーケ",
    avatar: "/assets/avatars/watanabe.svg",
  },
  mori: {
    id: "mori",
    name: "森カフェ",
    role: "森 / 店主",
    avatar: "/assets/avatars/mori.svg",
  },
  aoki: {
    id: "aoki",
    name: "青木事務所",
    role: "青木 / 事務",
    avatar: "/assets/avatars/aoki.svg",
  },
  fujita: {
    id: "fujita",
    name: "Kite Inc.",
    role: "藤田 / エンジニア",
    avatar: "/assets/avatars/fujita.svg",
  },
  sasaki: {
    id: "sasaki",
    name: "Pencil Studio",
    role: "佐々木 / PM",
    avatar: "/assets/avatars/sasaki.svg",
  },
};

export const CLIENT_LIST = Object.values(CLIENTS);
