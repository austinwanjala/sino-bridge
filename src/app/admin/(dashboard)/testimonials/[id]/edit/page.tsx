import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function EditTestimonial(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: testimonial } = await supabase.from('testimonials').select('*').eq('id', params.id).single()

  if (!testimonial) {
    redirect('/admin/testimonials')
  }

  async function updateTestimonial(formData: FormData) {
    'use server'
    const sb = await createClient()

    let final_image_url = formData.get('photo_url') as string;
    const image_file = formData.get('image_file') as File | null;

    if (image_file && image_file.size > 0) {
      const fileName = `${Date.now()}-${image_file.name}`;
      const { data, error } = await sb.storage.from('testimonials').upload(`public/${fileName}`, image_file);
      if (data) {
        const { data: urlData } = sb.storage.from('testimonials').getPublicUrl(data.path);
        final_image_url = urlData.publicUrl;
      }
    }

    const updatedTestimonial = {
      name: formData.get('name'),
      program: formData.get('program'),
      message: formData.get('message'),
      rating: parseInt(formData.get('rating') as string) || 5,
      is_active: formData.get('is_active') === 'on',
    } as any

    if (final_image_url) {
      updatedTestimonial.photo_url = final_image_url
    }

    await sb.from('testimonials').update(updatedTestimonial).eq('id', params.id)

    revalidatePath('/admin/testimonials')
    revalidatePath('/testimonials')
    redirect('/admin/testimonials')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Testimonial</h1>
        <p className="text-sm text-gray-500 mt-1">Update a review or success story.</p>
      </div>

      <form action={updateTestimonial} className="bg-white shadow rounded-lg p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Student Name *</label>
            <input type="text" name="name" defaultValue={testimonial.name} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Program Taken</label>
            <input type="text" name="program" defaultValue={testimonial.program || ''} placeholder="e.g. HSK 2 Preparation" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Review / Testimonial *</label>
          <textarea name="message" defaultValue={testimonial.message} rows={4} required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload New Student Photo (Optional)</label>
          <input type="file" name="image_file" accept="image/*" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">OR Photo URL</label>
            <input type="url" name="photo_url" defaultValue={testimonial.photo_url || ''} placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Rating (1-5)</label>
            <input type="number" name="rating" min="1" max="5" defaultValue={testimonial.rating || 5} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="flex items-center pt-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked={testimonial.is_active} className="h-4 w-4 text-red-600 border border-gray-300 rounded focus:ring-red-500" />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Active (Visible on public website)
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3 border-t">
          <Link href="/admin/testimonials" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
            Update Testimonial
          </button>
        </div>
      </form>
    </div>
  )
}
