import { useState, useEffect } from 'react'
import { Header } from './layout/components/header/Header'
import ServerList from './layout/components/sidebar/sidebar'
import type { DashboardServer } from '@wystrelia/shared/types'
import { MembersPage } from './features/members/MembersPage'
import {
  MOCK_MEMBERS_WYSTRELIA, MOCK_STATS_WYSTRELIA,
  MOCK_MEMBERS_VANILLE, MOCK_STATS_VANILLE,
  MOCK_MEMBERS_DEV, MOCK_STATS_DEV,
  MOCK_MEMBERS_SIMPLON, MOCK_STATS_SIMPLON
} from './features/members/data/mockMembers'

const FAKE_SERVERS: DashboardServer[] = [
  {
    id: 1,
    name: "Wystrelia",
    icon: "https://api.dicebear.com/7.x/adventurer/svg?seed=chef",
    gradient: "from-purple-600 to-indigo-600",
    isActive: true,
    members: MOCK_MEMBERS_WYSTRELIA,
    stats: MOCK_STATS_WYSTRELIA
  },
  {
    id: 2,
    name: "Monde de Vanille",
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=pixel",
    gradient: "from-orange-500 to-pink-500",
    isActive: false,
    members: MOCK_MEMBERS_VANILLE,
    stats: MOCK_STATS_VANILLE
  },
  {
    id: 3,
    name: "Espace Dev",
    icon: "https://api.dicebear.com/7.x/adventurer/svg?seed=ninja",
    gradient: "from-emerald-500 to-teal-600",
    isActive: false,
    members: MOCK_MEMBERS_DEV,
    stats: MOCK_STATS_DEV
  },
  {
    id: 4,
    name: "Simplon Bot",
    icon: "https://api.dicebear.com/7.x/bottts/svg?seed=sacha",
    gradient: "from-red-500 to-amber-500",
    isActive: false,
    members: MOCK_MEMBERS_SIMPLON,
    stats: MOCK_STATS_SIMPLON
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

  return (
    <div className="flex flex-col h-screen bg-[#0c0020] text-foreground overflow-hidden">
      <Header selectedServerName={selectedServer.name} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ServerList
          selectedServer={selectedServer}
          setSelectedServer={(server) => {
            setSelectedServer(server)
            const suffix = isMembersPage ? '/members' : ''
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
            ) : (
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-[#8e7aab] space-y-4">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Dashbord du serveur {selectedServer.name}</h2>
                  <p className="text-sm font-semibold">Cette page de dashbord n'est pas encore implémentée.</p>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

export default App
