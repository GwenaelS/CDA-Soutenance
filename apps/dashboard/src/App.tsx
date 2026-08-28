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
import { apiFetch } from './lib/apiClient'

function App() {
  const [servers, setServers] = useState<DashboardServer[]>([])
  const [selectedServer, setSelectedServer] = useState<DashboardServer | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [currentPath, setCurrentPath] = useState(window.location.pathname)

  // 1. Charger les serveurs depuis l'API au premier rendu
  useEffect(() => {
    async function loadServers() {
      try {
        setIsLoading(true)
        const data = await apiFetch<DashboardServer[]>('/guilds')
        setServers(data)
        
        if (data.length > 0) {
          setSelectedServer(data[0])
        }
      } catch (error) {
        console.error('Erreur lors du chargement des serveurs:', error)
        // Redirection vers le login en cas d'erreur d'authentification
        if (window.location.pathname !== '/login') {
          navigate('/login')
        }
      } finally {
        setIsLoading(false)
      }
    }

    if (window.location.pathname !== '/login') {
      loadServers()
    } else {
      setIsLoading(false)
    }
  }, [])

  // 2. Gestion des URLs et de l'historique navigateur
  useEffect(() => {
    if (window.location.pathname === '/' || window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/') {
      if (selectedServer) {
        window.history.replaceState({}, '', `/dashboard/${selectedServer.id}`)
        setCurrentPath(`/dashboard/${selectedServer.id}`)
      }
    }
  }, [selectedServer])

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

  // Sync du serveur sélectionné depuis l'URL
  useEffect(() => {
    if (guildIdStr && servers.length > 0) {
      const server = servers.find(s => String(s.id) === guildIdStr)
      if (server && selectedServer?.id !== server.id) {
        setSelectedServer(server)
      }
    }
  }, [guildIdStr, servers, selectedServer?.id])

  const navigate = (to: string) => {
    window.history.pushState({}, '', to)
    setCurrentPath(to)
  }

  if (currentPath === '/login') {
    return <LoginPage />
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0c0020] text-white">
        <p className="animate-pulse">Chargement des données du Dashboard...</p>
      </div>
    )
  }

  if (!selectedServer) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-[#0c0020] text-white space-y-4">
        <p>Aucun serveur disponible ou session expirée.</p>
        <button 
          onClick={() => navigate('/login')}
          className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition"
        >
          Se connecter
        </button>
      </div>
    )
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
          servers={servers}
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