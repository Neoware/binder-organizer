import React from "react";
import type { Card } from "../lib/tcgdx";

function chunk<T>(arr: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
  return out;
}

type Slot = {
  key: string;
  label: "N" | "Rv";
  ok: boolean;
  img: string;
};

function makeSlots(cards: Card[], pageSize: number): Slot[] {
  const slots: Slot[] = [];
  for (const card of cards) {
    const img = card.getImageURL?.("low", "webp") ?? "";
    slots.push({
      key: `${card.id}-N`,
      label: "N",
      ok: Boolean(card.variants?.normal),
      img
    });
  }
  return slots;
}

export function BinderGrid({ cards }: { cards: Card[] }) {
  const pages = chunk(cards, 12);
  
  return (
    <div className="space-y-8">
      {Array.from({ length: Math.ceil(pages.length / 2) }, (_, spreadIndex) => {
        const leftPageIndex = spreadIndex * 2;
        const rightPageIndex = spreadIndex * 2 + 1;
        const leftPage = pages[leftPageIndex];
        const rightPage = pages[rightPageIndex];
        
        // Create slots for left page
        const leftSlots = makeSlots(leftPage, 12);
        while (leftSlots.length < 12) {
          leftSlots.push({
            key: `empty-left-${leftPageIndex}-${leftSlots.length}`,
            label: "N",
            ok: false,
            img: ""
          });
        }
        
        // Create slots for right page (if exists)
        let rightSlots: Slot[] = [];
        if (rightPage) {
          rightSlots = makeSlots(rightPage, 12);
          while (rightSlots.length < 12) {
            rightSlots.push({
              key: `empty-right-${rightPageIndex}-${rightSlots.length}`,
              label: "N",
              ok: false,
              img: ""
            });
          }
        }
        
        return (
          <section key={spreadIndex} className="rounded-xl p-4 bg-gray-50">
            <h2 className="text-lg font-semibold mb-4 text-center">
              Pages {leftPageIndex + 1}{rightPage ? ` - ${rightPageIndex + 1}` : ''}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'row', gap: '48px', alignItems: 'flex-start' }}>
              {/* Left Page */}
              <div style={{ width: 'calc(50% - 6px)' }}>
                <h3 className="text-sm font-semibold mb-2 text-center" style={{ height: '1.5rem', lineHeight: '1.5rem' }}>Page {leftPageIndex + 1}</h3>
                <table className="w-full border-collapse">
                  <tbody>
                    {chunk(leftSlots, 4).map((row, ri) => (
                      <tr key={ri}>
                        {row.map((slot) => (
                          <td key={slot.key} className="p-0">
                            <div className="relative w-full aspect-[3/4] bg-white">
                              <div className="absolute inset-0 flex items-center justify-center">
                                {slot.img ? (
                                  <img
                                    src={slot.img}
                                    alt=""
                                    className="w-full h-full object-contain"
                                    draggable={false}
                                  />
                                ) : (
                                  <div className="w-full h-full" />
                                )}
                              </div>
                            </div>
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              
              {/* Right Page */}
              <div style={{ width: 'calc(50% - 6px)' }}>
                {rightPage ? (
                  <>
                    <h3 className="text-sm font-semibold mb-2 text-center" style={{ height: '1.5rem', lineHeight: '1.5rem' }}>Page {rightPageIndex + 1}</h3>
                    <table className="w-full border-collapse">
                      <tbody>
                        {chunk(rightSlots, 4).map((row, ri) => (
                          <tr key={ri}>
                            {row.map((slot) => (
                              <td key={slot.key} className="p-0">
                                <div className="relative w-full aspect-[3/4] bg-white">
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    {slot.img ? (
                                      <img
                                        src={slot.img}
                                        alt=""
                                        className="w-full h-full object-contain"
                                        draggable={false}
                                      />
                                    ) : (
                                      <div className="w-full h-full" />
                                    )}
                                  </div>
                                </div>
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <div className="opacity-50">
                    <h3 className="text-sm font-semibold mb-2 text-center text-gray-400">
                      Page {rightPageIndex + 1} (Empty)
                    </h3>
                    <div className="w-full bg-gray-100 rounded aspect-[3/4]"></div>
                  </div>
                )}
              </div>
            </div>
          </section>
        );
      })}
    </div>
  );
}