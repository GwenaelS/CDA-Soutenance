import { useState, useRef, useEffect } from "react";
import { X, Plus, ChevronDown } from "lucide-react";
import type { LevelingMilestone, MemberRole } from "@wystrelia/shared/types";

interface LevelMilestonesListProps {
  paliers: LevelingMilestone[];
  serverRoles: MemberRole[];
  onUpdatePalier: (idx: number, updated: LevelingMilestone) => void;
  onDeletePalier: (idx: number) => void;
  onAddPalier: () => void;
}

export function LevelMilestonesList({
  paliers,
  serverRoles,
  onUpdatePalier,
  onDeletePalier,
  onAddPalier,
}: LevelMilestonesListProps) {
  const [openDropdownIdx, setOpenDropdownIdx] = useState<number | null>(null);
  const activeDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (activeDropdownRef.current && !activeDropdownRef.current.contains(event.target as Node)) {
        setOpenDropdownIdx(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-6 text-base">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-purple-500/10 pb-4 mb-4 gap-2">
        <div>
          <h2 className="text-lg font-bold text-[#cfd9e8]">Paliers de niveaux</h2>
          <p className="text-base text-[#8e7aab]/60 font-semibold mt-0.5">
            {paliers.length} palier(s) · Rôle attribué automatiquement au niveau atteint
          </p>
        </div>
        <button
          onClick={onAddPalier}
          className="flex items-center gap-1.5 bg-[#24133f] hover:bg-[#2f1b52] border border-purple-500/20 text-[#cfd9e8] font-bold px-4 py-2 rounded-lg text-base transition-all cursor-pointer self-start sm:self-center"
        >
          <Plus size={16} />
          Ajouter un palier
        </button>
      </div>

      <div className="hidden md:grid grid-cols-12 gap-4 text-base font-bold text-[#8e7aab] tracking-wider uppercase mb-3 px-3.5">
        <div className="col-span-3">Niveau</div>
        <div className="col-span-6 text-center">Rôle accordé</div>
        <div className="col-span-3 text-right">Actions</div>
      </div>

      <div className="space-y-3">
        {paliers.length === 0 ? (
          <div className="text-center text-base text-[#8e7aab]/60 py-10">
            Aucun palier de niveau configuré. Cliquez sur "Ajouter un palier".
          </div>
        ) : (
          paliers
            .sort((a, b) => a.level - b.level)
            .map((palier, idx) => {
              const currentRole = serverRoles.find((r) => r.name === palier.roleName);
              const roleColor = currentRole ? currentRole.color : palier.color;
              return (
                <div
                  key={idx}
                  className="flex flex-col md:grid md:grid-cols-12 gap-4 items-stretch md:items-center bg-[#0c0020]/30 hover:bg-[#0c0020]/50 border border-purple-500/10 rounded-xl p-3.5 transition-colors"
                >
                  <div className="md:col-span-3 flex items-center justify-between md:justify-start gap-2">
                    <span className="text-[#8e7aab] font-bold text-base md:hidden">Niveau</span>
                    <div className="flex items-center gap-1 bg-[#0c0020]/60 border border-purple-500/20 rounded-lg px-2.5 py-1">
                      <span className="text-[#8e7aab] font-extrabold text-base">Niveau</span>
                      <input
                        type="number"
                        value={palier.level}
                        onChange={(e) =>
                          onUpdatePalier(idx, { ...palier, level: Math.max(1, Number(e.target.value)) })
                        }
                        className="w-10 text-center font-extrabold text-base text-[#cfd9e8] bg-transparent outline-none border-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-6 flex flex-col md:flex-row md:items-center justify-between md:justify-center gap-1.5 md:gap-2">
                    <span className="text-[#8e7aab] font-bold text-base md:hidden shrink-0 text-left">Rôle accordé</span>
                    <div className="relative w-full md:max-w-md" ref={openDropdownIdx === idx ? activeDropdownRef : null}>
                      <button
                        type="button"
                        onClick={() => setOpenDropdownIdx(openDropdownIdx === idx ? null : idx)}
                        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-lg text-base font-semibold border border-purple-500/20 bg-[#1e0a3d]/40 text-[#cfd9e8] hover:bg-[#1e0a3d]/80 hover:border-purple-500/40 transition-all cursor-pointer shadow-sm text-left"
                      >
                        <span className="flex items-center gap-2 overflow-hidden">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: roleColor }} />
                          <span className="truncate">{palier.roleName}</span>
                        </span>
                        <ChevronDown className={`w-4 h-4 text-[#8e7aab] transition-transform duration-200 shrink-0 ${openDropdownIdx === idx ? 'rotate-180' : ''}`} />
                      </button>

                      {openDropdownIdx === idx && (
                        <div className="absolute left-0 bottom-full mb-1 w-full bg-[#0d0221] border border-purple-500/20 rounded-xl shadow-2xl py-1.5 z-50 max-h-48 overflow-y-auto divide-y divide-purple-500/10 backdrop-blur-md">
                          {serverRoles.map((role) => (
                            <button
                              key={role.name}
                              type="button"
                              onClick={() => {
                                onUpdatePalier(idx, { ...palier, roleName: role.name, color: role.color });
                                setOpenDropdownIdx(null);
                              }}
                              className="w-full flex items-center gap-2.5 px-4 py-2 hover:bg-[#1e0a3d]/50 text-left transition-colors cursor-pointer text-base font-medium"
                              style={{ color: role.color }}
                            >
                              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: role.color }} />
                              <span className="truncate">{role.name}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-2 border-t border-purple-500/10 pt-3 md:border-none md:pt-0">
                    <span className="text-[#8e7aab] font-bold text-base md:hidden">Action</span>
                    <button
                      onClick={() => onDeletePalier(idx)}
                      className="bg-[#24133f]/40 hover:bg-rose-500/20 hover:text-rose-400 border border-purple-500/10 hover:border-rose-500/20 text-[#8e7aab] rounded p-2 transition-all cursor-pointer"
                      title="Supprimer ce palier"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
