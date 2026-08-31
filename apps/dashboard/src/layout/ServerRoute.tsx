import { useOutletContext } from 'react-router-dom'
import type { DashboardServer } from '@wystrelia/shared/types'
import type { DashboardOutletContext } from './DashboardLayout'

interface ServerRouteProps {
  Page: React.ComponentType<{ server: DashboardServer }>
}

export function ServerRoute({ Page }: ServerRouteProps) {
  const { server } = useOutletContext<DashboardOutletContext>()
  return <Page server={server} />
}
