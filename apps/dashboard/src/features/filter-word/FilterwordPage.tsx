import { useState, useEffect } from "react";
import type { DashboardServer, FilterWord } from "@wystrelia/shared/types";
import { AddFilterWord } from "./components/AddFilterWord";
import { FilterWordList } from "./components/FilterWordList";
import { RoleExemptions } from "./components/RoleExemptions";

export function FilterwordPage({ server }: { server: DashboardServer }) {
    const [words, setWords] = useState<FilterWord[]>([]);
    const [exemptedRoles, setExemptedRoles] = useState<string[]>([]);

    // Synchronisation lors du changement de serveur
    useEffect(() => {
        setWords(server.filterConfig?.words || []);
        setExemptedRoles(server.filterConfig?.exemptedRoles || []);
    }, [server]);

    const handleAddWord = (newWord: string) => {
        if (words.some((w) => w.word.toLowerCase() === newWord.toLowerCase())) {
            return; // Évite les doublons
        }
        const todayStr = new Date().toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
        const newFilterWord: FilterWord = {
            word: newWord,
            addedAt: todayStr
        };
        setWords([...words, newFilterWord]);
    };

    const handleDeleteWord = (wordToDelete: string) => {
        setWords(words.filter((w) => w.word !== wordToDelete));
    };

    const handleAddExemptedRole = (roleName: string) => {
        if (!exemptedRoles.includes(roleName)) {
            setExemptedRoles([...exemptedRoles, roleName]);
        }
    };

    const handleRemoveExemptedRole = (roleName: string) => {
        setExemptedRoles(exemptedRoles.filter((name) => name !== roleName));
    };

    return (
        <div className="space-y-6">
            <div>
                <p className="text-xs font-bold text-[#8e7aab] uppercase tracking-wider">Modération / Mots-filtrés</p>
                <h1 className="text-3xl font-extrabold text-[#cfd9e8] mt-1">Mots-filtrés</h1>
                <p className="text-xs text-[#8e7aab] mt-1">Termes et expressions bannis dans le royaume</p>
            </div>

            <AddFilterWord onAddWord={handleAddWord} />

            <div className="grid grid-cols-1  gap-6 items-start">
                <FilterWordList words={words} onDeleteWord={handleDeleteWord} />
                <RoleExemptions
                    serverRoles={server.roles || []}
                    exemptedRoles={exemptedRoles}
                    onAddExemptedRole={handleAddExemptedRole}
                    onRemoveExemptedRole={handleRemoveExemptedRole}
                />
            </div>
        </div>
    );
}
