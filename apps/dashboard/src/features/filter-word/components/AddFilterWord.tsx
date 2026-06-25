import type { AddFilterWorlProps } from "@wystrelia/shared/types";
import { useState } from "react";

export function AddFilterWord({ onAddWord }: AddFilterWorlProps) {

    const [newWord, setNewWord] = useState("");

    const handleAdd = () => {
        const wordClean = newWord.trim();
        if (!wordClean) return;
        onAddWord(wordClean);
        setNewWord("");
    };

    return (
        <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-6">
            <h2 className="text-base font-bold text-[#cfd9e8]">
                Ajouter un mot ou une expression
            </h2>

            <span className="text-base font-bold text-[#8e7aab] uppercase tracking-wider block mb-2">
                Mot / Expression
            </span>
            <div className="flex gap-3">
                <input
                    type="text"
                    value={newWord}
                    onChange={(e) => setNewWord(e.target.value)}
                    placeholder="+ ex: discord.gg/..."
                    className="flex-1 bg-[#0c0020]/60 border border-purple-500/20 rounded-lg px-4 py-3 text-base text-[#cfd9e8] placeholder-[#8e7aab]/40 focus:outline-none focus:border-purple-500/50 transition-colors"
                />
                <button
                    onClick={handleAdd}
                    disabled={!newWord.trim()}
                    className="bg-[#24133f] hover:bg-[#2f1b52] disabled:opacity-50 text-[#cfd9e8] border border-purple-500/20 font-semibold px-6 py-2.5 rounded-lg text-base transition-all cursor-pointer disabled:cursor-not-allowed">
                    Ajouter
                </button>
            </div>
        </div>
    );

}