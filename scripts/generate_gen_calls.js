import fs from "fs";
import path from "path";

// Configuration
const reportPath =
  "/Users/carlos/Documents/craft-trade-hub/missing_items_report.md";
const accessoriesPath =
  "/Users/carlos/Documents/craft-trade-hub/openalbion_data/accessories.json";
const consumablesPath =
  "/Users/carlos/Documents/craft-trade-hub/openalbion_data/consumables.json";
const weaponsPath =
  "/Users/carlos/Documents/craft-trade-hub/openalbion_data/weapons.json";
const armorsPath =
  "/Users/carlos/Documents/craft-trade-hub/openalbion_data/armors.json";

const sources = [accessoriesPath, consumablesPath, weaponsPath, armorsPath];

// Helper to determine category ID
function getCategoryId(item) {
  const sub = item.subcategory ? item.subcategory.name.toLowerCase() : "";
  const cat = item.category ? item.category.name.toLowerCase() : "";

  // Accessories
  if (cat.includes("cape")) return "cape";
  if (cat.includes("bag")) return "bag";
  if (
    cat.includes("mount") ||
    sub.includes("mount") ||
    sub.includes("horse") ||
    sub.includes("ox") ||
    sub.includes("stag") ||
    sub.includes("wolf") ||
    sub.includes("boar") ||
    sub.includes("bear")
  )
    return "mount";

  // Armor
  if (cat.includes("cloth armor")) return "cloth_armor";
  if (cat.includes("leather armor")) return "leather_armor";
  if (cat.includes("plate armor")) return "plate_armor";

  // Weapons
  if (sub.includes("axe")) return "axe";
  if (sub.includes("bow")) return "bow";
  if (sub.includes("crossbow")) return "crossbow";
  if (sub.includes("dagger")) return "dagger";
  if (sub.includes("fire staff")) return "fire_staff";
  if (sub.includes("frost staff")) return "frost_staff";
  if (sub.includes("hammer")) return "hammer";
  if (sub.includes("holy staff")) return "holy_staff";
  if (sub.includes("mace")) return "mace";
  if (sub.includes("nature staff")) return "nature_staff";
  if (sub.includes("quarterstaff")) return "quarterstaff";
  if (sub.includes("spear")) return "spear";
  if (sub.includes("sword")) return "sword";
  if (sub.includes("arcane staff")) return "arcane_staff";
  if (sub.includes("cursed staff")) return "cursed_staff";
  if (sub.includes("shapeshifter staff")) return "shapeshifter_staff";

  // Offhands
  if (
    sub.includes("shield") ||
    sub.includes("torch") ||
    sub.includes("tome") ||
    sub.includes("totem") ||
    sub.includes("orb") ||
    sub.includes("censer") ||
    sub.includes("horn")
  )
    return "offhand";
  if (cat.includes("off-hand")) return "offhand";

  // Consumables
  if (sub.includes("potion")) return "potion";
  if (sub.includes("food") || sub.includes("meal") || sub.includes("fish"))
    return "food";

  return "misc";
}

// Helper to guess resource
function guessResource(catId) {
  switch (catId) {
    case "cape":
      return "CLOTH";
    case "bag":
      return "LEATHER";
    case "mount":
      return "LEATHER"; // Placeholder
    case "offhand":
      return "PLANKS";
    case "potion":
      return "HERB"; // Placeholder
    default:
      return "RESOURCE";
  }
}

// 1. Read Report and Extract IDs
console.log("Reading report...");
const reportContent = fs.readFileSync(reportPath, "utf8");
const regex = /- ([A-Z0-9_]+)/g;
let match;
const targetIds = new Set();

while ((match = regex.exec(reportContent)) !== null) {
  // Filter out IDs that are likely not items or are headers?
  // The user list has generic IDs like MOUNT_HORSE.
  // We will try to match these against the 'identifier' in JSONs,
  // which are usually T4_MOUNT_HORSE.
  targetIds.add(match[1]);
}

console.log(`Found ${targetIds.size} target Base IDs in report.`);

// 2. Scan JSONs and build data map
const itemsByBaseId = {};

sources.forEach((src) => {
  if (!fs.existsSync(src)) return;
  const data = JSON.parse(fs.readFileSync(src, "utf8"));

  data.data.forEach((item) => {
    if (!item.identifier) return;

    // Attempt to extract Base ID from Identifier (e.g. T4_MOUNT_HORSE -> MOUNT_HORSE)
    // usually T<tier>_BASE_ID
    const parts = item.identifier.split("_");
    if (parts.length < 2) return;

    // Check if it starts with T\d+
    let baseId = item.identifier;
    let tier = 0;

    if (parts[0].match(/^T\d+/)) {
      tier = parseInt(parts[0].substring(1));
      baseId = parts.slice(1).join("_");

      // Handle special case like T4_CAPEITEM_FW_BRIDGEWATCH -> CAPEITEM_FW_BRIDGEWATCH
    }

    // Check if this baseId matches one of our targets
    if (targetIds.has(baseId)) {
      if (!itemsByBaseId[baseId]) {
        itemsByBaseId[baseId] = {
          baseId: baseId,
          name: item.name,
          catId: getCategoryId(item),
          tiers: new Set(),
          resource: guessResource(getCategoryId(item)),
        };
      }
      itemsByBaseId[baseId].tiers.add(tier);

      // Update name to be the generic name if possible?
      // e.g. "Adept's Bridgewatch Cape" -> "Bridgewatch Cape"
      // Heuristic: remove tier prefix from name if present
      const tierPrefixes = [
        "Novice's ",
        "Journeyman's ",
        "Adept's ",
        "Expert's ",
        "Master's ",
        "Grandmaster's ",
        "Elder's ",
      ];
      let genericName = item.name;
      for (const pre of tierPrefixes) {
        if (genericName.startsWith(pre)) {
          genericName = genericName.substring(pre.length);
          break;
        }
      }
      itemsByBaseId[baseId].name = genericName;
    }
  });
});

// 3. Generate Code
console.log("Generating code...");
let output = "";

for (const baseId in itemsByBaseId) {
  const item = itemsByBaseId[baseId];
  const tiers = Array.from(item.tiers).sort((a, b) => a - b);

  if (tiers.length === 0) continue;

  output += `  ...gen(\n`;
  output += `    "${baseId}",\n`;
  output += `    "${item.name}",\n`;
  output += `    "${item.name}",\n`; // Using EN name for PT placeholder
  output += `    "${item.catId}",\n`;
  output += `    [${tiers.join(", ")}],\n`;
  output += `    "${item.resource}",\n`;
  output += `    1,\n`; // Default quantity 1
  output += `  ),\n`;
}

console.log(output);

// Also write to a file for easy copying
fs.writeFileSync("generated_gen_calls.txt", output);
console.log("Output written to generated_gen_calls.txt");
