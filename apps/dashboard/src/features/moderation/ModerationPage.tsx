import { useState, useEffect } from "react";
import type { DashboardServer, Warning } from "@wystrelia/shared/types";
import { WarningStats } from "./components/WarningStats";
import { WarningTabs } from "./components/WarningTabs";
import { WarningTable } from "./components/WarningTable";
import { AddWarningModal } from "./components/AddWarningModal";
import { Plus } from "lucide-react";

export function ModerationPage({ server }: { server: DashboardServer }) {
  const [warnings, setWarnings] = useState<Warning[]>([]);
  const [activeTab, setActiveTab] = useState<"Tous" | "Avertissement" | "Muet" | "Expulsion">("Tous");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setWarnings(server.warnings || []);
  }, [server]);

  const uniqueMembersCount = new Set(warnings.map((w) => w.member.username.toLowerCase())).size;
  const warningsThisMonthCount = warnings.filter((w) => w.date.includes("juin 2026") || w.date.includes("2026")).length;

  const filteredWarnings = warnings.filter(
    (w) => activeTab === "Tous" || w.severity === activeTab
  );

  const handleRemoveWarning = (id: string) => {
    setWarnings(warnings.map((w) => (w.id === id ? { ...w, status: "Expiré" } : w)));
  };

  const handleAddWarning = (newWarn: {
    username: string;
    reason: string;
    severity: "Avertissement" | "Muet" | "Expulsion";
    moderator: string;
  }) => {
    const newWarning: Warning = {
      id: Date.now().toString(),
      member: {
        username: newWarn.username,
        displayName: `@${newWarn.username.toLowerCase()}`,
        avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${newWarn.username}`
      },
      reason: newWarn.reason,
      severity: newWarn.severity,
      moderator: newWarn.moderator,
      date: new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
      status: "Actif"
    };
    setWarnings([newWarning, ...warnings]);
    setShowModal(false);
  };

  return (
    <div className="space-y-6 text-[#dcb6fb]">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#8e7aab] tracking-widest uppercase">
            Modération / Avertissements
          </span>
          <h1 className="text-4xl font-extrabold text-[#cfd9e8] tracking-tight mt-1">
            Avertissements
          </h1>
          <p className="text-sm font-semibold text-[#8e7aab] mt-1.5">
            Historique des sanctions émises dans le royaume
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 border border-pink-500/30 hover:border-pink-500/60 bg-pink-500/10 hover:bg-pink-500/20 text-pink-200 text-base font-bold uppercase tracking-wider rounded-xl transition duration-300 cursor-pointer"
        >
          <Plus size={14} />
          Nouveau avertissement
        </button>
      </div>

      <WarningStats
        warningsCount={warnings.length}
        activeCount={warnings.filter((w) => w.status === "Actif").length}
        uniqueMembersCount={uniqueMembersCount}
        thisMonthCount={warningsThisMonthCount}
      />

      <WarningTabs
        activeTab={activeTab}
        onChangeTab={setActiveTab}
        counts={{
          Tous: warnings.length,
          Avertissement: warnings.filter((w) => w.severity === "Avertissement").length,
          Muet: warnings.filter((w) => w.severity === "Muet").length,
          Expulsion: warnings.filter((w) => w.severity === "Expulsion").length
        }}
      />

      <WarningTable warnings={filteredWarnings} onRemoveWarning={handleRemoveWarning} />

      <AddWarningModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onAddWarning={handleAddWarning}
      />
    </div>
  );
}
