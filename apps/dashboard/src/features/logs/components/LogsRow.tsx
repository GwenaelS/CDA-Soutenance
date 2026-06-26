import type { Log } from "@wystrelia/shared/types";

export default function LogsRow({ log }: { log: Log }) {
    return (
        <div className="bg-[#1c1530] rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4">
            <div className="flex flex-col flex-3 ml-4">
                <p className="text-base font-bold text-[#889ab5]">{log.type}</p>
                <p className="text-sm font-semibold text-[#8e7aab]">{log.raison}</p>
                <p className="text-sm font-semibold text-[#8e7aab]">{log.datetime}</p>
            </div>
        </div>
    )
}
