import { createClient } from '@/lib/supabase/server'
import { BookOpen, Users, Calendar, ImageIcon, FileText, MessageSquare } from 'lucide-react'

// Basic UI component for the dashboard until we add shadcn/ui or similar
function StatCard({ title, value, icon: Icon }: { title: string, value: number | string, icon: any }) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100 flex items-center">
      <div className="p-3 rounded-full bg-red-100 text-red-600 mr-4">
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  )
}

export default async function AdminDashboard() {
  const supabase = await createClient()
  
  // Example count fetching
  const { count: programsCount } = await supabase.from('programs').select('*', { count: 'exact', head: true })
  const { count: teachersCount } = await supabase.from('teachers').select('*', { count: 'exact', head: true })
  const { count: eventsCount } = await supabase.from('events').select('*', { count: 'exact', head: true })
  const { count: galleryCount } = await supabase.from('gallery_images').select('*', { count: 'exact', head: true })
  const { count: newsCount } = await supabase.from('news_posts').select('*', { count: 'exact', head: true })
  const { count: registrationCount } = await supabase.from('registration_requests').select('*', { count: 'exact', head: true }).eq('status', 'new')
  const { count: contactCount } = await supabase.from('contact_messages').select('*', { count: 'exact', head: true }).eq('status', 'new')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-sm text-gray-500 mt-1">Welcome to the SinoBridge CMS</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Programs" value={programsCount || 0} icon={BookOpen} />
        <StatCard title="Teachers" value={teachersCount || 0} icon={Users} />
        <StatCard title="Upcoming Events" value={eventsCount || 0} icon={Calendar} />
        <StatCard title="Gallery Images" value={galleryCount || 0} icon={ImageIcon} />
        <StatCard title="News Articles" value={newsCount || 0} icon={FileText} />
        <StatCard title="New Registrations" value={registrationCount || 0} icon={MessageSquare} />
        <StatCard title="New Contacts" value={contactCount || 0} icon={MessageSquare} />
      </div>
    </div>
  )
}
