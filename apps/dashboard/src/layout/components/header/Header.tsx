import type { HeaderProps } from "@wystrelia/shared/types";

export function Header({
  botName = "Wystrelia's Bot",
  botAvatarUrl = "/assets/img/van_blank.png",
  selectedServerName = "Wystrelia"

}: HeaderProps) {

  return (
    <header className="relative flex items-center justify-center gap-4 px-5 h-12 bg-card z-10">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-medium text-card-foreground whitespace-nowrap overflow-hidden text-ellipsis tracking-tight flex items-center gap-2">
          {/* icone du bot ici*/}
          <img
            src={botAvatarUrl}
            alt="Bot Avatar"
            className="w-6 h-6 rounded-full absolute right-5 md:static md:right-auto border border-border"
          />
          {selectedServerName}
          <span className="text-muted-foreground font-normal"> - </span>
          {botName}
        </span>
      </div>
    </header>
  )
}
