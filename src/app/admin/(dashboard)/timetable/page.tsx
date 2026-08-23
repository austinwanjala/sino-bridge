import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function TimetableCMS() {
  const supabase = await createClient()

  const { data: timetables } = await supabase
    .from('timetable')
    .select('*, programs(name)')
    .order('day_of_week', { ascending: true })

  async function deleteTimetable(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const sb = await createClient()
    await sb.from('timetable').delete().eq('id', id)
    revalidatePath('/admin/timetable')
    revalidatePath('/timetable')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Timetable</h1>
          <p className="text-sm text-gray-500 mt-1">Manage class schedules.</p>
        </div>
        <Link 
          href="/admin/timetable/new" 
          className="inline-flex items-center bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Schedule
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class/Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room/Format</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {timetables?.map((t) => (
              <tr key={t.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{t.class_name}</div>
                  {t.programs && <div className="text-xs text-gray-500">{t.programs.name}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{t.day_of_week}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{t.start_time} - {t.end_time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {t.room || 'TBA'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <form action={deleteTimetable}>
                      <input type="hidden" name="id" value={t.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!timetables || timetables.length === 0) && (
              <tr>
                <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No schedules found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
