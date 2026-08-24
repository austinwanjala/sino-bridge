import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function TestimonialsCMS() {
  const supabase = await createClient()

  const { data: testimonials } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true })

  async function deleteTestimonial(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const sb = await createClient()
    await sb.from('testimonials').delete().eq('id', id)
    revalidatePath('/admin/testimonials')
    revalidatePath('/testimonials')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Testimonials</h1>
          <p className="text-sm text-gray-500 mt-1">Manage student success stories and reviews.</p>
        </div>
        <Link 
          href="/admin/testimonials/new" 
          className="inline-flex items-center bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Testimonial
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Review</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {testimonials?.map((t) => (
              <tr key={t.id}>
                <td className="px-6 py-4 whitespace-nowrap flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    {t.photo_url ? (
                      <img className="h-10 w-10 rounded-full object-cover" src={t.photo_url} alt="" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {t.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.program || '-'}</div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-500 line-clamp-2">{t.message}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${t.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {t.is_active ? 'Active' : 'Hidden'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={`/admin/testimonials/${t.id}/edit`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <Edit className="h-5 w-5" />
                    </Link>
                    <form action={deleteTestimonial}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!testimonials || testimonials.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No testimonials found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
