import { Minus, Plus } from "lucide-react";

interface LevelConfigCardsProps {
  maxLevel: number;
  xpPerMsg: number;
  xpPerMinVocal: number;
  cooldown: number;
  onChangeMaxLevel: (val: number) => void;
  onChangeXpPerMsg: (val: number) => void;
  onChangeXpPerMinVocal: (val: number) => void;
  onChangeCooldown: (val: number) => void;
}

export function LevelConfigCards({
  maxLevel,
  xpPerMsg,
  xpPerMinVocal,
  cooldown,
  onChangeMaxLevel,
  onChangeXpPerMsg,
  onChangeXpPerMinVocal,
  onChangeCooldown,
}: LevelConfigCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-base">
      {/* Carte Niveau Maximum */}
      <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-5 flex flex-col justify-between">
        <span className="font-bold text-[#8e7aab] tracking-wider uppercase block mb-3">
          Niveau Maximum
        </span>
        <div className="flex items-center bg-[#0c0020]/60 border border-purple-500/20 rounded-lg p-1.5 justify-between">
          <button
            onClick={() => onChangeMaxLevel(Math.max(5, maxLevel - 5))}
            className="w-10 h-10 rounded-md bg-[#24133f]/30 flex items-center justify-center text-[#8e7aab] hover:text-white hover:bg-[#24133f] transition-colors cursor-pointer"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={maxLevel}
            onChange={(e) => onChangeMaxLevel(Math.max(5, Number(e.target.value)))}
            className="w-20 text-center font-black text-2xl text-[#cfd9e8] bg-transparent outline-none"
          />
          <button
            onClick={() => onChangeMaxLevel(Math.min(500, maxLevel + 5))}
            className="w-10 h-10 rounded-md bg-[#24133f]/30 flex items-center justify-center text-[#8e7aab] hover:text-white hover:bg-[#24133f] transition-colors cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>
        <span className="text-base text-[#8e7aab]/60 mt-3 font-semibold">
          Palier ultime du royaume
        </span>
      </div>

      {/* Carte XP / Message */}
      <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-5 flex flex-col justify-between">
        <span className="font-bold text-[#8e7aab] tracking-wider uppercase block mb-3">
          XP / Message
        </span>
        <div className="flex items-center bg-[#0c0020]/60 border border-purple-500/20 rounded-lg p-1.5 justify-between">
          <button
            onClick={() => onChangeXpPerMsg(Math.max(1, xpPerMsg - 1))}
            className="w-10 h-10 rounded-md bg-[#24133f]/30 flex items-center justify-center text-[#8e7aab] hover:text-white hover:bg-[#24133f] transition-colors cursor-pointer"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={xpPerMsg}
            onChange={(e) => onChangeXpPerMsg(Math.max(1, Number(e.target.value)))}
            className="w-20 text-center font-black text-2xl text-[#cfd9e8] bg-transparent outline-none"
          />
          <button
            onClick={() => onChangeXpPerMsg(Math.min(100, xpPerMsg + 1))}
            className="w-10 h-10 rounded-md bg-[#24133f]/30 flex items-center justify-center text-[#8e7aab] hover:text-white hover:bg-[#24133f] transition-colors cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>
        <span className="text-base text-[#8e7aab]/60 mt-3 font-semibold">
          Gain par message envoyé
        </span>
      </div>

      {/* Carte XP / Min Vocal */}
      <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-5 flex flex-col justify-between">
        <span className="font-bold text-[#8e7aab] tracking-wider uppercase block mb-3">
          XP / Min Vocal
        </span>
        <div className="flex items-center bg-[#0c0020]/60 border border-purple-500/20 rounded-lg p-1.5 justify-between">
          <button
            onClick={() => onChangeXpPerMinVocal(Math.max(1, xpPerMinVocal - 1))}
            className="w-10 h-10 rounded-md bg-[#24133f]/30 flex items-center justify-center text-[#8e7aab] hover:text-white hover:bg-[#24133f] transition-colors cursor-pointer"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={xpPerMinVocal}
            onChange={(e) => onChangeXpPerMinVocal(Math.max(1, Number(e.target.value)))}
            className="w-20 text-center font-black text-2xl text-[#cfd9e8] bg-transparent outline-none"
          />
          <button
            onClick={() => onChangeXpPerMinVocal(Math.min(100, xpPerMinVocal + 1))}
            className="w-10 h-10 rounded-md bg-[#24133f]/30 flex items-center justify-center text-[#8e7aab] hover:text-white hover:bg-[#24133f] transition-colors cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>
        <span className="text-base text-[#8e7aab]/60 mt-3 font-semibold">
          Gain en salon vocal
        </span>
      </div>

      {/* Carte Cooldown */}
      <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-5 flex flex-col justify-between">
        <span className="font-bold text-[#8e7aab] tracking-wider uppercase block mb-3">
          Cooldown (Sec)
        </span>
        <div className="flex items-center bg-[#0c0020]/60 border border-purple-500/20 rounded-lg p-1.5 justify-between">
          <button
            onClick={() => onChangeCooldown(Math.max(5, cooldown - 5))}
            className="w-10 h-10 rounded-md bg-[#24133f]/30 flex items-center justify-center text-[#8e7aab] hover:text-white hover:bg-[#24133f] transition-colors cursor-pointer"
          >
            <Minus size={16} />
          </button>
          <input
            type="number"
            value={cooldown}
            onChange={(e) => onChangeCooldown(Math.max(5, Number(e.target.value)))}
            className="w-20 text-center font-black text-2xl text-[#cfd9e8] bg-transparent outline-none"
          />
          <button
            onClick={() => onChangeCooldown(Math.min(3600, cooldown + 5))}
            className="w-10 h-10 rounded-md bg-[#24133f]/30 flex items-center justify-center text-[#8e7aab] hover:text-white hover:bg-[#24133f] transition-colors cursor-pointer"
          >
            <Plus size={16} />
          </button>
        </div>
        <span className="text-base text-[#8e7aab]/60 mt-3 font-semibold">
          Entre deux gains de XP
        </span>
      </div>
    </div>
  );
}
