import Sidebar from '@/components/admin/Sidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto relative">
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  )
}
