import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default function NewTeacher() {
  async function createTeacher(formData: FormData) {
    'use server'
    const sb = await createClient()

    let final_image_url = formData.get('profile_photo_url') as string;
    const image_file = formData.get('image_file') as File | null;

    if (image_file && image_file.size > 0) {
      const fileName = `${Date.now()}-${image_file.name}`;
      const { data, error } = await sb.storage.from('teachers').upload(`public/${fileName}`, image_file);
      if (data) {
        const { data: urlData } = sb.storage.from('teachers').getPublicUrl(data.path);
        final_image_url = urlData.publicUrl;
      }
    }

    const newTeacher = {
      full_name: formData.get('full_name'),
      position: formData.get('position'),
      short_bio: formData.get('short_bio'),
      qualifications: formData.get('qualifications'),
      specialization: formData.get('specialization'),
      profile_photo_url: final_image_url,
      is_active: formData.get('is_active') === 'on',
    }

    await sb.from('teachers').insert(newTeacher)

    revalidatePath('/admin/teachers')
    revalidatePath('/teachers')
    redirect('/admin/teachers')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add New Teacher</h1>
        <p className="text-sm text-gray-500 mt-1">Create a new staff profile.</p>
      </div>

      <form action={createTeacher} className="bg-white shadow rounded-lg p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name *</label>
            <input type="text" name="full_name" required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Position</label>
            <input type="text" name="position" placeholder="e.g. Senior Instructor" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Biography</label>
          <textarea name="short_bio" rows={4} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md"></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Qualifications</label>
            <input type="text" name="qualifications" placeholder="e.g. BA in Teaching Chinese" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Specialization</label>
            <input type="text" name="specialization" placeholder="e.g. HSK Preparation, Kids" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Profile Photo</label>
          <input type="file" name="image_file" accept="image/*" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">OR Photo URL</label>
          <input type="url" name="profile_photo_url" placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          <p className="text-xs text-gray-500 mt-1">Direct link to the image if not uploading.</p>
        </div>

        <div className="flex items-center pt-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Active (Visible on public website)
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3 border-t">
          <Link href="/admin/teachers" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
            Save Teacher
          </button>
        </div>
      </form>
    </div>
  )
}
