type SeverityTab = "Tous" | "Avertissement" | "Muet" | "Expulsion";

export function WarningTabs({
  activeTab,
  onChangeTab,
  counts
}: {
  activeTab: SeverityTab;
  onChangeTab: (tab: SeverityTab) => void;
  counts: {
    Tous: number;
    Avertissement: number;
    Muet: number;
    Expulsion: number;
  };
}) {
  return (
    <div className="flex gap-2">
      {(["Tous", "Avertissement", "Muet", "Expulsion"] as const).map((tab) => {
        const isActive = activeTab === tab;
        return (
          <button
            key={tab}
            onClick={() => onChangeTab(tab)}
            className={`px-4 py-2 text-[10px] font-bold uppercase tracking-wider rounded-xl border transition duration-300 cursor-pointer flex items-center gap-2 ${
              isActive
                ? "bg-purple-600/30 border-cyan-400 text-white shadow-[0_0_8px_rgba(37,248,255,0.2)]"
                : "border-[#9D4EDD]/50 text-[#8e7aab] hover:border-border/60 hover:text-white"
            }`}
          >
            <span>{tab}</span>
            <span
              className={`px-1.5 py-0.2 text-base rounded-md ${
                isActive ? "bg-[#00edf5]/20 text-[#00edf5]" : "bg-[#140030]/60 text-[#8e7aab]"
              }`}
            >
              {counts[tab]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
