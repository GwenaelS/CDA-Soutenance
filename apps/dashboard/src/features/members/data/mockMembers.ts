import type { Member, ServerStats } from "@wystrelia/shared/types";

const getAvatar = (seed: string, type = 'bottts') =>
  `https://api.dicebear.com/7.x/${type}/svg?seed=${seed}`;

// Fake Data

// Génération de membres aléatoires par l'IA, à ne pas toucher sauf après validation du projet
// Pourra être supprimée quand l'api sera connectée au front-end

export const MOCK_STATS_WYSTRELIA: ServerStats = {
  total: 4812,
  online: 1247,
  new7d: 186,
  boosters: 38
};

export const MOCK_MEMBERS_WYSTRELIA: Member[] = [
  {
    id: "28461795028934656",
    username: "Lulu_la_Loutre",
    displayName: "@Lulu_la_Loutre",
    avatarUrl: getAvatar("loutre", "adventurer"),
    roles: [
      { name: "Admin", color: "#f43f5e" },
      { name: "Staff", color: "#3b82f6" }
    ],
    level: 95,
    levelProgress: 80,
    joinedAt: "12 mars 2023",
    status: "online",
    isBooster: true,
    boosterSince: "15 avril 2023"
  },
  {
    id: "87452109635241029",
    username: "PixelWiz",
    displayName: "@PixelWiz",
    avatarUrl: getAvatar("pixel", "bottts"),
    roles: [
      { name: "Modérateur", color: "#10b981" },
      { name: "Helper", color: "#06b6d4" }
    ],
    level: 92,
    levelProgress: 65,
    joinedAt: "12 mars 2023",
    status: "online",
    isBooster: false
  },
  {
    id: "54129876345091827",
    username: "GrosMinet",
    displayName: "@GrosMinet",
    avatarUrl: getAvatar("cat", "adventurer"),
    roles: [
      { name: "Booster", color: "#ec4899" },
      { name: "Actif", color: "#a855f7" }
    ],
    level: 78,
    levelProgress: 45,
    joinedAt: "14 mai 2023",
    status: "idle",
    isBooster: true,
    boosterSince: "1 juin 2023"
  },
  {
    id: "96853214785210364",
    username: "ShadowNinja",
    displayName: "@ShadowNinja",
    avatarUrl: getAvatar("ninja", "adventurer"),
    roles: [
      { name: "VIP", color: "#eab308" }
    ],
    level: 64,
    levelProgress: 90,
    joinedAt: "28 juin 2023",
    status: "dnd",
    isBooster: false
  },
  {
    id: "12547896358410293",
    username: "ChocoVanilla",
    displayName: "@ChocoVanilla",
    avatarUrl: getAvatar("choco", "adventurer"),
    roles: [
      { name: "Membre", color: "#94a3b8" }
    ],
    level: 45,
    levelProgress: 30,
    joinedAt: "05 août 2023",
    status: "offline",
    isBooster: false
  },
  {
    id: "36521478965412358",
    username: "Neo_Loup",
    displayName: "@Neo_Loup",
    avatarUrl: getAvatar("loup", "adventurer"),
    roles: [
      { name: "Actif", color: "#a855f7" }
    ],
    level: 82,
    levelProgress: 50,
    joinedAt: "19 sept. 2023",
    status: "online",
    isBooster: false
  },
  {
    id: "78965412301458962",
    username: "Sacha_Code",
    displayName: "@Sacha_Code",
    avatarUrl: getAvatar("sacha", "bottts"),
    roles: [
      { name: "Développeur", color: "#3b82f6" }
    ],
    level: 99,
    levelProgress: 98,
    joinedAt: "01 nov. 2023",
    status: "online",
    isBooster: true,
    boosterSince: "10 déc. 2023"
  },
  {
    id: "45879612302145896",
    username: "Alice_In_Webland",
    displayName: "@Alice_In_Webland",
    avatarUrl: getAvatar("alice", "adventurer"),
    roles: [
      { name: "Graphiste", color: "#f43f5e" },
      { name: "VIP", color: "#eab308" }
    ],
    level: 53,
    levelProgress: 25,
    joinedAt: "12 janv. 2024",
    status: "idle",
    isBooster: false
  },
  {
    id: "85967412302145896",
    username: "BotManiac",
    displayName: "@BotManiac",
    avatarUrl: getAvatar("botman", "bottts"),
    roles: [
      { name: "Membre", color: "#94a3b8" }
    ],
    level: 12,
    levelProgress: 15,
    joinedAt: "25 fév. 2024",
    status: "offline",
    isBooster: false
  },
  {
    id: "14528963254789632",
    username: "Dora_Explorer",
    displayName: "@Dora_Explorer",
    avatarUrl: getAvatar("dora", "adventurer"),
    roles: [
      { name: "Aventurier", color: "#10b981" }
    ],
    level: 30,
    levelProgress: 75,
    joinedAt: "08 mars 2024",
    status: "online",
    isBooster: false
  },
  {
    id: "96523147854123569",
    username: "Alpha_Centauri",
    displayName: "@Alpha_Centauri",
    avatarUrl: getAvatar("alpha", "bottts"),
    roles: [{ name: "VIP", color: "#eab308" }],
    level: 72,
    levelProgress: 40,
    joinedAt: "12 avril 2024",
    status: "online",
    isBooster: false
  },
  {
    id: "36521487965412302",
    username: "GamerPro_99",
    displayName: "@GamerPro_99",
    avatarUrl: getAvatar("gamer", "adventurer"),
    roles: [{ name: "Booster", color: "#ec4899" }],
    level: 88,
    levelProgress: 60,
    joinedAt: "20 mai 2024",
    status: "dnd",
    isBooster: true,
    boosterSince: "25 mai 2024"
  },
  {
    id: "78451296325874102",
    username: "Cyber_Punk",
    displayName: "@Cyber_Punk",
    avatarUrl: getAvatar("cyber", "bottts"),
    roles: [{ name: "Actif", color: "#a855f7" }],
    level: 61,
    levelProgress: 10,
    joinedAt: "01 juin 2024",
    status: "online",
    isBooster: false
  },
  {
    id: "14523698741258963",
    username: "Lady_Violet",
    displayName: "@Lady_Violet",
    avatarUrl: getAvatar("lady", "adventurer"),
    roles: [{ name: "Membre", color: "#94a3b8" }],
    level: 24,
    levelProgress: 85,
    joinedAt: "15 juin 2024",
    status: "idle",
    isBooster: false
  },
  {
    id: "85964123014589632",
    username: "Super_Crayon",
    displayName: "@Super_Crayon",
    avatarUrl: getAvatar("crayon", "adventurer"),
    roles: [{ name: "Graphiste", color: "#f43f5e" }],
    level: 42,
    levelProgress: 55,
    joinedAt: "02 juil. 2024",
    status: "offline",
    isBooster: false
  },
  {
    id: "32569874123654129",
    username: "Dragon_Flame",
    displayName: "@Dragon_Flame",
    avatarUrl: getAvatar("dragon", "adventurer"),
    roles: [{ name: "Membre", color: "#94a3b8" }],
    level: 37,
    levelProgress: 30,
    joinedAt: "18 juil. 2024",
    status: "online",
    isBooster: false
  },
  {
    id: "96587412365412987",
    username: "Zen_Master",
    displayName: "@Zen_Master",
    avatarUrl: getAvatar("zen", "adventurer"),
    roles: [{ name: "VIP", color: "#eab308" }],
    level: 80,
    levelProgress: 20,
    joinedAt: "30 août 2024",
    status: "online",
    isBooster: false
  },
  {
    id: "12365478965412365",
    username: "Néo_Vibe",
    displayName: "@Néo_Vibe",
    avatarUrl: getAvatar("neo", "bottts"),
    roles: [{ name: "Booster", color: "#ec4899" }, { name: "VIP", color: "#eab308" }],
    level: 70,
    levelProgress: 90,
    joinedAt: "12 sept. 2024",
    status: "dnd",
    isBooster: true,
    boosterSince: "15 oct. 2024"
  },
  {
    id: "78965412589632145",
    username: "Luna_Star",
    displayName: "@Luna_Star",
    avatarUrl: getAvatar("luna", "adventurer"),
    roles: [{ name: "Helper", color: "#06b6d4" }],
    level: 48,
    levelProgress: 70,
    joinedAt: "05 nov. 2024",
    status: "online",
    isBooster: false
  },
  {
    id: "45871236985474120",
    username: "Iron_Coder",
    displayName: "@Iron_Coder",
    avatarUrl: getAvatar("iron", "bottts"),
    roles: [{ name: "Développeur", color: "#3b82f6" }],
    level: 85,
    levelProgress: 45,
    joinedAt: "28 déc. 2024",
    status: "idle",
    isBooster: false
  },
  {
    id: "85214796325874125",
    username: "Choco_Chip",
    displayName: "@Choco_Chip",
    avatarUrl: getAvatar("chip", "adventurer"),
    roles: [{ name: "Membre", color: "#94a3b8" }],
    level: 19,
    levelProgress: 60,
    joinedAt: "15 janv. 2025",
    status: "offline",
    isBooster: false
  },
  {
    id: "36985214745896321",
    username: "Web_Surfer",
    displayName: "@Web_Surfer",
    avatarUrl: getAvatar("surf", "adventurer"),
    roles: [{ name: "Membre", color: "#94a3b8" }],
    level: 27,
    levelProgress: 80,
    joinedAt: "10 fév. 2025",
    status: "online",
    isBooster: false
  }
];

