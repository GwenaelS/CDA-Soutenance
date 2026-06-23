import { useState } from "react";
import { Home, Settings, Menu, X, ChevronDown, ChevronUp } from "lucide-react";
import type { ServerListProps } from "@wystrelia/shared/types";

export default function ServerList({
    selectedServer,
    setSelectedServer,
    servers,
    currentPath,
    onNavigate
}: ServerListProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const categories = [
        {
            title: "GÉNÉRAL",
            links: [
                { name: "Statistiques" },
                { name: "Liste des membres" }
            ]
        },
        {
            title: "MODÉRATION",
            links: [
                { name: "Mots-filtrés" },
                { name: "Avertissements" },
                { name: "Logs" }
            ]
        },
        {
            title: "COMMUNAUTAIRE",
            links: [
                { name: "Système d'expérience" }
            ]
        }
    ];

    return (
        <>
            <button
                className="lg:hidden absolute top-2 left-4 z-50 p-1.5 text-white bg-[#140030] hover:bg-purple-950 border border-border rounded-lg transition-colors cursor-pointer"
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle Menu"
            >
                {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <div className={`
                fixed inset-y-0 left-0 z-40 flex lg:w-[310px] w-[240px] border-r border-border transform transition-transform duration-300 ease-in-out
                ${isOpen ? "translate-x-0" : "-translate-x-full"} 
                lg:translate-x-0 lg:static lg:h-full shrink-0
            `}>
                <div className="hidden lg:flex flex-col w-[70px] bg-[#070016] border-r border-border/40 py-6 justify-between shrink-0">
                    <div className="flex flex-col items-center gap-4 w-full">
                        <button
                            onClick={() => { if (onNavigate) onNavigate("/dashboard"); }}
                            className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center hover:scale-105 transition shadow-md group relative cursor-pointer"
                        >
                            <Home size={20} className="text-white group-hover:text-cyan-300 transition-colors" />
                            <div className="absolute left-0 w-1 h-0 bg-white rounded-r-md group-hover:h-5 transition-all duration-200" />
                        </button>

                        <div className="w-10 h-[1px] bg-border/40 my-2" />

                        <div className="flex flex-col gap-3 items-center w-full">
                            {servers.map((server) => {
                                const isCurrent = server.id === selectedServer.id;
                                return (
                                    <button
                                        key={server.id}
                                        onClick={() => {
                                            setSelectedServer(server);
                                            if (onNavigate) {
                                                const suffix = currentPath?.endsWith("/members") ? "/members" : currentPath?.endsWith("/filterword") ? "/filterword" : "";
                                                onNavigate(`/dashboard/${server.id}${suffix}`);
                                            }
                                        }}
                                        className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#140030] to-[#0c0020] hover:scale-105 transition flex items-center justify-center relative group border border-border/20 hover:border-cyan-400 cursor-pointer"
                                    >
                                        <div className={`absolute left-0 w-1 rounded-r-md bg-cyan-400 transition-all duration-300 ${isCurrent ? 'h-8' : 'h-0 group-hover:h-4'}`} />
                                        <img src={server.icon} alt={server.icon} className="w-10 h-10 rounded-lg bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-base shadow-md border border-border/30" />
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <button className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 border border-slate-600 flex items-center justify-center hover:scale-105 transition shadow-md group cursor-pointer">
                        <Settings size={20} className="text-slate-300 group-hover:text-cyan-300 transition-colors" />
                    </button>
                </div>

                <div className="w-[240px] bg-[#140030] flex flex-col h-full py-6 px-4 overflow-y-auto shrink-0 select-none">
                    <div className="flex items-center justify-center gap-3 border-b border-border/20 pb-4">
                        <div className="relative flex flex-col items-center justify-center w-full">
                            <img src={selectedServer.icon} alt="" className="w-11 h-11 rounded-full bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-base shadow-md border border-border/30" />
                            <p className="mt-3">
                                {selectedServer.name}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 relative lg:hidden">
                        <div
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="p-2.5 rounded-xl bg-[#0c0020] border border-border/50 hover:border-cyan-500/50 transition-all duration-300 cursor-pointer flex items-center justify-between shadow-sm"
                        >
                            <div className="flex items-center min-w-0">
                                <img src={selectedServer.icon} alt={selectedServer.icon} className="w-10 h-10 rounded-lg bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-base shadow-md border border-border/30" />
                                <div className="ml-2.5 min-w-0">
                                    <p className="text-xs font-extrabold text-white truncate">{selectedServer.name}</p>
                                    <p className="text-[9px] text-cyan-400 font-semibold tracking-wider uppercase mt-0.5">Serveur actif</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1 shrink-0 ml-1">
                                <span className="px-1.5 py-0.5 text-[8px] border border-cyan-500/80 text-cyan-400 rounded bg-cyan-950/30 font-bold uppercase tracking-wider">Actif</span>
                                {isDropdownOpen ? <ChevronUp size={14} className="text-purple-400" /> : <ChevronDown size={14} className="text-purple-400" />}
                            </div>
                        </div>

                        {isDropdownOpen && (
                            <div className="absolute left-0 right-0 mt-1.5 bg-[#0c0020] border border-border/70 rounded-xl overflow-hidden shadow-2xl divide-y divide-border/20 z-50">
                                {servers.map((server) => (
                                    <div
                                        key={server.id}
                                        onClick={() => {
                                            setSelectedServer(server);
                                            setIsDropdownOpen(false);
                                            setIsOpen(false);
                                            if (onNavigate) {
                                                const suffix = currentPath?.endsWith("/members") ? "/members" : currentPath?.endsWith("/filterword") ? "/filterword" : "";
                                                onNavigate(`/dashboard/${server.id}${suffix}`);
                                            }
                                        }}
                                        className={`flex items-center justify-between px-3 py-2.5 cursor-pointer transition-colors duration-200 ${server.id === selectedServer.id ? 'bg-purple-950/30' : 'hover:bg-[#140030]'
                                            }`}
                                    >
                                        <div className="flex items-center min-w-0">
                                            <img src={server.icon} alt={server.icon} className="w-10 h-10 rounded-lg bg-gradient-to-tr from-pink-500 via-purple-600 to-indigo-600 flex items-center justify-center font-extrabold text-white text-base shadow-md border border-border/30" />
                                            <span className="text-xs text-purple-100 font-semibold ml-2.5 truncate">{server.name}</span>
                                        </div>
                                        {server.id === selectedServer.id && (
                                            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,237,245,0.8)]" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="mt-8 space-y-6 flex-1">
                        {categories.map((category) => (
                            <div key={category.title} className="space-y-2.5">
                                <p className="text-[10px] font-bold text-[#8e7aab] tracking-widest uppercase pl-1">{category.title}</p>
                                <ul className="space-y-1 animate-fadeIn">
                                    {category.links.map((link) => {
                                        const isMembersLink = link.name === "Liste des membres";
                                        const isStatsLink = link.name === "Statistiques";
                                        const isFilterwordLink = link.name === "Mots-filtrés";
                                        const path = isMembersLink
                                            ? `/dashboard/${selectedServer.id}/members`
                                            : isFilterwordLink
                                                ? `/dashboard/${selectedServer.id}/filterword`
                                                : `/dashboard/${selectedServer.id}`;

                                        const isActive = isMembersLink
                                            ? currentPath?.endsWith("/members")
                                            : isFilterwordLink
                                                ? currentPath?.endsWith("/filterword")
                                                : isStatsLink && currentPath?.startsWith("/dashboard/") && !currentPath?.endsWith("/members") && !currentPath?.endsWith("/filterword");

                                        return (
                                            <li key={link.name}>
                                                <a
                                                    href={path}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        if (onNavigate) onNavigate(path);
                                                    }}
                                                    className={`flex items-center text-sm font-medium py-1.5 px-2.5 rounded-lg hover:bg-purple-950/10 group transition-all duration-200 ${isActive ? 'text-cyan-400 bg-purple-950/10' : 'text-[#dcb6fb] hover:text-cyan-400'
                                                        }`}
                                                >
                                                    <span className={`w-1.5 h-1.5 rotate-45 transition-all duration-300 mr-3 inline-block shrink-0 ${isActive ? 'bg-[#00edf5] shadow-[0_0_8px_#00edf5]' : 'bg-[#8e7aab]/40 group-hover:bg-[#00edf5]'
                                                        }`} />
                                                    <span className="truncate">{link.name}</span>
                                                </a>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-30 transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}
        </>
    );
}