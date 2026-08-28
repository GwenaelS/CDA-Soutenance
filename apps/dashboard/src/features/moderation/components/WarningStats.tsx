export function WarningStats({
  warningsCount,
  activeCount,
  uniqueMembersCount,
  thisMonthCount
}: {
  warningsCount: number;
  activeCount: number;
  uniqueMembersCount: number;
  thisMonthCount: number;
}) {
  const cards = [
    { label: "Total avertissements", value: warningsCount, desc: "toutes sévérités" },
    { label: "Actifs", value: activeCount, desc: "en vigueur" },
    { label: "Membres concernés", value: uniqueMembersCount, desc: "membres distincts" },
    { label: "Ce mois", value: thisMonthCount, desc: "juin 2026" }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-[#140030]/50 border border-[#9D4EDD]/75 rounded-xl p-5 hover:border-cyan-500 transition-all duration-300"
        >
          <span className="text-xs font-bold text-[#8e7aab] uppercase tracking-wider">
            {card.label}
          </span>
          <h3 className="text-3xl font-extrabold text-[#cfd9e8] tracking-tight mt-5">
            {card.value}
          </h3>
          <p className="text-xs font-semibold mt-1">{card.desc}</p>
        </div>
      ))}
    </div>
  );
}
