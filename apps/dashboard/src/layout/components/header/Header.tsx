interface HeaderProps {
  serverName?: string
  botName?: string
  serverAvatarUrl?: string
}

export function Header({
  serverName = 'Vanille',
  botName = "Wystrelia's Bot"
}: HeaderProps) {

  return (
    <header className="flex items-center justify-center gap-4 px-5 h-12 bg-card border-b border-border sticky top-0 z-10">
      <div className="flex items-center gap-3 min-w-0">
        <span className="text-sm font-medium text-card-foreground whitespace-nowrap overflow-hidden text-ellipsis tracking-tight">
          {serverName}
          <span className="text-muted-foreground font-normal"> - </span>
          {botName}
        </span>
      </div>


    </header>
  )
}
