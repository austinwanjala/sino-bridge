import { createClient } from '@/lib/supabase/server'
import { Calendar, Clock, MapPin } from 'lucide-react'

export const revalidate = 0

export default async function EventsPage() {
  const supabase = await createClient()

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('event_date', { ascending: true }) // Upcoming events first

  // Separate into upcoming and past (simplistic approach for demo)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  const upcomingEvents = events?.filter(e => new Date(e.event_date) >= today) || []
  const pastEvents = events?.filter(e => new Date(e.event_date) < today) || []

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Events & Activities</h1>
          <p className="mt-4 text-xl text-gray-600">
            Join our cultural workshops, festival celebrations, and community gatherings.
          </p>
        </div>

        {upcomingEvents.length > 0 && (
          <div className="mb-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4">Upcoming Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                  {event.image_url ? (
                    <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-red-50 flex items-center justify-center">
                      <Calendar className="h-12 w-12 text-red-200" />
                    </div>
                  )}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{event.title}</h3>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="h-4 w-4 mr-2 text-red-500" />
                        <span>{new Date(event.event_date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                      </div>
                      {event.event_time && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2 text-red-500" />
                          <span>{event.event_time}</span>
                        </div>
                      )}
                      {event.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 text-red-500" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm flex-1">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {pastEvents.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b pb-4 opacity-70">Past Events</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event) => (
                <div key={event.id} className="bg-gray-100/50 rounded-xl border border-gray-200 overflow-hidden flex flex-col opacity-75">
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-700 mb-2">{event.title}</h3>
                    <div className="text-sm text-gray-500 mb-3">
                      {new Date(event.event_date).toLocaleDateString()}
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-3">{event.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {upcomingEvents.length === 0 && pastEvents.length === 0 && (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
            <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No events scheduled</h3>
            <p className="text-gray-500 mt-2">Check back later for upcoming cultural activities and workshops.</p>
          </div>
        )}
      </div>
    </div>
  )
}
