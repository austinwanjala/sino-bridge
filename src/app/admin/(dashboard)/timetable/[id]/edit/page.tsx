import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function EditTimetable(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  
  const [scheduleRes, programsRes] = await Promise.all([
    supabase.from('timetable').select('*').eq('id', params.id).single(),
    supabase.from('programs').select('id, name')
  ])

  const schedule = scheduleRes.data
  const programs = programsRes.data

  if (!schedule) {
    redirect('/admin/timetable')
  }

  async function updateSchedule(formData: FormData) {
    'use server'
    const sb = await createClient()

    const updatedSchedule = {
      program_id: formData.get('program_id') || null,
      class_name: formData.get('class_name'),
      day_of_week: formData.get('day_of_week'),
      start_time: formData.get('start_time'),
      end_time: formData.get('end_time'),
      room: formData.get('room'),
      teacher_id: formData.get('teacher_id') || null,
    }

    await sb.from('timetable').update(updatedSchedule).eq('id', params.id)

    revalidatePath('/admin/timetable')
    revalidatePath('/timetable')
    redirect('/admin/timetable')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Schedule</h1>
        <p className="text-sm text-gray-500 mt-1">Update class schedule.</p>
      </div>

      <form action={updateSchedule} className="bg-white shadow rounded-lg p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Class Name *</label>
            <input type="text" name="class_name" defaultValue={schedule.class_name} required placeholder="e.g. HSK 1 - Evening" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Link to Program</label>
            <select name="program_id" defaultValue={schedule.program_id || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">None (Independent Class)</option>
              {programs?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Day *</label>
            <select name="day_of_week" defaultValue={schedule.day_of_week} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              {['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Start Time *</label>
            <input type="time" name="start_time" defaultValue={schedule.start_time} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">End Time *</label>
            <input type="time" name="end_time" defaultValue={schedule.end_time} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Room / Format</label>
          <input type="text" name="room" defaultValue={schedule.room || ''} placeholder="e.g. Room 101 or Online (Zoom)" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3 border-t">
          <Link href="/admin/timetable" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
            Update Schedule
          </button>
        </div>
      </form>
    </div>
  )
}
