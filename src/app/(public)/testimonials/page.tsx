import { createClient } from '@/lib/supabase/server'
import { Star } from 'lucide-react'

export const revalidate = 0

export default async function TestimonialsPage() {
  const supabase = await createClient()

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Student Success Stories</h1>
          <p className="mt-4 text-xl text-gray-600">
            Hear from our students about their journey learning Chinese with SinoBridge.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials?.map((t) => (
            <div key={t.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 flex flex-col h-full">
              <div className="flex text-yellow-400 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`h-5 w-5 ${i < (t.rating || 5) ? 'fill-current' : 'text-gray-200'}`} />
                ))}
              </div>
              <p className="text-gray-700 italic flex-1 leading-relaxed">"{t.content}"</p>
              <div className="mt-8 flex items-center">
                {t.image_url ? (
                  <img src={t.image_url} alt={t.student_name} className="h-12 w-12 rounded-full object-cover mr-4 border-2 border-red-100" />
                ) : (
                  <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-bold mr-4">
                    {t.student_name.charAt(0)}
                  </div>
                )}
                <div>
                  <h4 className="font-bold text-gray-900">{t.student_name}</h4>
                  {t.program_taken && <p className="text-sm text-red-600 font-medium">{t.program_taken}</p>}
                </div>
              </div>
            </div>
          ))}

          {(!testimonials || testimonials.length === 0) && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Testimonials are currently being collected.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
