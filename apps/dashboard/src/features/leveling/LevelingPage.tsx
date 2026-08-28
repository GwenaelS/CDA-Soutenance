import { useState, useEffect } from "react";
import type { DashboardServer, LevelingMilestone } from "@wystrelia/shared/types";
import { LevelConfigCards } from "./components/LevelConfigCards";
import { LevelMilestonesList } from "./components/LevelMilestonesList";
import { XPCurveChart } from "./components/XPCurveChart";

export function LevelingPage({ server }: { server: DashboardServer }) {
  const [maxLevel, setMaxLevel] = useState(100);
  const [xpPerMsg, setXpPerMsg] = useState(15);
  const [xpPerMinVocal, setXpPerMinVocal] = useState(8);
  const [cooldown, setCooldown] = useState(60);
  const [paliers, setPaliers] = useState<LevelingMilestone[]>([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const config = server.levelingConfig || {
      maxLevel: 100,
      xpPerMsg: 15,
      xpPerMinVocal: 8,
      cooldown: 60,
      paliers: [],
    };
    setMaxLevel(config.maxLevel);
    setXpPerMsg(config.xpPerMsg);
    setXpPerMinVocal(config.xpPerMinVocal);
    setCooldown(config.cooldown);
    setPaliers(config.paliers || []);
  }, [server]);

  const handleAddPalier = () => {
    const maxExisting = paliers.length > 0 ? Math.max(...paliers.map((p) => p.level)) : 0;
    const nextLvl = Math.min(maxLevel, maxExisting + 10 || 10);
    const newPalier: LevelingMilestone = {
      level: nextLvl,
      roleName: `Nouveau Rôle ${paliers.length + 1}`,
      color: "#25f8ff",
    };
    setPaliers([...paliers, newPalier]);
  };

  const handleUpdatePalier = (idx: number, updated: LevelingMilestone) => {
    const copy = [...paliers];
    copy[idx] = updated;
    setPaliers(copy);
  };

  const handleDeletePalier = (idx: number) => {
    setPaliers(paliers.filter((_, i) => i !== idx));
  };

  const handleSave = () => {
    server.levelingConfig = {
      maxLevel,
      xpPerMsg,
      xpPerMinVocal,
      cooldown,
      paliers,
    };
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  return (
    <div className="space-y-6 text-[#dcb6fb] relative pb-24">
      {showToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#25f8ff]/25 border border-[#25f8ff] text-white px-4 py-3 rounded-lg shadow-lg backdrop-blur-md transition-all duration-300">
          Configurations du système d'expérience sauvegardées avec succès !
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="text-[11px] font-bold text-[#8e7aab] tracking-widest uppercase">
            Communautaire / Système d'expérience
          </span>
          <h1 className="text-4xl font-extrabold text-[#cfd9e8] tracking-tight mt-1">
            Système d'expérience
          </h1>
          <p className="text-sm font-semibold text-[#8e7aab] mt-1.5">
            Configure les règles de progression du royaume pour{" "}
            <span className="text-[#25f8ff]">{server.name}</span>
          </p>
        </div>
        <button
          onClick={handleSave}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-2.5 rounded-lg text-base shadow-[0_0_12px_rgba(147,51,234,0.3)] transition-all cursor-pointer hover:scale-102 active:scale-98"
        >
          Sauvegarder
        </button>
      </div>

      <LevelConfigCards
        maxLevel={maxLevel}
        xpPerMsg={xpPerMsg}
        xpPerMinVocal={xpPerMinVocal}
        cooldown={cooldown}
        onChangeMaxLevel={setMaxLevel}
        onChangeXpPerMsg={setXpPerMsg}
        onChangeXpPerMinVocal={setXpPerMinVocal}
        onChangeCooldown={setCooldown}
      />

      <XPCurveChart maxLevel={maxLevel} server={server} />

      <LevelMilestonesList
        paliers={paliers}
        serverRoles={server.roles || []}
        onUpdatePalier={handleUpdatePalier}
        onDeletePalier={handleDeletePalier}
        onAddPalier={handleAddPalier}
      />
    </div>
  );
}
