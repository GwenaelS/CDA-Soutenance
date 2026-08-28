import type { DashboardServer } from "@wystrelia/shared/types";

const getGradientHex = (gradientClass: string) => {
  if (gradientClass.includes("purple")) return { from: "#9333ea", to: "#4f46e5", stroke: "#25f8ff" };
  if (gradientClass.includes("orange")) return { from: "#f97316", to: "#db2777", stroke: "#ec4899" };
  if (gradientClass.includes("emerald")) return { from: "#10b981", to: "#0d9488", stroke: "#34d399" };
  if (gradientClass.includes("red")) return { from: "#ef4444", to: "#d97706", stroke: "#f59e0b" };
  return { from: "#9333ea", to: "#4f46e5", stroke: "#25f8ff" };
};

export function MemberGrowthChart({ server }: { server: DashboardServer }) {
  const stats = server.stats || { total: 0 };
  const colors = getGradientHex(server.gradient || "");
  const months = ["Juil", "Août", "Sep", "Oct", "Nov", "Dec", "Jan", "Fév", "Mar", "Avr", "Mai", "Jun"];
  const growthFactors = [0.78, 0.82, 0.85, 0.87, 0.89, 0.91, 0.93, 0.95, 0.96, 0.97, 0.99, 1.0];
  const points = growthFactors.map(f => Math.round(stats.total * f));

  const minY = Math.round(stats.total * 0.75);
  const maxY = Math.round(stats.total * 1.03);

  const getX = (index: number) => 60 + (index / 11) * 920;
  const getY = (v: number) => 240 - ((v - minY) / (maxY - (minY || 1))) * 240 + 20;

  const pathData = points.map((p, i) => `${i === 0 ? "M" : "L"} ${getX(i)} ${getY(p)}`).join(" ");
  const areaPathData = `${pathData} L ${getX(11)} ${getY(minY)} L ${getX(0)} ${getY(minY)} Z`;
  const gridValues = Array.from({ length: 6 }, (_, i) => Math.round(minY + ((maxY - minY) / 5) * i));

  return (
    <div className="bg-[#140030]/50 border border-[#9D4EDD]/75 rounded-xl p-6">
      <h2 className="text-lg font-bold text-[#cfd9e8]">Croissance des membres</h2>
      <p className="text-xs text-[#8e7aab] mt-0.5">12 derniers mois</p>

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

            {points.map((p, i) => (
              <circle
                key={i}
                cx={getX(i)}
                cy={getY(p)}
                r={4}
                fill={colors.stroke}
                className="stroke-[#0c0020] stroke-2"
              />
            ))}

            {months.map((m, i) => (
              <text
                key={i}
                x={getX(i)}
                y="280"
                textAnchor="middle"
                className="fill-[#e2e8f0] text-[13px] font-medium"
              >
                {m}
              </text>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
