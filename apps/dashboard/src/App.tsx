import { useState } from 'react'
import { Header } from './layout/components/header/Header'
import ServerList from './layout/components/sidebar/sidebar'
import type { Server } from '@/types/layout'

const FAKE_SERVERS: Server[] = [
  {
    id: 1,
    name: "Wystrelia",
    icon: "W",
    gradient: "from-purple-600 to-indigo-600",
    isActive: true
  },
  {
    id: 2,
    name: "Monde de Vanille",
    icon: "V",
    gradient: "from-orange-500 to-pink-500",
    isActive: false
  },
  {
    id: 3,
    name: "Espace Dev",
    icon: "D",
    gradient: "from-emerald-500 to-teal-600",
    isActive: false
  },
  {
    id: 4,
    name: "Simplon Bot",
    icon: "S",
    gradient: "from-red-500 to-amber-500",
    isActive: false
  }
]

function App() {
  const [selectedServer, setSelectedServer] = useState<Server>(FAKE_SERVERS[0])

  return (
    <div className="flex min-h-screen bg-[#0c0020] text-foreground">
      <ServerList
        selectedServer={selectedServer}
        setSelectedServer={setSelectedServer}
        servers={FAKE_SERVERS}
      />
      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <Header selectedServerName={selectedServer.name} />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto space-y-6">

          </div>
        </main>
      </div>
    </div>
  )
}

export default App
