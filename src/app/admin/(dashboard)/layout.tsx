import Sidebar from '@/components/admin/Sidebar'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { count: newRegistrations } = await supabase
    .from('registration_requests')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')
    
  const { count: newContacts } = await supabase
    .from('contact_messages')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new')

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans overflow-hidden">
      <Sidebar 
        unreadRegistrations={newRegistrations || 0} 
        unreadContacts={newContacts || 0} 
      />
      <div className="flex-1 overflow-auto relative">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
