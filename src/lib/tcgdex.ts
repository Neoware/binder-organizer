import TCGdex from "@tcgdex/sdk";

export const tcgdex = new TCGdex("fr");

export type Card = Awaited<ReturnType<typeof tcgdex.card.get>>;

function rarityString(r: any): string {
  if (!r) return "";
  if (typeof r === "string") return r;
  // certains jeux exposent { name, id }
  return r.name ?? r.id ?? "";
}

export async function fetchSv1Ordered(): Promise<Card[]> {
  const set = await tcgdex.set.get("sv03");
  if (!set) return [];

  const fullCards = await Promise.all(set.cards.map((brief) => brief.getCard()));

  // On considère "Commune", "Peu Commune", "Rare" comme doublées (N + Rv).
  // On normalise en minuscule pour éviter les soucis de casse.
  const LOW_RARITIES = new Set(["commune", "peu commune", "rare"]);

  const byLocalId = (a: Card, b: Card) =>
    String(a.localId ?? "").localeCompare(String(b.localId ?? ""), undefined, {
      numeric: true,
      sensitivity: "base",
    });

  // Séparer en deux groupes
  const commons: Card[] = [];
  const others: Card[] = [];

  for (const c of fullCards) {
    const r = rarityString((c as any).rarity).toLowerCase().trim();
    if (LOW_RARITIES.has(r)) {
      commons.push(c);
    } else {
      others.push(c);
    }
  }

  // Trier chaque groupe
  commons.sort(byLocalId);
  others.sort(byLocalId);

  // Dupliquer les "commons" : [c1, c1, c2, c2, ...] puis concaténer avec les autres
  const doubledCommons: Card[] = commons.flatMap((c) => [c, c]);

  return [...doubledCommons, ...others];
}
