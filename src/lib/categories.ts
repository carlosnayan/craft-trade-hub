export interface CategoryNode {
  id: string;
  name: { en: string; pt: string };
  children?: CategoryNode[];
}

export const CATEGORY_TREE: CategoryNode[] = [
  {
    id: "equipment",
    name: { en: "Equipment", pt: "Equipamento" },
    children: [
      {
        id: "weapon",
        name: { en: "Weapon", pt: "Armas" },
        children: [
          { id: "axe", name: { en: "Axe", pt: "Machado" } },
          { id: "bow", name: { en: "Bow", pt: "Arco" } },
          { id: "crossbow", name: { en: "Crossbow", pt: "Besta" } },
          { id: "dagger", name: { en: "Dagger", pt: "Adaga" } },
          {
            id: "fire_staff",
            name: { en: "Fire Staff", pt: "Cajado de Fogo" },
          },
          {
            id: "frost_staff",
            name: { en: "Frost Staff", pt: "Cajado de Gelo" },
          },
          { id: "hammer", name: { en: "Hammer", pt: "Martelo" } },
          {
            id: "holy_staff",
            name: { en: "Holy Staff", pt: "Cajado Sagrado" },
          },
          { id: "mace", name: { en: "Mace", pt: "Maça" } },
          {
            id: "nature_staff",
            name: { en: "Nature Staff", pt: "Cajado da Natureza" },
          },
          {
            id: "quarterstaff",
            name: { en: "Quarterstaff", pt: "Cajado de Combate" },
          },
          { id: "spear", name: { en: "Spear", pt: "Lança" } },
          { id: "sword", name: { en: "Sword", pt: "Espada" } },
          {
            id: "arcane_staff",
            name: { en: "Arcane Staff", pt: "Cajado Arcano" },
          },
          {
            id: "cursed_staff",
            name: { en: "Cursed Staff", pt: "Cajado Maldito" },
          },
          {
            id: "shapeshifter_staff",
            name: { en: "Shapeshifter Staff", pt: "Cajado Metamorfo" },
          },
          { id: "offhand", name: { en: "Off-Hand", pt: "Mão Secundária" } },
        ],
      },
      {
        id: "armor",
        name: { en: "Armor", pt: "Armaduras" },
        children: [
          {
            id: "cloth_armor",
            name: { en: "Cloth Armor", pt: "Armadura de Tecido" },
          },
          {
            id: "leather_armor",
            name: { en: "Leather Armor", pt: "Armadura de Couro" },
          },
          {
            id: "plate_armor",
            name: { en: "Plate Armor", pt: "Armadura de Placas" },
          },
        ],
      },
      {
        id: "accessories",
        name: { en: "Accessories", pt: "Acessórios" },
        children: [
          { id: "bag", name: { en: "Bag", pt: "Bolsa" } },
          { id: "cape", name: { en: "Cape", pt: "Capa" } },
          { id: "mount", name: { en: "Mount", pt: "Montaria" } },
        ],
      },
    ],
  },
  {
    id: "consumable",
    name: { en: "Consumable", pt: "Consumível" },
    children: [
      { id: "potion", name: { en: "Potion", pt: "Poção" } },
      { id: "food", name: { en: "Food", pt: "Comida" } },
    ],
  },
  {
    id: "resources",
    name: { en: "Resources", pt: "Recursos" },
    children: [{ id: "resource", name: { en: "Resource", pt: "Recurso" } }],
  },
];

export function flattenCategories(
  nodes: CategoryNode[] = CATEGORY_TREE,
): { id: string; name: { en: string; pt: string } }[] {
  let flat: { id: string; name: { en: string; pt: string } }[] = [];
  for (const node of nodes) {
    flat.push({ id: node.id, name: node.name });
    if (node.children) {
      flat = flat.concat(flattenCategories(node.children));
    }
  }
  return flat;
}

export function getCategoryPath(
  leafId: string,
  nodes: CategoryNode[] = CATEGORY_TREE,
): string[] | null {
  for (const node of nodes) {
    if (node.id === leafId) return [node.id];
    if (node.children) {
      const path = getCategoryPath(leafId, node.children);
      if (path) return [node.id, ...path];
    }
  }
  return null;
}
