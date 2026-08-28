import { useState, useRef, useEffect } from "react";
import type { RoleExemptionProps } from "@wystrelia/shared/types";
import { X, Plus, ChevronDown } from "lucide-react";

export function RoleExemptions({ serverRoles, exemptedRoles, onAddExemptedRole, onRemoveExemptedRole }: RoleExemptionProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const exemptedRolesData = serverRoles.filter((role) => exemptedRoles.includes(role.name));
    const availableRoles = serverRoles.filter((role) => !exemptedRoles.includes(role.name));

    return (
        <div className="bg-[#140030]/50 border border-[#9D4EDD]/75 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-base font-bold text-[#cfd9e8]">
                        Rôles exemptés du filtre
                    </h2>
                    <p className="text-base text-[#8e7aab] mt-1">
                        Ces rôles peuvent envoyer les mots filtrés sans sanction
                    </p>
                </div>
                <span className="text-base bg-[#24133f]/60 border border-purple-500/10 text-[#cfd9e8] px-2.5 py-1 rounded-full shrink-0">
                    {exemptedRoles.length} exempté(s)
                </span>
            </div>

            <div className="flex flex-wrap gap-2">
                {exemptedRolesData.length === 0 ? (
                    <p className="text-base text-[#8e7aab]/60 italic py-1">Aucun rôle n'est exempté pour le moment.</p>
                ) : (
                    exemptedRolesData.map((role) => (
                        <div
                            key={role.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-base font-semibold border transition-all"
                            style={{
                                borderColor: `${role.color}40`,
                                color: role.color,
                                backgroundColor: `${role.color}15`
                            }}
                        >
                            <span>{role.name}</span>
                            <button
                                onClick={() => onRemoveExemptedRole(role.name)}
                                className="hover:bg-white/10 rounded-full p-0.5 transition-colors cursor-pointer"
                                title="Retirer l'exemption"
                            >
                                <X className="w-3 h-3" />
                            </button>
                        </div>
                    ))
                )}
            </div>

            <div className="pt-4 border-t border-purple-500/10">
                <span className="text-base font-bold text-[#8e7aab] uppercase tracking-wider block mb-3">
                    Ajouter un rôle
                </span>
                {availableRoles.length === 0 ? (
                    <p className="text-base text-[#8e7aab]/60 italic">Tous les rôles sont déjà exemptés.</p>
                ) : (
                    <div className="relative inline-block text-left" ref={dropdownRef}>
                        <button
                            type="button"
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="inline-flex items-center justify-between gap-2 px-4 py-2 rounded-xl text-base font-semibold border border-purple-500/20 bg-[#1e0a3d]/40 text-[#cfd9e8] hover:bg-[#1e0a3d]/80 hover:border-purple-500/40 transition-all cursor-pointer shadow-sm min-w-[200px]"
                        >
                            <span className="flex items-center gap-2">
                                <Plus className="w-4 h-4 text-purple-400" />
                                Sélectionner un rôle
                            </span>
                            <ChevronDown className={`w-4 h-4 text-[#8e7aab] transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute left-0 bottom-full mb-2 w-64 bg-[#0d0221] border border-purple-500/20 rounded-xl shadow-2xl py-1.5 z-50 max-h-60 overflow-y-auto divide-y divide-purple-500/10 backdrop-blur-md">
                                {availableRoles.map((role) => (
                                    <button
                                        key={role.name}
                                        onClick={() => {
                                            onAddExemptedRole(role.name);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-[#1e0a3d]/50 text-left transition-colors cursor-pointer text-base font-medium"
                                        style={{ color: role.color }}
                                    >
                                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: role.color }} />
                                        <span>{role.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}