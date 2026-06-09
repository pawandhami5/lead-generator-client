import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { Lead } from '@/hooks/useLeadSocket'

const BUDGET_LABELS: Record<string, string> = {
  under_10k: '<$10k',
  '10k_50k': '$10k–50k',
  over_50k: '>$50k',
}

const BUDGET_COLORS = ['#818cf8', '#34d399', '#fb923c']
const STATUS_COLORS: Record<string, string> = {
  synced: '#34d399',
  pending: '#fb923c',
  failed: '#f87171',
}

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: 8,
  fontSize: 12,
  color: '#0f172a',
  boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
  zIndex: 9999,
}

function buildBudgetData(leads: Lead[]) {
  const counts: Record<string, number> = {}
  for (const l of leads) {
    const key = BUDGET_LABELS[l.budget] ?? l.budget
    counts[key] = (counts[key] ?? 0) + 1
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }))
}

function buildTimelineData(leads: Lead[]) {
  const counts: Record<string, number> = {}
  for (const l of leads) {
    const day = new Date(l.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })
    counts[day] = (counts[day] ?? 0) + 1
  }
  return Object.entries(counts)
    .map(([date, leads]) => ({ date, leads }))
    .slice(-7)
}

function buildHubSpotData(leads: Lead[]) {
  const counts: Record<string, number> = { synced: 0, pending: 0, failed: 0 }
  for (const l of leads) counts[l.hubspot_status] = (counts[l.hubspot_status] ?? 0) + 1
  return Object.entries(counts).map(([status, count]) => ({ status, count }))
}

// Custom bar shape with rounded top corners
function RoundedBar(props: any) {
  const { x, y, width, height, fill } = props
  if (!height || height <= 0) return null
  const r = 5
  return (
    <path
      d={`M${x},${y + height} L${x},${y + r} Q${x},${y} ${x + r},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height} Z`}
      fill={fill}
    />
  )
}

// Custom horizontal rounded bar
function RoundedBarH(props: any) {
  const { x, y, width, height, fill } = props
  if (!width || width <= 0) return null
  const r = 4
  return (
    <path
      d={`M${x},${y} L${x + width - r},${y} Q${x + width},${y} ${x + width},${y + r} L${x + width},${y + height - r} Q${x + width},${y + height} ${x + width - r},${y + height} L${x},${y + height} Z`}
      fill={fill}
    />
  )
}

export function LeadCharts({ leads }: { leads: Lead[] }) {
  if (leads.length === 0) return null

  const budgetData = buildBudgetData(leads)
  const timelineData = buildTimelineData(leads)
  const hubspotData = buildHubSpotData(leads)
  const total = leads.length

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Budget Breakdown */}
      <Card className="bg-card">
        <CardHeader className="pb-1 pt-4 px-5">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Budget Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="px-5 pb-4 flex flex-col items-center">
          <div className="relative w-full flex justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={budgetData}
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={68}
                  paddingAngle={4}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {budgetData.map((_, i) => (
                    <Cell key={i} fill={BUDGET_COLORS[i % BUDGET_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={tooltipStyle}
                  wrapperStyle={{ zIndex: 9999 }}
                  formatter={(v) => [`${v ?? 0} leads`, '']}
                  separator=""
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-bold">{total}</span>
              <span className="text-xs text-muted-foreground">total</span>
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 mt-2">
            {budgetData.map((d, i) => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span
                  className="inline-block w-2 h-2 rounded-full"
                  style={{ background: BUDGET_COLORS[i % BUDGET_COLORS.length] }}
                />
                {d.name}
                <span className="font-medium text-foreground">{d.value}</span>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Leads Over Time */}
      <Card>
        <CardHeader className="pb-1 pt-4 px-5">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Leads Over Time
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={175}>
            <BarChart data={timelineData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: 'rgba(129,140,248,0.1)', radius: 6 }}
                formatter={(v) => [`${v ?? 0} leads`, '']}
                separator=""
              />
              <Bar dataKey="leads" shape={<RoundedBar />} fill="#818cf8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* HubSpot Sync Status */}
      <Card>
        <CardHeader className="pb-1 pt-4 px-5">
          <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            HubSpot Sync
          </CardTitle>
        </CardHeader>
        <CardContent className="px-2 pb-4">
          <ResponsiveContainer width="100%" height={175}>
            <BarChart
              data={hubspotData}
              layout="vertical"
              margin={{ top: 8, right: 16, left: 8, bottom: 0 }}
              barCategoryGap="30%"
            >
              <CartesianGrid horizontal={false} stroke="#e5e7eb" strokeOpacity={0.5} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="status"
                tick={{ fontSize: 12, fill: '#94a3b8' }}
                tickLine={false}
                axisLine={false}
                width={52}
              />
              <Tooltip
                contentStyle={tooltipStyle}
                cursor={{ fill: 'rgba(129,140,248,0.1)', radius: 6 }}
                formatter={(v) => [`${v ?? 0} leads`, '']}
                separator=""
              />
              <Bar dataKey="count" shape={<RoundedBarH />}>
                {hubspotData.map((d) => (
                  <Cell key={d.status} fill={STATUS_COLORS[d.status] ?? '#94a3b8'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
