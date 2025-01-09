'use client'

import { useIncidents } from '@/hooks/useIncidents'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Sidebar() {
     const [isCollapsed, setIsCollapsed] = useState(false)
     const { data: incidents, isLoading, error } = useIncidents()

     if (isLoading) return <div>Loading...</div>
     if (error) return <div>Error: {error.message}</div>

     const totalIncidents = incidents.length
     const categoryCounts = incidents.reduce((acc, incident) => {
       acc[incident.incident_category] = (acc[incident.incident_category] || 0) + 1
       return acc
     }, {} as Record<string, number>)

     const topCategories = Object.entries(categoryCounts)
       .sort((a, b) => b[1] - a[1])
       .slice(0, 5)

     return (
       <div className={`bg-background border-r transition-all duration-300 ease-in-out ${isCollapsed ? 'w-12' : 'w-64'}`}>
         <Button
           variant="ghost"
           size="icon"
           className="absolute top-2 -right-4 z-10"
           onClick={() => setIsCollapsed(!isCollapsed)}
         >
           {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
         </Button>
         {!isCollapsed && (
           <div className="p-4">
             <h2 className="text-xl font-bold mb-4">Statistics</h2>
             <Card className="mb-4">
               <CardHeader>
                 <CardTitle>Total Incidents</CardTitle>
               </CardHeader>
               <CardContent>
                 <p className="text-2xl font-bold">{totalIncidents}</p>
               </CardContent>
             </Card>
             <Card>
               <CardHeader>
                 <CardTitle>Top 5 Categories</CardTitle>
               </CardHeader>
               <CardContent>
                 <ul>
                   {topCategories.map(([category, count]) => (
                     <li key={category} className="mb-2">
                       <span className="font-semibold">{category}:</span> {count}
                     </li>
                   ))}
                 </ul>
               </CardContent>
             </Card>
           </div>
         )}
       </div>
     )
   }

