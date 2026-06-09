import { useLeadSocket } from '@/hooks/useLeadSocket'
import { LeadTable } from './LeadTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function Dashboard() {
  const wsUrl = `${import.meta.env.VITE_WS_URL}/ws/leads`
  const { leads } = useLeadSocket(wsUrl)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Lead Distribution Dashboard</h1>
      <Card>
        <CardHeader>
          <CardTitle>Live Lead Feed</CardTitle>
        </CardHeader>
        <CardContent>
          <LeadTable leads={leads} />
        </CardContent>
      </Card>
    </div>
  )
}
