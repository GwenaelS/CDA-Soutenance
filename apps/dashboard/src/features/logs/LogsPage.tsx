import { useState, useEffect } from "react";
import type { DashboardServer, Log } from "@wystrelia/shared/types";
import LogsRow from "./components/LogsRow";
import { apiFetch } from "../../lib/apiClient";

type LogTab = "Tout" | "Entrées/Sorties" | "Messages" | "Rôles" | "Modération";

export function LogsPage({ server }: { server: DashboardServer }) {
  const [activeTab, setActiveTab] = useState<LogTab>("Tout");
  const [logs, setLogs] = useState<Log[]>(server.logs || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLogs() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await apiFetch<Log[]>(`/guilds/${server.id}/logs`);
        setLogs(data);
      } catch (err) {
        console.error("Erreur lors de la récupération des logs :", err);
        setError("Impossible de charger l'historique des logs.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchLogs();
  }, [server.id]);

  const getLogCategory = (type: string): LogTab | null => {
    const t = type.toUpperCase();
    if (t === "JOIN" || t === "LEAVE") return "Entrées/Sorties";
    if (t === "DELETE" || t === "EDIT") return "Messages";
    if (t === "ROLE_ADD" || t === "ROLE_REMOVE") return "Rôles";
    if (t === "WARN" || t === "MUTE" || t === "BAN" || t === "BOOST") return "Modération";
    return null;
  };

  const filteredLogs = logs.filter((log) => {
    if (activeTab === "Tout") return true;
    return getLogCategory(log.type) === activeTab;
  });

  const getCount = (tab: LogTab) => {
    if (tab === "Tout") return logs.length;
    return logs.filter((log) => getLogCategory(log.type) === tab).length;
  };

  const tabs: LogTab[] = ["Tout", "Entrées/Sorties", "Messages", "Rôles", "Modération"];

  return (
    <div className="space-y-6 text-[#dcb6fb]">
      <div>
        <span className="text-base font-bold text-[#8e7aab] uppercase tracking-wider">
          Modération / Logs
        </span>
        <h1 className="text-4xl font-extrabold text-[#cfd9e8] mt-1.5 tracking-tight">Logs</h1>
        <p className="text-base font-semibold text-[#8e7aab] mt-1.5">
          Activité récente du royaume • {logs.length} derniers événements
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          const count = getCount(tab);
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-base font-bold uppercase tracking-wider rounded-xl border transition duration-300 cursor-pointer flex items-center gap-2 ${
                isActive
                  ? "bg-purple-600/30 border-cyan-400 text-white shadow-[0_0_8px_rgba(37,248,255,0.2)]"
                  : "border-border/20 text-[#8e7aab] hover:border-border/60 hover:text-white"
              }`}
            >
              <span>{tab}</span>
              <span
                className={`px-1.5 py-0.5 text-base rounded-md font-bold ${
                  isActive ? "bg-[#00edf5]/20 text-[#00edf5]" : "bg-[#140030]/60 text-[#8e7aab]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {isLoading ? (
        <div className="bg-[#140030]/50 backdrop-blur-md border border-border/40 rounded-xl p-8 text-center text-[#8e7aab] text-base font-semibold animate-pulse">
          Chargement des logs...
        </div>
      ) : error ? (
        <div className="bg-[#140030]/50 backdrop-blur-md border border-red-500/30 rounded-xl p-8 text-center text-red-400 text-base font-semibold">
          {error}
        </div>
      ) : filteredLogs.length > 0 ? (
        <div className="space-y-3">
          {filteredLogs.map((log) => (
            <LogsRow key={log.id} log={log} />
          ))}
        </div>
      ) : (
        <div className="bg-[#140030]/50 backdrop-blur-md border border-border/40 rounded-xl p-8 text-center text-[#8e7aab] text-base font-semibold">
          Aucun log trouvé.
        </div>
      )}
    </div>
  );
}