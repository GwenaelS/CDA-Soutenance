import type { RoleExemptionProps } from "@wystrelia/shared/types";
import { X, Plus } from "lucide-react";

export function RoleExemptions({ serverRoles, exemptedRoles, onAddExemptedRole, onRemoveExemptedRole} : RoleExemptionProps) {
    
    const exemptedRolesData = serverRoles.filter((role) => exemptedRoles.includes(role.name));
    const availableRoles = serverRoles.filter((role) => !exemptedRoles.includes(role.name));
    
    return (
        <div className="bg-[#140030]/80 border border-border/40 rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-sm font-bold text-[#cfd9e8]">
                        Rôles exemptés du filtre
                    </h2>
                    <p className="text-xs text-[#8e7aab] mt-1">
                        Ces rôles peuvent envoyer les mots filtrés sans sanction
                    </p>
                </div>
                <span className="text-xs bg-[#24133f]/60 border border-purple-500/10 text-[#cfd9e8] px-2.5 py-1 rounded-full shrink-0">
                    {exemptedRoles.length} exempté(s)
                </span>
            </div>

            {/* Rôles exemptés */}
            <div className="flex flex-wrap gap-2">
                {exemptedRolesData.length === 0 ? (
                    <p className="text-xs text-[#8e7aab]/60 italic py-1">Aucun rôle n'est exempté pour le moment.</p>
                ) : (
                    exemptedRolesData.map((role) => (
                        <div
                            key={role.name}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all"
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

            {/* Ajouter un rôle */}
            <div className="pt-4 border-t border-purple-500/10">
                <span className="text-xs font-bold text-[#8e7aab] uppercase tracking-wider block mb-3">
                    Ajouter un rôle
                </span>
                <div className="flex flex-wrap gap-2">
                    {availableRoles.length === 0 ? (
                        <p className="text-xs text-[#8e7aab]/60 italic">Tous les rôles sont déjà exemptés.</p>
                    ) : (
                        availableRoles.map((role) => (
                            <button
                                key={role.name}
                                onClick={() => onAddExemptedRole(role.name)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-dashed bg-transparent hover:bg-white/[0.02] transition-all cursor-pointer"
                                style={{
                                    borderColor: `${role.color}30`,
                                    color: role.color
                                }}
                            >
                                <Plus className="w-3 h-3" />
                                <span>{role.name}</span>
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}