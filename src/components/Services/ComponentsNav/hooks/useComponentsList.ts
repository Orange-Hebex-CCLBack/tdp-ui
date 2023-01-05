import { useCallback, useEffect, useState } from 'react'
import { useTdpClient } from 'src/contexts'

export function useComponentsList(serviceId: string) {
  const { servicesApi } = useTdpClient()
  const [components, setComponents] = useState<{ id: string; isUsed: any }[]>(
    []
  )
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchComponentsList = useCallback(
    async (serviceId: string) => {
      setLoading(true)
      try {
        const res = await servicesApi.getServiceApiV1ServiceServiceIdGet(
          serviceId
        )
        setComponents(
          res.data.components.map((c) => ({
            id: c.id,
            isUsed: Object.values(c.variables).length > 0,
          }))
        )
      } catch (e) {
        setError(e)
      } finally {
        setLoading(false)
      }
    },
    [servicesApi]
  )

  useEffect(() => {
    if (serviceId) {
      fetchComponentsList(serviceId)
    }
  }, [serviceId, fetchComponentsList])

  return { components, loading, error }
}
