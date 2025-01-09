
import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import Sidebar from '@/components/Sidebar'
import TimeSlider from '@/components/TimeSlider'
import { TimeProvider } from '@/contexts/TimeContext'

const Map = dynamic(() => import('@/components/Map'), {
  loading: () => <Skeleton className="h-[calc(100vh-8rem)] w-full" />,
  ssr: false
})

export default function Home() {
  return (
    <TimeProvider>
      <main className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col p-4 h-screen overflow-hidden">
          <h1 className="text-2xl font-bold mb-4 text-center">Police Department Incident Reports (2018-2025)</h1>
          <div className="relative flex-1 mb-4">
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
              <Map />
            </Suspense>
          </div>
          <div className="w-full px-4 pb-4">
            <TimeSlider />
          </div>
        </div>
      </main>
    </TimeProvider>
  )
}
