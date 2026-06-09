import { useState, useEffect, useCallback } from 'react'

export interface Lead {
  id: number
  first_name: string
  last_name: string
  email: string
  company: string
  budget: string
  created_at: string
  db_status: string
  hubspot_status: string
  hubspot_contact_id: string | null
}

export function useLeadSocket(wsUrl: string) {
  const [leads, setLeads] = useState<Lead[]>([])

  const upsertLead = useCallback((lead: Lead) => {
    setLeads((prev) => {
      const idx = prev.findIndex((l) => l.id === lead.id)
      if (idx >= 0) {
        const updated = [...prev]
        updated[idx] = lead
        return updated
      }
      return [lead, ...prev]
    })
  }, [])

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/leads/`)
      .then((r) => r.json())
      .then((data: Lead[]) => setLeads(data))
      .catch(console.error)

    let ws: WebSocket
    let retryTimeout: ReturnType<typeof setTimeout>

    const connect = () => {
      ws = new WebSocket(wsUrl)

      ws.onmessage = (event) => {
        try {
          upsertLead(JSON.parse(event.data) as Lead)
        } catch {
          // ignore malformed messages
        }
      }

      ws.onclose = () => {
        retryTimeout = setTimeout(connect, 3000)
      }
    }

    connect()

    return () => {
      clearTimeout(retryTimeout)
      ws?.close()
    }
  }, [wsUrl, upsertLead])

  return { leads }
}
