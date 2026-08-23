import { createClient } from '@/lib/supabase/server'
import { Clock, MapPin } from 'lucide-react'

export const revalidate = 0

export default async function TimetablePage() {
  const supabase = await createClient()

  const { data: timetables } = await supabase
    .from('timetable')
    .select('*, programs(name)')

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Class Timetable</h1>
          <p className="mt-4 text-xl text-gray-600">
            Find the perfect time to learn. We offer flexible schedules across the week.
          </p>
        </div>

        <div className="space-y-12">
          {daysOfWeek.map(day => {
            const dayClasses = timetables?.filter(t => t.day_of_week === day).sort((a, b) => a.start_time.localeCompare(b.start_time)) || []
            
            if (dayClasses.length === 0) return null

            return (
              <div key={day} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="bg-red-700 px-6 py-4">
                  <h2 className="text-xl font-bold text-white">{day}</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {dayClasses.map(c => (
                    <div key={c.id} className="p-6 hover:bg-gray-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{c.class_name}</h3>
                        {c.programs && <p className="text-sm text-gray-500 mt-1">{c.programs.name}</p>}
                      </div>
                      <div className="flex flex-col sm:items-end space-y-2">
                        <div className="flex items-center text-gray-700 font-medium">
                          <Clock className="h-4 w-4 mr-2 text-red-500" />
                          {c.start_time} - {c.end_time}
                        </div>
                        {c.room && (
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {c.room}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
          
          {(!timetables || timetables.length === 0) && (
            <div className="text-center py-12 text-gray-500">
              Timetable is currently being updated.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
