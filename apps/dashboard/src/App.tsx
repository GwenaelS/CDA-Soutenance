import { Header } from './layout/components/header/Header'

function App() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 overflow-y-auto" />
    </div>
  )
}

export default App
