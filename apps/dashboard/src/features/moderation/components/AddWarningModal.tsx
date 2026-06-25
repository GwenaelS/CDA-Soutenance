import { useState } from "react";
import { X } from "lucide-react";


export function AddWarningModal({
  isOpen,
  onClose,
  onAddWarning
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddWarning: (warning: {
    username: string;
    reason: string;
    severity: "Avertissement" | "Muet" | "Expulsion";
    moderator: string;
  }) => void;
}) {
  const [newMemberName, setNewMemberName] = useState("");
  const [newReason, setNewReason] = useState("");
  const [newSeverity, setNewSeverity] = useState<"Avertissement" | "Muet" | "Expulsion">("Avertissement");
  const [newModerator, setNewModerator] = useState("Thornwick");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberName || !newReason) return;
    onAddWarning({
      username: newMemberName,
      reason: newReason,
      severity: newSeverity,
      moderator: newModerator
    });
    setNewMemberName("");
    setNewReason("");
    setNewSeverity("Avertissement");
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="bg-[#140030] border border-border/40 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border/20">
          <h2 className="text-lg font-bold text-[#cfd9e8]">Nouveau avertissement</h2>
          <button
            onClick={onClose}
            className="text-[#8e7aab] hover:text-white transition cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-base font-bold text-[#8e7aab] uppercase tracking-wider mb-1.5">
              Membre
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Kaelis"
              value={newMemberName}
              onChange={(e) => setNewMemberName(e.target.value)}
              className="w-full bg-[#0c0020] border border-border/40 focus:border-[#25f8ff] rounded-xl py-2 px-3.5 text-base font-semibold text-white outline-none transition"
            />
          </div>
          <div>
            <label className="block text-base font-bold text-[#8e7aab] uppercase tracking-wider mb-1.5">
              Raison
            </label>
            <textarea
              required
              rows={3}
              placeholder="Ex: Langage inapproprié en #général"
              value={newReason}
              onChange={(e) => setNewReason(e.target.value)}
              className="w-full bg-[#0c0020] border border-border/40 focus:border-[#25f8ff] rounded-xl py-2 px-3.5 text-base font-semibold text-white outline-none transition resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-base font-bold text-[#8e7aab] uppercase tracking-wider mb-1.5">
                Sévérité
              </label>
              <select
                value={newSeverity}
                onChange={(e) => setNewSeverity(e.target.value as any)}
                className="w-full bg-[#0c0020] border border-border/40 focus:border-[#25f8ff] rounded-xl py-2 px-3 text-base font-semibold text-white outline-none transition cursor-pointer"
              >
                <option value="Avertissement" className="bg-[#140030]">
                  Avertissement
                </option>
                <option value="Muet" className="bg-[#140030]">
                  Muet
                </option>
                <option value="Expulsion" className="bg-[#140030]">
                  Expulsion
                </option>
              </select>
            </div>
            <div>
              <label className="block text-base font-bold text-[#8e7aab] uppercase tracking-wider mb-1.5">
                Modérateur
              </label>
              <input
                type="text"
                required
                value={newModerator}
                onChange={(e) => setNewModerator(e.target.value)}
                className="w-full bg-[#0c0020] border border-border/40 focus:border-[#25f8ff] rounded-xl py-2 px-3.5 text-base font-semibold text-white outline-none transition"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-base font-bold uppercase tracking-wider rounded-xl border border-border/20 text-[#8e7aab] hover:border-border/60 hover:text-white transition cursor-pointer"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-base font-bold uppercase tracking-wider rounded-xl bg-purple-600/40 border border-cyan-400 text-white hover:bg-purple-600/60 shadow-[0_0_8px_rgba(37,248,255,0.2)] transition cursor-pointer"
            >
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
