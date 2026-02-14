export interface AlbionItem {
  id: string;
  name: { en: string; pt: string };
  category: { en: string; pt: string };
  tier: number;
  recipe?: { itemId: string; quantity: number }[];
}

function gen(
  baseId: string,
  nameEn: string,
  namePt: string,
  catEn: string,
  catPt: string,
  tiers: number[],
  resourceId: string,
  quantity: number
): AlbionItem[] {
  return tiers.map((t) => ({
    id: `T${t}_${baseId}`,
    name: { en: `${nameEn} (T${t})`, pt: `${namePt} (T${t})` },
    category: { en: catEn, pt: catPt },
    tier: t,
    recipe: [{ itemId: `T${t}_${resourceId}`, quantity }],
  }));
}

function genResource(
  baseId: string,
  nameEn: string,
  namePt: string,
  tiers: number[]
): AlbionItem[] {
  return tiers.map((t) => ({
    id: `T${t}_${baseId}`,
    name: { en: `${nameEn} (T${t})`, pt: `${namePt} (T${t})` },
    category: { en: "Resources", pt: "Recursos" },
    tier: t,
  }));
}

export const ITEMS: AlbionItem[] = [
  // Bags
  ...gen("BAG", "Bag", "Bolsa", "Bags", "Bolsas", [4, 5, 6, 7, 8], "LEATHER", 8),

  // Capes
  ...gen("CAPE", "Cape", "Capa", "Capes", "Capas", [4, 5, 6, 7, 8], "CLOTH", 12),

  // Scholar Set (Cloth)
  ...gen("HEAD_CLOTH_SET1", "Scholar Cowl", "Capuz do Estudioso", "Cloth Armor", "Armadura de Tecido", [4, 5, 6, 7, 8], "CLOTH", 16),
  ...gen("ARMOR_CLOTH_SET1", "Scholar Robe", "Manto do Estudioso", "Cloth Armor", "Armadura de Tecido", [4, 5, 6, 7, 8], "CLOTH", 32),
  ...gen("SHOES_CLOTH_SET1", "Scholar Sandals", "Sandálias do Estudioso", "Cloth Armor", "Armadura de Tecido", [4, 5, 6, 7, 8], "CLOTH", 16),

  // Mage Set (Cloth)
  ...gen("HEAD_CLOTH_SET2", "Cleric Cowl", "Capuz do Clérigo", "Cloth Armor", "Armadura de Tecido", [4, 5, 6, 7, 8], "CLOTH", 16),
  ...gen("ARMOR_CLOTH_SET2", "Cleric Robe", "Manto do Clérigo", "Cloth Armor", "Armadura de Tecido", [4, 5, 6, 7, 8], "CLOTH", 32),
  ...gen("SHOES_CLOTH_SET2", "Cleric Sandals", "Sandálias do Clérigo", "Cloth Armor", "Armadura de Tecido", [4, 5, 6, 7, 8], "CLOTH", 16),

  // Hunter Set (Leather)
  ...gen("HEAD_LEATHER_SET1", "Mercenary Hood", "Capuz do Mercenário", "Leather Armor", "Armadura de Couro", [4, 5, 6, 7, 8], "LEATHER", 16),
  ...gen("ARMOR_LEATHER_SET1", "Mercenary Jacket", "Jaqueta do Mercenário", "Leather Armor", "Armadura de Couro", [4, 5, 6, 7, 8], "LEATHER", 32),
  ...gen("SHOES_LEATHER_SET1", "Mercenary Shoes", "Sapatos do Mercenário", "Leather Armor", "Armadura de Couro", [4, 5, 6, 7, 8], "LEATHER", 16),

  // Hunter Set 2 (Leather)
  ...gen("HEAD_LEATHER_SET2", "Hunter Hood", "Capuz do Caçador", "Leather Armor", "Armadura de Couro", [4, 5, 6, 7, 8], "LEATHER", 16),
  ...gen("ARMOR_LEATHER_SET2", "Hunter Jacket", "Jaqueta do Caçador", "Leather Armor", "Armadura de Couro", [4, 5, 6, 7, 8], "LEATHER", 32),
  ...gen("SHOES_LEATHER_SET2", "Hunter Shoes", "Sapatos do Caçador", "Leather Armor", "Armadura de Couro", [4, 5, 6, 7, 8], "LEATHER", 16),

  // Soldier Set (Plate)
  ...gen("HEAD_PLATE_SET1", "Soldier Helmet", "Elmo do Soldado", "Plate Armor", "Armadura de Placas", [4, 5, 6, 7, 8], "METALBAR", 16),
  ...gen("ARMOR_PLATE_SET1", "Soldier Armor", "Armadura do Soldado", "Plate Armor", "Armadura de Placas", [4, 5, 6, 7, 8], "METALBAR", 32),
  ...gen("SHOES_PLATE_SET1", "Soldier Boots", "Botas do Soldado", "Plate Armor", "Armadura de Placas", [4, 5, 6, 7, 8], "METALBAR", 16),

  // Knight Set (Plate)
  ...gen("HEAD_PLATE_SET2", "Knight Helmet", "Elmo do Cavaleiro", "Plate Armor", "Armadura de Placas", [4, 5, 6, 7, 8], "METALBAR", 16),
  ...gen("ARMOR_PLATE_SET2", "Knight Armor", "Armadura do Cavaleiro", "Plate Armor", "Armadura de Placas", [4, 5, 6, 7, 8], "METALBAR", 32),
  ...gen("SHOES_PLATE_SET2", "Knight Boots", "Botas do Cavaleiro", "Plate Armor", "Armadura de Placas", [4, 5, 6, 7, 8], "METALBAR", 16),

  // Weapons - Swords
  ...gen("MAIN_SWORD", "Broadsword", "Espada Larga", "Swords", "Espadas", [4, 5, 6, 7, 8], "METALBAR", 20),
  ...gen("2H_CLAYMORE", "Claymore", "Claymore", "Swords", "Espadas", [4, 5, 6, 7, 8], "METALBAR", 32),

  // Weapons - Axes
  ...gen("MAIN_AXE", "Battleaxe", "Machado de Batalha", "Axes", "Machados", [4, 5, 6, 7, 8], "METALBAR", 20),
  ...gen("2H_HALBERD", "Halberd", "Alabarda", "Axes", "Machados", [4, 5, 6, 7, 8], "METALBAR", 32),

  // Weapons - Bows
  ...gen("2H_BOW", "Bow", "Arco", "Bows", "Arcos", [4, 5, 6, 7, 8], "PLANKS", 32),
  ...gen("2H_LONGBOW", "Longbow", "Arco Longo", "Bows", "Arcos", [4, 5, 6, 7, 8], "PLANKS", 32),

  // Weapons - Staves
  ...gen("MAIN_FIRESTAFF", "Fire Staff", "Cajado de Fogo", "Staves", "Cajados", [4, 5, 6, 7, 8], "METALBAR", 20),
  ...gen("2H_FIRESTAFF", "Great Fire Staff", "Grande Cajado de Fogo", "Staves", "Cajados", [4, 5, 6, 7, 8], "METALBAR", 32),
  ...gen("MAIN_FROSTSTAFF", "Frost Staff", "Cajado de Gelo", "Staves", "Cajados", [4, 5, 6, 7, 8], "METALBAR", 20),
  ...gen("MAIN_CURSEDSTAFF", "Cursed Staff", "Cajado Maldito", "Staves", "Cajados", [4, 5, 6, 7, 8], "METALBAR", 20),
  ...gen("MAIN_HOLYSTAFF", "Holy Staff", "Cajado Sagrado", "Staves", "Cajados", [4, 5, 6, 7, 8], "METALBAR", 20),
  ...gen("MAIN_ARCANESTAFF", "Arcane Staff", "Cajado Arcano", "Staves", "Cajados", [4, 5, 6, 7, 8], "METALBAR", 20),

  // Weapons - Nature
  ...gen("MAIN_NATURESTAFF", "Nature Staff", "Cajado da Natureza", "Nature", "Natureza", [4, 5, 6, 7, 8], "PLANKS", 20),

  // Weapons - Daggers
  ...gen("MAIN_DAGGER", "Dagger", "Adaga", "Daggers", "Adagas", [4, 5, 6, 7, 8], "METALBAR", 20),
  ...gen("2H_DAGGERPAIR", "Dagger Pair", "Par de Adagas", "Daggers", "Adagas", [4, 5, 6, 7, 8], "METALBAR", 32),

  // Weapons - Hammers
  ...gen("MAIN_HAMMER", "Hammer", "Martelo", "Hammers", "Martelos", [4, 5, 6, 7, 8], "METALBAR", 20),
  ...gen("2H_POLEHAMMER", "Polehammer", "Martelo de Guerra", "Hammers", "Martelos", [4, 5, 6, 7, 8], "METALBAR", 32),

  // Weapons - Crossbows
  ...gen("2H_CROSSBOW", "Crossbow", "Besta", "Crossbows", "Bestas", [4, 5, 6, 7, 8], "METALBAR", 32),

  // Weapons - Maces
  ...gen("MAIN_MACE", "Mace", "Maça", "Maces", "Maças", [4, 5, 6, 7, 8], "METALBAR", 20),

  // Weapons - Quarterstaff
  ...gen("2H_QUARTERSTAFF", "Quarterstaff", "Cajado de Combate", "Quarterstaffs", "Cajados de Combate", [4, 5, 6, 7, 8], "PLANKS", 32),

  // Weapons - Spears
  ...gen("MAIN_SPEAR", "Spear", "Lança", "Spears", "Lanças", [4, 5, 6, 7, 8], "METALBAR", 20),

  // Off-hands
  ...gen("OFF_SHIELD", "Shield", "Escudo", "Off-hands", "Secundárias", [4, 5, 6, 7, 8], "METALBAR", 12),
  ...gen("OFF_BOOK", "Tome of Spells", "Tomo de Feitiços", "Off-hands", "Secundárias", [4, 5, 6, 7, 8], "METALBAR", 12),

  // Resources (no recipes)
  ...genResource("LEATHER", "Leather", "Couro", [3, 4, 5, 6, 7, 8]),
  ...genResource("METALBAR", "Metal Bar", "Barra de Metal", [3, 4, 5, 6, 7, 8]),
  ...genResource("PLANKS", "Planks", "Tábuas", [3, 4, 5, 6, 7, 8]),
  ...genResource("CLOTH", "Cloth", "Tecido", [3, 4, 5, 6, 7, 8]),
  ...genResource("STONEBLOCK", "Stone Block", "Bloco de Pedra", [3, 4, 5, 6, 7, 8]),

  // Raw resources
  ...genResource("HIDE", "Hide", "Pele", [3, 4, 5, 6, 7, 8]),
  ...genResource("ORE", "Ore", "Minério", [3, 4, 5, 6, 7, 8]),
  ...genResource("WOOD", "Wood", "Madeira", [3, 4, 5, 6, 7, 8]),
  ...genResource("FIBER", "Fiber", "Fibra", [3, 4, 5, 6, 7, 8]),
  ...genResource("ROCK", "Rock", "Pedra", [3, 4, 5, 6, 7, 8]),
];

// City craft bonuses - which resource types get bonus return in each city
export const CITY_CRAFT_BONUS: Record<string, string[]> = {
  "Bridgewatch": ["CROSSBOW", "DAGGER", "CURSESTAFF", "STONEBLOCK"],
  "Martlock": ["AXE", "QUARTERSTAFF", "FROSTSTAFF", "PLANKS"],
  "Lymhurst": ["BOW", "NATURESTAFF", "FIRESTAFF", "CLOTH"],
  "Fort Sterling": ["HAMMER", "SPEAR", "HOLYSTAFF", "METALBAR"],
  "Thetford": ["MACE", "SWORD", "ARCANESTAFF", "LEATHER"],
  "Caerleon": [],
  "Brecilien": [],
};

export function getCategories(lang: "en" | "pt"): string[] {
  const cats = new Set<string>();
  ITEMS.forEach((item) => cats.add(item.category[lang]));
  return Array.from(cats);
}

export function searchItems(query: string, lang: "en" | "pt"): AlbionItem[] {
  const q = query.toLowerCase();
  return ITEMS.filter(
    (item) =>
      item.name[lang].toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q) ||
      item.category[lang].toLowerCase().includes(q)
  );
}
