import type { DashboardServer } from "@wystrelia/shared/types";

interface XPCurveChartProps {
  maxLevel: number;
  server: DashboardServer;
}

const getGradientHex = (gradientClass: string) => {
  if (gradientClass.includes("purple")) return { from: "#9333ea", to: "#4f46e5", stroke: "#25f8ff" };
  if (gradientClass.includes("orange")) return { from: "#f97316", to: "#db2777", stroke: "#ec4899" };
  if (gradientClass.includes("emerald")) return { from: "#10b981", to: "#0d9488", stroke: "#34d399" };
  if (gradientClass.includes("red")) return { from: "#ef4444", to: "#d97706", stroke: "#f59e0b" };
  return { from: "#9333ea", to: "#4f46e5", stroke: "#25f8ff" };
};

const getXpForLevel = (level: number) => {
  return 5 * (level * level) + 50 * level + 100;
};

export function XPCurveChart({ maxLevel, server }: XPCurveChartProps) {
  const colors = getGradientHex(server.gradient || "");
  const pointCount = 8;
  const levels = Array.from({ length: pointCount }, (_, i) => {
    if (i === 0) return 1;
    if (i === pointCount - 1) return maxLevel;
    return Math.round(1 + (i / (pointCount - 1)) * (maxLevel - 1));
  });

  const xpValues = levels.map(L => getXpForLevel(L));
  const minXP = xpValues[0];
  const maxXP = xpValues[xpValues.length - 1];

  const minY = Math.round(minXP * 0.75);
  const maxY = Math.round(maxXP * 1.03);

  const getX = (index: number) => 60 + (index / (pointCount - 1)) * 920;
  const getY = (v: number) => 240 - ((v - minY) / (maxY - (minY || 1))) * 240 + 20;

  const pathData = xpValues.map((xp, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(xp)}`).join(" ");
  const areaPathData = `${pathData} L ${getX(pointCount - 1)} ${getY(minY)} L ${getX(0)} ${getY(minY)} Z`;
  const gridValues = Array.from({ length: 6 }, (_, i) => Math.round(minY + ((maxY - minY) / 5) * i));

  return (
    <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-lg font-bold text-[#cfd9e8]">Courbe d'expérience requise</h2>
          <p className="text-xs text-[#8e7aab] mt-0.5 font-semibold">Progression de l'XP nécessaire selon le niveau (Niv. 1 à {maxLevel})</p>
        </div>
        <div className="text-right">
          <span className="text-xs font-bold text-[#8e7aab] uppercase tracking-wider block">XP Finale</span>
          <span className="text-lg font-black text-[#cfd9e8]" style={{ color: colors.stroke }}>
            {maxXP.toLocaleString("fr-FR")} XP
          </span>
        </div>
      </div>

      <div className="mt-6 w-full overflow-x-auto">
        <div className="min-w-[800px] h-[320px]">
          <svg viewBox="0 0 1000 300" className="w-full h-full">
            <defs>
              <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={colors.from} stopOpacity="0.25" />
                <stop offset="100%" stopColor={colors.to} stopOpacity="0" />
              </linearGradient>
            </defs>

            {gridValues.map((val, idx) => (
              <g key={idx}>
                <line
                  x1="60"
                  y1={getY(val)}
                  x2="980"
                  y2={getY(val)}
                  className="stroke-[#fff]/80 stroke-1"
                />
                <text
                  x="50"
                  y={getY(val) + 4}
                  textAnchor="end"
                  className="fill-[#e2e8f0] text-[13px] font-medium"
                >
                  {val.toLocaleString("fr-FR")}
                </text>
              </g>
            ))}

            <path d={areaPathData} fill="url(#chart-grad)" />
            <path d={pathData} fill="none" stroke={colors.stroke} strokeWidth={2} />

            {xpValues.map((xp, i) => (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(xp)}
                r={4}
                fill={colors.stroke}
                className="stroke-[#0c0020] stroke-2"
              />
            ))}

            {levels.map((lvl, i) => (
              <text
                key={i}
                x={getX(i)}
                y="280"
                textAnchor="middle"
                className="fill-[#e2e8f0] text-[13px] font-medium"
              >
                Niv. {lvl}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