export const MOCK_STATS_VANILLE: ServerStats = {
  total: 1243,
  online: 310,
  new7d: 45,
  boosters: 12
};

export const MOCK_MEMBERS_VANILLE: Member[] = [
  {
    id: "11112222333344445",
    username: "Vanille_Chef",
    displayName: "@Vanille_Chef",
    avatarUrl: getAvatar("chef", "adventurer"),
    roles: [
      { name: "Admin", color: "#f43f5e" }
    ],
    level: 80,
    levelProgress: 40,
    joinedAt: "01 janv. 2024",
    status: "online",
    isBooster: false
  },
  {
    id: "55556666777788889",
    username: "Glacier_Fou",
    displayName: "@Glacier_Fou",
    avatarUrl: getAvatar("ice", "bottts"),
    roles: [
      { name: "Modérateur", color: "#10b981" }
    ],
    level: 65,
    levelProgress: 30,
    joinedAt: "15 fév. 2024",
    status: "idle",
    isBooster: true,
    boosterSince: "20 fév. 2024"
  },
  {
    id: "99990000111122223",
    username: "Fraise_Tagada",
    displayName: "@Fraise_Tagada",
    avatarUrl: getAvatar("fraise", "adventurer"),
    roles: [
      { name: "VIP", color: "#eab308" }
    ],
    level: 42,
    levelProgress: 80,
    joinedAt: "10 mars 2024",
    status: "online",
    isBooster: false
  },
  {
    id: "33334444555566667",
    username: "Sorbet_Citron",
    displayName: "@Sorbet_Citron",
    avatarUrl: getAvatar("lemon", "adventurer"),
    roles: [
      { name: "Membre", color: "#94a3b8" }
    ],
    level: 15,
    levelProgress: 20,
    joinedAt: "02 avril 2024",
    status: "offline",
    isBooster: false
  }
];

