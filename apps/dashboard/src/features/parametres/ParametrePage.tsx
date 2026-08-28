import type { DashboardServer } from "@wystrelia/shared/types";

export function ParamsPage({ server }: { server: DashboardServer }) {
  return (
    <div className="space-y-6 text-[#dcb6fb] pb-24">
      <div>
        <span className="text-[11px] font-bold text-[#8e7aab] tracking-widest uppercase">
          Général / Paramètres
        </span>
        <h1 className="text-4xl font-extrabold text-[#cfd9e8] tracking-tight mt-1">
          Paramètres
        </h1>
        <p className="text-sm font-semibold text-[#8e7aab] mt-1.5">
          Accès aux paramètres du serveur <span className="text-[#25f8ff]">{server.name}</span>
        </p>
      </div>

      {/* Emplacement pour le futur contenu */}
    </div>
  );
}