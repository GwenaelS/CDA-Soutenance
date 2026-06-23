import type { FilterWordListProps } from "@wystrelia/shared/types";
import { X } from  "lucide-react";

export function FilterWordList({ words, onDeleteWord } : FilterWordListProps) {
    return (
        <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-6 flex flex-col">
            <div className="flex justify-between items-center text-xs font-bold text-[#8e7aab] uppercase tracking-wider pb-3 border-b border-purple-500/10 mb-4">
                <span>Mot / Expression</span>
                <span>Ajouté le</span>
            </div>

            <div className="space-y-2 max-h-[350px] overflow-y-auto pr-1">
                {words.length === 0 ? (
                    <div className="text-center text-sm text-[#8e7aab]/60 py-8">
                        Aucun mot filtré sur ce serveur.
                    </div>
                ) : (
                    words.map((wordObj) => (
                        <div 
                            key={wordObj.word} 
                            className="flex justify-between items-center hover:bg-white/[0.02] rounded-lg px-2 py-2.5 transition-colors border-b border-purple-500/5 last:border-b-0"
                        >
                            <span className="text-sm font-semibold text-[#cfd9e8] break-all mr-4">
                                {wordObj.word}
                            </span>
                            <div className="flex items-center gap-3 shrink-0">
                                <span className="text-xs text-[#8e7aab]">
                                    {wordObj.addedAt}
                                </span>
                                <button
                                    onClick={() => onDeleteWord(wordObj.word)}
                                    className="bg-[#24133f]/40 hover:bg-rose-500/20 hover:text-rose-400 border border-purple-500/10 hover:border-rose-500/20 text-[#8e7aab] rounded p-1 transition-all cursor-pointer"
                                    title="Supprimer"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

