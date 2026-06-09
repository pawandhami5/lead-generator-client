import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'

export function HubSpotStatus() {
  const [connected, setConnected] = useState<boolean | null>(null)

  useEffect(() => {
    const check = () => {
      fetch(`${import.meta.env.VITE_API_URL}/hubspot/status`)
        .then((r) => r.json())
        .then((data: { connected: boolean }) => setConnected(data.connected))
        .catch(() => setConnected(false))
    }
    check()
    const interval = setInterval(check, 30_000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted-foreground">
        HubSpot Router
      </span>
      {connected === null && <Badge variant="secondary">Checking…</Badge>}
      {connected === true && <Badge variant="default">Connected</Badge>}
      {connected === false && <Badge variant="destructive">Disconnected</Badge>}
    </div>
  )
}
