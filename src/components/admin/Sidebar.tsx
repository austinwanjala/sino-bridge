'use client'

import { useState, useEffect } from 'react'
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
  Navigation,
  Menu,
  X
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

export default function Sidebar({ 
  unreadRegistrations = 0, 
  unreadContacts = 0 
}: { 
  unreadRegistrations?: number, 
  unreadContacts?: number 
}) {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  // Close sidebar on route change on mobile
  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  const getBadgeCount = (name: string) => {
    if (name === 'Registration Requests') return unreadRegistrations;
    if (name === 'Contact Messages') return unreadContacts;
    return 0;
  }

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between bg-gray-900 text-white p-4 shadow-md z-30">
        <div className="flex items-center">
          <img src="/logo.png" alt="SinoBridge Logo" className="h-8 w-auto mr-2" />
          <span className="text-xs text-gray-400">Admin CMS</span>
        </div>
        <button 
          onClick={() => setIsOpen(true)}
          className="p-2 -mr-2 rounded-md hover:bg-gray-800 text-gray-300 hover:text-white focus:outline-none"
        >
          <div className="relative">
            <Menu className="h-6 w-6" />
            {(unreadRegistrations + unreadContacts) > 0 && (
              <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-500 ring-2 ring-gray-900" />
            )}
          </div>
        </button>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 md:hidden transition-opacity" 
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col transform transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div>
            <img src="/logo.png" alt="SinoBridge Logo" className="h-10 w-auto" />
            <p className="text-xs text-gray-400 mt-2">Admin CMS</p>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="md:hidden p-2 -mr-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-6 overflow-y-auto custom-scrollbar">
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
                const badgeCount = getBadgeCount(item.name)
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${
                      isActive
                        ? 'bg-red-900/50 text-red-100'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center">
                      <item.icon className={`mr-3 h-5 w-5 ${isActive ? 'text-red-300' : 'text-gray-400'}`} />
                      {item.name}
                    </div>
                    {badgeCount > 0 && (
                      <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {badgeCount}
                      </span>
                    )}
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
    </>
  )
}
