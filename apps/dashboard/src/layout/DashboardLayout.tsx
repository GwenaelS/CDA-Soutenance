import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom'
import type { DashboardServer } from '@wystrelia/shared/types'
import { Header } from './components/header/Header'
import ServerList from './components/sidebar/sidebar'
import { apiFetch } from '../lib/apiClient'

export interface DashboardOutletContext {
  server: DashboardServer
  servers: DashboardServer[]
}

export function DashboardLayout() {
  const [servers, setServers] = useState<DashboardServer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()
  const { guildId } = useParams<{ guildId: string }>()

  // Charger les serveurs depuis l'API au premier rendu
  useEffect(() => {
    async function loadServers() {
      try {
        setIsLoading(true)
        const data = await apiFetch<DashboardServer[]>('/guilds')
        setServers(data)
      } catch (error) {
        console.error('Erreur lors du chargement des serveurs:', error)
        navigate('/login', { replace: true })
      } finally {
        setIsLoading(false)
      }
    }

    void loadServers()
  }, [navigate])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#0c0020] text-white">
        <p className="animate-pulse">Chargement des données du Dashboard...</p>
      </div>
    )
  }

  if (servers.length === 0) {
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

  // Pas de serveur sélectionné dans l'URL -> on redirige vers le premier
  if (!guildId) {
    return <Navigate to={`/dashboard/${servers[0].id}`} replace />
  }

  const selectedServer = servers.find((s) => String(s.id) === guildId)

  // ID de serveur invalide dans l'URL -> on retombe sur le premier serveur
  if (!selectedServer) {
    return <Navigate to={`/dashboard/${servers[0].id}`} replace />
  }

  return (
    <div className="flex flex-col h-screen bg-[#0c0020] text-foreground overflow-hidden">
      <Header selectedServerName={selectedServer.name} />
      <div className="flex flex-1 min-h-0 overflow-hidden">
        <ServerList
          selectedServer={selectedServer}
          // La navigation réelle passe par onNavigate ; ce callback est
          // toujours appelé juste après par la sidebar, donc pas d'action ici.
          setSelectedServer={() => {}}
          servers={servers}
          currentPath={location.pathname}
          onNavigate={(path) => navigate(path)}
        />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">
            <Outlet context={{ server: selectedServer, servers } satisfies DashboardOutletContext} />
          </div>
        </main>
      </div>
    </div>
  )
}
