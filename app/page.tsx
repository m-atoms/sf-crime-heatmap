import dynamic from 'next/dynamic'
import { Suspense } from 'react'
import { Skeleton } from "@/components/ui/skeleton"
import Sidebar from '@/components/Sidebar'
import TimeSlider from '@/components/TimeSlider'
import { TimeProvider } from '@/contexts/TimeContext'
import CrimeCharts from '@/components/CrimeCharts'

const Map = dynamic(() => import('@/components/Map'), {
  loading: () => <Skeleton className="h-[calc(100vh-4rem)] w-full" />,
  ssr: false
})

export default function Home() {
  return (
    <TimeProvider>
      <main className="flex min-h-screen flex-col items-center justify-between p-4">
        <h1 className="text-2xl font-bold mb-2 w-full text-center">SF Crime Heatmap (2018-2025)</h1>
        <div className="flex w-full h-[calc(100vh-4rem)]">
          <Sidebar />
          <div className="flex-1 relative flex flex-col">
            <div className="flex-1 relative">
              <Suspense fallback={<Skeleton className="h-full w-full" />}>
                <Map />
              </Suspense>
              <div className="absolute bottom-4 left-4 right-4 z-[1000]">
                <TimeSlider />
              </div>
            </div>
            <div className="mt-4">
              <CrimeCharts />
            </div>
          </div>
        </div>
      </main>
    </TimeProvider>
  )
}