export const MOCK_STATS_DEV: ServerStats = {
  total: 450,
  online: 112,
  new7d: 14,
  boosters: 5
};

export const MOCK_MEMBERS_DEV: Member[] = [
  {
    id: "99988877766655544",
    username: "Linus_T",
    displayName: "@Linus_T",
    avatarUrl: getAvatar("linus", "bottts"),
    roles: [
      { name: "Owner", color: "#ef4444" },
      { name: "Dev", color: "#3b82f6" }
    ],
    level: 99,
    levelProgress: 99,
    joinedAt: "01 déc. 2022",
    status: "online",
    isBooster: true,
    boosterSince: "05 déc. 2022"
  },
  {
    id: "44455566677788899",
    username: "Ada_L",
    displayName: "@Ada_L",
    avatarUrl: getAvatar("ada", "adventurer"),
    roles: [
      { name: "Dev", color: "#3b82f6" }
    ],
    level: 88,
    levelProgress: 75,
    joinedAt: "15 déc. 2022",
    status: "online",
    isBooster: false
  },
  {
    id: "12312312312312312",
    username: "Git_Master",
    displayName: "@Git_Master",
    avatarUrl: getAvatar("git", "bottts"),
    roles: [
      { name: "Modérateur", color: "#10b981" }
    ],
    level: 54,
    levelProgress: 10,
    joinedAt: "10 janv. 2023",
    status: "dnd",
    isBooster: false
  }
];

export const MOCK_STATS_SIMPLON: ServerStats = {
  total: 820,
  online: 215,
  new7d: 32,
  boosters: 8
};

export const MOCK_MEMBERS_SIMPLON: Member[] = [
  {
    id: "77766655544433322",
    username: "Simplon_Coach",
    displayName: "@Simplon_Coach",
    avatarUrl: getAvatar("coach", "adventurer"),
    roles: [
      { name: "Admin", color: "#f43f5e" },
      { name: "Formateur", color: "#f97316" }
    ],
    level: 90,
    levelProgress: 50,
    joinedAt: "01 sept. 2023",
    status: "online",
    isBooster: true,
    boosterSince: "10 sept. 2023"
  },
  {
    id: "22233344455566677",
    username: "Apprenant_Vite",
    displayName: "@Apprenant_Vite",
    avatarUrl: getAvatar("student", "adventurer"),
    roles: [
      { name: "Apprenant", color: "#3b82f6" }
    ],
    level: 40,
    levelProgress: 60,
    joinedAt: "15 oct. 2023",
    status: "idle",
    isBooster: false
  },
  {
    id: "88877766655544433",
    username: "Simplon_Bot_Official",
    displayName: "@Simplon_Bot",
    avatarUrl: getAvatar("official", "bottts"),
    roles: [
      { name: "Bot", color: "#06b6d4" }
    ],
    level: 100,
    levelProgress: 0,
    joinedAt: "01 oct. 2023",
    status: "online",
    isBooster: false
  }
];
