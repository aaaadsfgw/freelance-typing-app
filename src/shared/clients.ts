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
    name: "WebApp部",
    role: "田中 / バックエンド",
    avatar: "/assets/avatars/tanaka.svg",
  },
  ito: {
    id: "ito",
    name: "WebApp部",
    role: "伊藤 / フロントエンド",
    avatar: "/assets/avatars/ito.svg",
  },
  kato: {
    id: "kato",
    name: "WebApp部",
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
    name: "WebApp部",
    role: "中村 / PM",
    avatar: "/assets/avatars/nakamura.svg",
  },
  watanabe: {
    id: "watanabe",
    name: "営業部",
    role: "渡辺 / 営業",
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
    name: "WebApp部",
    role: "青木 / QA",
    avatar: "/assets/avatars/aoki.svg",
  },
  fujita: {
    id: "fujita",
    name: "WebApp部",
    role: "藤田 / インフラ",
    avatar: "/assets/avatars/fujita.svg",
  },
  sasaki: {
    id: "sasaki",
    name: "WebApp部",
    role: "佐々木 / 上長",
    avatar: "/assets/avatars/sasaki.svg",
  },
};

export const CLIENT_LIST = Object.values(CLIENTS);
