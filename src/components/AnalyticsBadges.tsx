import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Lead } from '@/hooks/useLeadSocket'

const BUDGET_MIDPOINTS: Record<string, number> = {
  under_10k: 5_000,
  '10k_50k': 30_000,
  over_50k: 75_000,
}

function formatCurrency(n: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(n)
}

export function AnalyticsBadges({ leads }: { leads: Lead[] }) {
  const totalPipeline = leads.reduce(
    (sum, l) => sum + (BUDGET_MIDPOINTS[l.budget] ?? 0),
    0,
  )

  return (
    <div className="grid grid-cols-2 gap-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Leads
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{leads.length}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Est. Pipeline Value
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold">{formatCurrency(totalPipeline)}</p>
        </CardContent>
      </Card>
    </div>
  )
}
