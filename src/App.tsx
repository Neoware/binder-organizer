import { useEffect, useState } from "react";
import { fetchSv1Ordered } from "./lib/tcgdex";
import type { Card } from "./lib/tcgdex";
import { BinderGrid } from "./components/BinderGrid";

export default function App() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const list = await fetchSv1Ordered();
        setCards(list);
      } catch (e: any) {
        setErr(e?.message ?? "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="p-6">Chargement…</div>;
  if (err) return <div className="p-6 text-red-600">Erreur: {err}</div>;

  return (
      <BinderGrid cards={cards} />
  );
}
