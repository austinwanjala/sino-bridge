import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default function NewEvent() {
  async function createEvent(formData: FormData) {
    'use server'
    const sb = await createClient()

    let slug = formData.get('slug') as string
    const title = formData.get('title') as string
    if (!slug && title) {
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }

    let final_image_url = formData.get('image_url') as string;
    const image_file = formData.get('image_file') as File | null;

    if (image_file && image_file.size > 0) {
      const fileName = `${Date.now()}-${image_file.name}`;
      const { data, error } = await sb.storage.from('gallery').upload(`public/${fileName}`, image_file);
      if (data) {
        const { data: urlData } = sb.storage.from('gallery').getPublicUrl(data.path);
        final_image_url = urlData.publicUrl;
      }
    }

    const newEvent = {
      title,
      slug,
      description: formData.get('description'),
      event_date: formData.get('event_date'),
      event_time: formData.get('event_time'),
      location: formData.get('location'),
      image_url: final_image_url,
      is_active: formData.get('is_active') === 'on',
    }

    await sb.from('events').insert(newEvent)

    revalidatePath('/admin/events')
    revalidatePath('/events')
    redirect('/admin/events')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Event</h1>
        <p className="text-sm text-gray-500 mt-1">Create an event for the school calendar.</p>
      </div>

      <form action={createEvent} className="bg-white shadow rounded-lg p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Event Title *</label>
            <input type="text" name="title" required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input type="text" name="slug" placeholder="e.g. spring-festival" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea name="description" rows={4} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md"></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Date *</label>
            <input type="date" name="event_date" required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Time</label>
            <input type="text" name="event_time" placeholder="e.g. 10:00 AM - 2:00 PM" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input type="text" name="location" placeholder="e.g. Main Campus, Room 101" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Cover Image</label>
          <input type="file" name="image_file" accept="image/*" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">OR Cover Image URL</label>
          <input type="url" name="image_url" placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
        </div>

        <div className="flex items-center pt-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Published (Visible on public website)
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3 border-t">
          <Link href="/admin/events" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
            Save Event
          </button>
        </div>
      </form>
    </div>
  )
}
