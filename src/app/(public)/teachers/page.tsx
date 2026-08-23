import { createClient } from '@/lib/supabase/server'

export const revalidate = 0

export default async function TeachersPage() {
  const supabase = await createClient()

  const { data: teachers } = await supabase
    .from('teachers')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Our Dedicated Teachers</h1>
          <p className="mt-4 text-xl text-gray-600">
            Learn from experienced, passionate, and certified Chinese language instructors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {teachers?.map((teacher) => (
            <div key={teacher.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden text-center hover:shadow-md transition-shadow">
              <div className="pt-8 pb-6 px-6">
                {teacher.profile_photo_url ? (
                  <img src={teacher.profile_photo_url} alt={teacher.full_name} className="w-32 h-32 mx-auto rounded-full object-cover border-4 border-gray-50 shadow-sm" />
                ) : (
                  <div className="w-32 h-32 mx-auto rounded-full bg-red-100 border-4 border-white shadow-sm flex items-center justify-center text-red-700 text-4xl font-bold">
                    {teacher.full_name.charAt(0)}
                  </div>
                )}
                
                <h3 className="mt-6 text-xl font-bold text-gray-900">{teacher.full_name}</h3>
                <p className="text-red-600 font-medium text-sm mt-1">{teacher.position}</p>
                
                <div className="mt-4 mb-6">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                    {teacher.short_bio}
                  </p>
                </div>
                
                {(teacher.qualifications || teacher.specialization) && (
                  <div className="border-t border-gray-100 pt-4 mt-auto text-left">
                    {teacher.qualifications && (
                      <p className="text-xs text-gray-500 mb-2">
                        <span className="font-semibold text-gray-700">Credentials:</span> {teacher.qualifications}
                      </p>
                    )}
                    {teacher.specialization && (
                      <p className="text-xs text-gray-500">
                        <span className="font-semibold text-gray-700">Specializes in:</span> {teacher.specialization}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {(!teachers || teachers.length === 0) && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Teacher profiles are currently being updated.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
