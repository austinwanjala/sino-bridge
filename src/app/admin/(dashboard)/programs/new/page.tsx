import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default function NewProgram() {
  async function createProgram(formData: FormData) {
    'use server'
    const sb = await createClient()
    
    // Auto-generate slug from name if empty
    let slug = formData.get('slug') as string
    const name = formData.get('name') as string
    if (!slug && name) {
      slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }

    let final_image_url = formData.get('image_url') as string;
    const image_file = formData.get('image_file') as File | null;

    if (image_file && image_file.size > 0) {
      const fileName = `${Date.now()}-${image_file.name}`;
      const { data, error } = await sb.storage.from('programs').upload(`public/${fileName}`, image_file);
      if (data) {
        const { data: urlData } = sb.storage.from('programs').getPublicUrl(data.path);
        final_image_url = urlData.publicUrl;
      }
    }

    const newProgram = {
      name,
      slug,
      short_description: formData.get('short_description'),
      level: formData.get('level'),
      duration: formData.get('duration'),
      schedule: formData.get('schedule'),
      fee: formData.get('fee'),
      image_url: final_image_url,
      is_active: formData.get('is_active') === 'on',
    }

    await sb.from('programs').insert(newProgram)

    revalidatePath('/admin/programs')
    revalidatePath('/classes')
    redirect('/admin/programs')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Program</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new language class or program.</p>
      </div>

      <form action={createProgram} className="bg-white shadow rounded-lg p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Program Name *</label>
            <input type="text" name="name" required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input type="text" name="slug" placeholder="e.g. beginner-chinese" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            <p className="text-xs text-gray-400 mt-1">Leave blank to auto-generate from name</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Description</label>
          <textarea name="short_description" rows={3} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md"></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Level</label>
            <input type="text" name="level" placeholder="e.g. Beginner, HSK 1" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Duration</label>
            <input type="text" name="duration" placeholder="e.g. 12 Weeks" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Schedule</label>
            <input type="text" name="schedule" placeholder="e.g. Tue & Thu, 6PM - 8PM" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Fee</label>
            <input type="text" name="fee" placeholder="e.g. $500" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Program Image</label>
          <input type="file" name="image_file" accept="image/*" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">OR Image URL</label>
          <input type="url" name="image_url" placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
        </div>

        <div className="flex items-center pt-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked className="h-4 w-4 text-red-600 border border-gray-300 rounded focus:ring-red-500" />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Active (Visible on public website)
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3 border-t">
          <Link href="/admin/programs" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
            Save Program
          </button>
        </div>
      </form>
    </div>
  )
}
