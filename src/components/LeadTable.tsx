import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { Lead } from '@/hooks/useLeadSocket'

const BUDGET_LABELS: Record<string, string> = {
  under_10k: 'Under $10k',
  '10k_50k': '$10k – $50k',
  over_50k: '> $50k',
}

type BadgeVariant = 'default' | 'destructive' | 'secondary' | 'outline'

const DB_VARIANT: Record<string, BadgeVariant> = {
  saved: 'default',
  failed: 'destructive',
}

const HS_VARIANT: Record<string, BadgeVariant> = {
  synced: 'default',
  pending: 'secondary',
  failed: 'destructive',
}

export function LeadTable({ leads }: { leads: Lead[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>DB Status</TableHead>
          <TableHead>HubSpot Status</TableHead>
          <TableHead>Submitted</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {leads.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={7}
              className="text-center text-muted-foreground py-8"
            >
              No leads yet — submit one via the form.
            </TableCell>
          </TableRow>
        )}
        {leads.map((lead) => (
          <TableRow key={lead.id}>
            <TableCell className="font-medium">
              {lead.first_name} {lead.last_name}
            </TableCell>
            <TableCell>{lead.email}</TableCell>
            <TableCell>{lead.company}</TableCell>
            <TableCell>{BUDGET_LABELS[lead.budget] ?? lead.budget}</TableCell>
            <TableCell>
              <Badge variant={DB_VARIANT[lead.db_status] ?? 'outline'}>
                {lead.db_status}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={HS_VARIANT[lead.hubspot_status] ?? 'outline'}>
                {lead.hubspot_status}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground text-sm">
              {new Date(lead.created_at).toLocaleString()}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
