import type { DashboardServer } from '@wystrelia/shared/types'
import type { DashboardOutletContext } from './DashboardLayout'
import { useOutletContext } from 'react-router'

interface ServerRouteProps {
  Page: React.ComponentType<{ server: DashboardServer }>
}

export function ServerRoute({ Page }: ServerRouteProps) {
  const { server } = useOutletContext<DashboardOutletContext>()
  return <Page server={server} />
}
