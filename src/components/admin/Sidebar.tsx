'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  Home, 
  Layout, 
  Settings, 
  BookOpen, 
  Users, 
  Calendar, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  MessageSquare,
  Mail,
  LogOut,
  Navigation
} from 'lucide-react'
import { logout } from '@/app/admin/login/actions'

const menuGroups = [
  {
    title: 'WEBSITE',
    items: [
      { name: 'Homepage Sections', href: '/admin/homepage', icon: Layout },
      { name: 'Navigation', href: '/admin/navigation', icon: Navigation },
      { name: 'Site Settings', href: '/admin/settings', icon: Settings },
    ]
  },
  {
    title: 'CONTENT',
    items: [
      { name: 'Programs', href: '/admin/programs', icon: BookOpen },
      { name: 'Teachers', href: '/admin/teachers', icon: Users },
      { name: 'Timetable', href: '/admin/timetable', icon: Calendar },
      { name: 'Fees', href: '/admin/fees', icon: DollarSign },
      { name: 'Events', href: '/admin/events', icon: Calendar },
      { name: 'Gallery', href: '/admin/gallery', icon: ImageIcon },
      { name: 'News', href: '/admin/news', icon: FileText },
      { name: 'Testimonials', href: '/admin/testimonials', icon: MessageSquare },
    ]
  },
  {
    title: 'INQUIRIES',
    items: [
      { name: 'Registration Requests', href: '/admin/inquiries/registration', icon: FileText },
      { name: 'Contact Messages', href: '/admin/inquiries/contact', icon: Mail },
    ]
  }
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 bg-gray-900 text-white min-h-screen flex flex-col">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-red-500">SinoBridge</h1>
        <p className="text-xs text-gray-400 mt-1">Admin CMS</p>
      </div>

      <nav className="flex-1 px-4 space-y-6 overflow-y-auto">
        <div>
          <Link 
            href="/admin" 
            className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${pathname === '/admin' ? 'bg-gray-800 text-white' : 'text-gray-300 hover:bg-gray-800 hover:text-white'}`}
          >
            <Home className="mr-3 h-5 w-5" />
            Dashboard
          </Link>
        </div>

        {menuGroups.map((group, idx) => (
          <div key={idx}>
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
              {group.title}
            </h3>
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = pathname.startsWith(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-red-900/50 text-red-100'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-red-300' : 'text-gray-400'}`} />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-800">
        <Link href="/" target="_blank" className="flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md mb-2">
          <Layout className="mr-3 h-5 w-5 text-gray-400" />
          Preview Website
        </Link>
        <form action={logout}>
          <button type="submit" className="w-full flex items-center px-3 py-2 text-sm font-medium text-gray-300 hover:bg-gray-800 hover:text-white rounded-md">
            <LogOut className="mr-3 h-5 w-5 text-gray-400" />
            Sign Out
          </button>
        </form>
      </div>
    </div>
  )
}
