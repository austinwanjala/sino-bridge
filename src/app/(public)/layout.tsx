import Navbar from '@/components/public/Navbar'
import Footer from '@/components/public/Footer'

import { createClient } from '@/lib/supabase/server'
import { MessageCircle } from 'lucide-react'

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: settings } = await supabase
    .from('site_settings')
    .select('whatsapp')
    .single()

  const rawNumber = settings?.whatsapp || '0757028379'
  // Remove spaces, dashes, etc.
  let waNumber = rawNumber.replace(/[^0-9]/g, '')
  // If it starts with a single 0 (like Kenyan local format), format as international (optional, but 254 is safest if we assume Kenya)
  if (waNumber.startsWith('0') && waNumber.length === 10) {
    waNumber = '254' + waNumber.substring(1)
  }

  return (
    <div className="min-h-screen flex flex-col font-sans relative">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />

      {/* WhatsApp Floating Button */}
      <a 
        href={`https://wa.me/${waNumber}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-lg shadow-green-500/30 transition-all hover:scale-110 hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300 animate-bounce"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-white"></span>
        </span>
      </a>
    </div>
  )
}
