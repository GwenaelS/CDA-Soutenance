// Import necessary modules from React and React Router
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router'

/* ************************************************************************* */

// Import the main app component
import './index.css'
import { LoginPage } from './features/auth/LoginPage.tsx'
import { DashboardLayout } from './layout/DashboardLayout.tsx'
import { StatsPage } from './features/statistics/StatsPage.tsx'
import { ServerRoute } from './layout/ServerRoute.tsx'
import { MembersPage } from './features/members/MembersPage.tsx'
import { FilterwordPage } from './features/filter-word/FilterwordPage.tsx'
import { ModerationPage } from './features/moderation/ModerationPage.tsx'
import { LogsPage } from './features/logs/LogsPage.tsx'
import { LevelingPage } from './features/leveling/LevelingPage.tsx'
import { ParamsPage } from './features/parametres/ParametrePage.tsx'

/* ************************************************************************* */

// Create router configuration with routes
const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/dashboard',
    element: <DashboardLayout />,
    children: [
      {
        path: ':guildId',
        children: [
          { index: true, element: <ServerRoute Page={StatsPage} /> },
          { path: 'members', element: <ServerRoute Page={MembersPage} /> },
          { path: 'filterword', element: <ServerRoute Page={FilterwordPage} /> },
          { path: 'warnings', element: <ServerRoute Page={ModerationPage} /> }, // ModerationPage doit devenir WarningPage
          { path: 'logs', element: <ServerRoute Page={LogsPage} /> },
          { path: 'leveling', element: <ServerRoute Page={LevelingPage} /> },
          { path: 'settings', element: <ServerRoute Page={ParamsPage} /> }, // ParamsPage doit devenir SettingPage
        ],
      },
    ],
  },
  { path: '/', element: <Navigate to="/dashboard" replace /> },
  { path: '*', element: <Navigate to="/dashboard" replace /> },
]);

/* ************************************************************************* */

// Find the root element in the HTML document
const rootElement = document.getElementById('root');
if (rootElement == null) {
  throw new Error(`Your HTML Document should contain a <div id="root"></div>`);
}

// Render the app inside the root element
createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
