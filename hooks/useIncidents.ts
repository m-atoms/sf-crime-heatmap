import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useIncidents() {
  const { data, error, isLoading } = useSWR('/api/incidents', fetcher)

  return {
    data: data || [],
    isLoading,
    error
  }
}

