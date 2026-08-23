import Link from 'next/link'
import { Mail, Phone, MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export default async function Footer() {
  const supabase = await createClient()

  // Fetch settings for contact info
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  const contactInfo = {
    address: settings?.address || '123 Education Lane, Learning City, 10000',
    phone: settings?.phone || '+1 234 567 8900',
    email: settings?.email || 'hello@sinobridge.edu',
    school_name: settings?.school_name || 'SinoBridge Chinese School',
    whatsapp: settings?.whatsapp || '0757028379',
    instagram: settings?.instagram || 'antony_demba1',
    footer_description: settings?.footer_description || 'Discover Chinese language and culture through practical, engaging, and flexible learning programs designed for all ages.',
    copyright_text: settings?.copyright_text || `© ${new Date().getFullYear()} SinoBridge Chinese School. All rights reserved.`
  }

  return (
    <footer className="bg-gray-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="col-span-1 md:col-span-1">
            <Link href="/" className="text-2xl font-bold text-white tracking-tight">
              Sino<span className="text-red-500">Bridge</span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed">
              {contactInfo.footer_description}
            </p>
            <div className="flex mt-6 space-x-4">
              <a href={`https://wa.me/${contactInfo.whatsapp.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-500" title={`WhatsApp: ${contactInfo.whatsapp}`}>
                <span className="sr-only">WhatsApp</span>
                WhatsApp
              </a>
              <a href={`https://instagram.com/${contactInfo.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500" title={`Instagram: ${contactInfo.instagram}`}>
                <span className="sr-only">Instagram</span>
                IG
              </a>
              <a href="#" className="text-gray-400 hover:text-green-400 cursor-default" title="WeChat: ANTONYdemba003">
                <span className="sr-only">WeChat</span>
                WeChat
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">
              Quick Links
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/about" className="text-sm text-gray-400 hover:text-white">About Us</Link>
              </li>
              <li>
                <Link href="/classes" className="text-sm text-gray-400 hover:text-white">Our Programs</Link>
              </li>
              <li>
                <Link href="/timetable" className="text-sm text-gray-400 hover:text-white">Timetable</Link>
              </li>
              <li>
                <Link href="/teachers" className="text-sm text-gray-400 hover:text-white">Teachers</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">
              Resources
            </h3>
            <ul className="mt-4 space-y-3">
              <li>
                <Link href="/events" className="text-sm text-gray-400 hover:text-white">Events</Link>
              </li>
              <li>
                <Link href="/gallery" className="text-sm text-gray-400 hover:text-white">Gallery</Link>
              </li>
              <li>
                <Link href="/news" className="text-sm text-gray-400 hover:text-white">News</Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-gray-400 hover:text-white">Contact Us</Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wider uppercase text-gray-300">
              Contact
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start">
                <MapPin className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-400 whitespace-pre-line">{contactInfo.address}</span>
              </li>
              <li className="flex items-center">
                <Phone className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-400">{contactInfo.phone}</span>
              </li>
              <li className="flex items-center">
                <Mail className="flex-shrink-0 h-5 w-5 text-gray-400 mr-2" />
                <span className="text-sm text-gray-400">{contactInfo.email}</span>
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400">
            {contactInfo.copyright_text}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy" className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
