import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Clock, Calendar, GraduationCap, DollarSign } from 'lucide-react'

export const revalidate = 0

export default async function ClassesPage() {
  const supabase = await createClient()

  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Our Chinese Programs</h1>
          <p className="mt-4 text-xl text-gray-600">
            Find the perfect Chinese language course tailored to your goals and skill level.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {programs?.map((program) => (
            <div key={program.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow">
              {program.image_url ? (
                <div className="h-48 w-full bg-gray-200">
                  <img src={program.image_url} alt={program.name} className="w-full h-full object-cover" />
                </div>
              ) : (
                <div className="h-48 w-full bg-red-50 flex items-center justify-center">
                  <span className="text-red-200 text-5xl font-bold font-serif opacity-50">中文</span>
                </div>
              )}
              
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900 mb-2">{program.name}</h3>
                <p className="text-gray-600 text-sm mb-6 flex-1">{program.short_description}</p>
                
                <div className="space-y-3 mb-6">
                  {program.level && (
                    <div className="flex items-center text-sm text-gray-500">
                      <GraduationCap className="h-4 w-4 mr-2 text-red-500" />
                      <span>Level: {program.level}</span>
                    </div>
                  )}
                  {program.duration && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2 text-red-500" />
                      <span>Duration: {program.duration}</span>
                    </div>
                  )}
                  {program.schedule && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2 text-red-500" />
                      <span>{program.schedule}</span>
                    </div>
                  )}
                  {program.fee && (
                    <div className="flex items-center text-sm text-gray-500">
                      <DollarSign className="h-4 w-4 mr-2 text-red-500" />
                      <span>Fee: {program.fee}</span>
                    </div>
                  )}
                </div>
                
                <Link
                  href={program.cta_link || '/register'}
                  className="block w-full text-center bg-red-50 text-red-700 hover:bg-red-100 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {program.cta_text || 'Register Now'}
                </Link>
              </div>
            </div>
          ))}
          
          {(!programs || programs.length === 0) && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No programs are currently available. Please check back later.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
