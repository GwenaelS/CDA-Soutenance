import { Navigate, Route, Routes } from 'react-router-dom'
import { LoginPage } from './features/auth/LoginPage'
import { MembersPage } from './features/members/MembersPage'
import { StatsPage } from './features/statistics/StatsPage'
import { FilterwordPage } from './features/filter-word/FilterwordPage'
import { ModerationPage } from './features/moderation/ModerationPage'
import { LogsPage } from './features/logs/LogsPage'
import { LevelingPage } from './features/leveling/LevelingPage'
import { ParamsPage } from './features/parametres/ParametrePage'
import { DashboardLayout } from './layout/DashboardLayout'
import { ServerRoute } from './layout/ServerRoute'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route path=":guildId">
          <Route index element={<ServerRoute Page={StatsPage} />} />
          <Route path="members" element={<ServerRoute Page={MembersPage} />} />
          <Route
            path="filterword"
            element={<ServerRoute Page={FilterwordPage} />}
          />
          <Route
            path="warnings"
            element={<ServerRoute Page={ModerationPage} />}
          />
          <Route path="logs" element={<ServerRoute Page={LogsPage} />} />
          <Route
            path="leveling"
            element={<ServerRoute Page={LevelingPage} />}
          />
          <Route path="settings" element={<ServerRoute Page={ParamsPage} />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
