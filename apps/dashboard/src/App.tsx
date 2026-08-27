import { useState, useEffect } from 'react'
import { Header } from './layout/components/header/Header'
import ServerList from './layout/components/sidebar/sidebar'
import type { DashboardServer } from '@wystrelia/shared/types'
import { MembersPage } from './features/members/MembersPage'
import { StatsPage } from './features/statistics/StatsPage'
import { FilterwordPage } from './features/filter-word/FilterwordPage'
import { ModerationPage } from './features/moderation/ModerationPage'
import { LogsPage } from './features/logs/LogsPage'
import { LevelingPage } from './features/leveling/LevelingPage'
import { LoginPage } from './features/auth/LoginPage'
import { ParamsPage } from './features/parametres/ParametrePage'

import {
  MOCK_MEMBERS_WYSTRELIA, MOCK_STATS_WYSTRELIA,
  MOCK_MEMBERS_VANILLE, MOCK_STATS_VANILLE,
  MOCK_MEMBERS_DEV, MOCK_STATS_DEV,
  MOCK_MEMBERS_SIMPLON, MOCK_STATS_SIMPLON,
  MOCK_ROLES_WYSTRELIA, MOCK_FILTER_CONFIG_WYSTRELIA,
  MOCK_ROLES_VANILLE, MOCK_FILTER_CONFIG_VANILLE,
  MOCK_ROLES_DEV, MOCK_FILTER_CONFIG_DEV,
  MOCK_ROLES_SIMPLON, MOCK_FILTER_CONFIG_SIMPLON,
  MOCK_WARNINGS_WYSTRELIA, MOCK_WARNINGS_VANILLE,
  MOCK_WARNINGS_DEV, MOCK_WARNINGS_SIMPLON,
  MOCK_LOGS_WYSTRELIA, MOCK_LOGS_VANILLE,
  MOCK_LOGS_DEV, MOCK_LOGS_SIMPLON,
  MOCK_LEVELING_WYSTRELIA, MOCK_LEVELING_VANILLE,
  MOCK_LEVELING_DEV, MOCK_LEVELING_SIMPLON
} from './features/members/data/mockMembers'
const FAKE_SERVERS: DashboardServer[] = [
  {
    id: 1,
    name: "Wystrelia",
    icon: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef",
    gradient: "from-purple-600 to-indigo-600",
    isActive: true,
    members: MOCK_MEMBERS_WYSTRELIA,
    stats: MOCK_STATS_WYSTRELIA,
    roles: MOCK_ROLES_WYSTRELIA,
    filterConfig: MOCK_FILTER_CONFIG_WYSTRELIA,
    warnings: MOCK_WARNINGS_WYSTRELIA,
    logs: MOCK_LOGS_WYSTRELIA,
    levelingConfig: MOCK_LEVELING_WYSTRELIA
  },
  {
    id: 2,
    name: "Monde de Vanille",
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=pixel",
    gradient: "from-orange-500 to-pink-500",
    isActive: false,
    members: MOCK_MEMBERS_VANILLE,
    stats: MOCK_STATS_VANILLE,
    roles: MOCK_ROLES_VANILLE,
    filterConfig: MOCK_FILTER_CONFIG_VANILLE,
    warnings: MOCK_WARNINGS_VANILLE,
    logs: MOCK_LOGS_VANILLE,
    levelingConfig: MOCK_LEVELING_VANILLE
  },
  {
    id: 3,
    name: "Espace Dev",
    icon: "https://api.dicebear.com/7.x/adventurer/svg?seed=ninja",
    gradient: "from-emerald-500 to-teal-600",
    isActive: false,
    members: MOCK_MEMBERS_DEV,
    stats: MOCK_STATS_DEV,
    roles: MOCK_ROLES_DEV,
    filterConfig: MOCK_FILTER_CONFIG_DEV,
    warnings: MOCK_WARNINGS_DEV,
    logs: MOCK_LOGS_DEV,
    levelingConfig: MOCK_LEVELING_DEV
  },
  {
    id: 4,
    name: "Simplon Bot",
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=sacha",
    gradient: "from-red-500 to-amber-500",
    isActive: false,
    members: MOCK_MEMBERS_SIMPLON,
    stats: MOCK_STATS_SIMPLON,
    roles: MOCK_ROLES_SIMPLON,
    filterConfig: MOCK_FILTER_CONFIG_SIMPLON,
    warnings: MOCK_WARNINGS_SIMPLON,
    logs: MOCK_LOGS_SIMPLON,
    levelingConfig: MOCK_LEVELING_SIMPLON
  }
]

function App() {
  const [selectedServer, setSelectedServer] = useState<DashboardServer>(FAKE_SERVERS[0])
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/') {
      window.history.replaceState({}, '', '/dashboard/1')
      setCurrentPath('/dashboard/1')
    }
  }, [])

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const parts = currentPath.split('/')
  const guildIdStr = parts[2]
  const isMembersPage = parts[3] === 'members'
  const isFilterwordPage = parts[3] === 'filterword'
  const isWarningsPage = parts[3] === 'warnings'
  const isLogsPage = parts[3] === 'logs'
  const isLevelingPage = parts[3] === 'leveling'
  const isParamsPage = parts[3] === 'settings'

  useEffect(() => {
    const guildId = guildIdStr ? parseInt(guildIdStr) : 1
    const server = FAKE_SERVERS.find(s => s.id === guildId)
    if (server && server.id !== selectedServer.id) {
      setSelectedServer(server)
    }
  }, [guildIdStr, selectedServer.id])

  const navigate = (to: string) => {
    window.history.pushState({}, '', to)
    setCurrentPath(to)
  }

  if (currentPath === '/login') {
    return <LoginPage />
  }

  return (
    <div className="flex flex-col h-screen bg-[#0c0020] text-foreground overflow-hidden">
      <Header selectedServerName={selectedServer.name} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ServerList
          selectedServer={selectedServer}
          setSelectedServer={(server) => {
            setSelectedServer(server)
            const suffix = isMembersPage
              ? '/members'
              : isFilterwordPage
              ? '/filterword'
              : isWarningsPage
              ? '/warnings'
              : isLogsPage
              ? '/logs'
              : isLevelingPage
              ? '/leveling'
              : isParamsPage
              ? '/settings'
              : ''
            navigate(`/dashboard/${server.id}${suffix}`)
          }}
          servers={FAKE_SERVERS}
          currentPath={currentPath}
          onNavigate={navigate}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            {isMembersPage ? (
              <MembersPage server={selectedServer} />
            ) : isFilterwordPage ? (
              <FilterwordPage server={selectedServer} />
            ) : isWarningsPage ? (
              <ModerationPage server={selectedServer} />
            ) : isLogsPage ? (
              <LogsPage server={selectedServer} />
            ) : isLevelingPage ? (
              <LevelingPage server={selectedServer} />
              ) : isParamsPage ? (
              <ParamsPage server={selectedServer} />
            ) : (
              <StatsPage server={selectedServer} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
