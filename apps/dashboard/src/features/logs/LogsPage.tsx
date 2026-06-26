import type { DashboardServer } from "@wystrelia/shared/types";
import LogsRow from "./components/LogsRow";

export function LogsPage({ server }: { server: DashboardServer }) {

    return (
        <div className="space-y-6">
            <div>
                <p className="text-base font-bold text-[#8e7aab] uppercase tracking-wider">Modération / Logs</p>
                <h1 className="text-4xl font-extrabold text-[#cfd9e8] mt-1">Logs</h1>
                <p className="text-base font-semibold text-[#8e7aab] mt-1">Logs du serveur</p>
            </div>

            <div className="grid grid-flow-col auto-cols-max gap-3">
                {server.logs.map((log) => (
                    <LogsRow key={log.id} log={log} />
                ))}
            </div>
        </div>
    );
}
