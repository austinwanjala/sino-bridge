import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function EditGalleryImage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  const { data: image } = await supabase.from('gallery_images').select('*').eq('id', params.id).single()

  if (!image) {
    redirect('/admin/gallery')
  }

  async function updateImage(formData: FormData) {
    'use server'
    const sb = await createClient()

    let final_image_url = formData.get('image_url') as string;
    const image_file = formData.get('image_file') as File | null;
    
    if (image_file && image_file.size > 0) {
      const fileName = `${Date.now()}-${image_file.name}`;
      
      const buffer = Buffer.from(await image_file.arrayBuffer());
      const { data, error } = await sb.storage.from('gallery').upload(`public/${fileName}`, buffer, {
        contentType: image_file.type
      });
      if (data) {
        const { data: urlData } = sb.storage.from('gallery').getPublicUrl(data.path);
        final_image_url = urlData.publicUrl;
      }
    }

    const updatedImage = {
      title: formData.get('title'),
      description: formData.get('description'),
      display_order: parseInt(formData.get('display_order') as string) || 0,
      is_published: formData.get('is_active') === 'on',
    } as any

    if (final_image_url) {
      updatedImage.image_url = final_image_url
    }

    await sb.from('gallery_images').update(updatedImage).eq('id', params.id)

    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
    redirect('/admin/gallery')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Gallery Image</h1>
        <p className="text-sm text-gray-500 mt-1">Update a photo in the public gallery.</p>
      </div>

      <form action={updateImage} className="bg-white shadow rounded-lg p-6 space-y-4">
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Upload New Image File (Optional)</label>
          <input type="file" name="image_file" accept="image/*" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">OR Image URL</label>
          <input type="url" name="image_url" defaultValue={image.image_url || ''} placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          <p className="text-xs text-gray-500 mt-1">Direct link to the image if not uploading.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title / Caption</label>
            <input type="text" name="title" defaultValue={image.title || ''} placeholder="e.g. Calligraphy Workshop" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Description / Category</label>
            <input type="text" name="description" defaultValue={image.description || ''} placeholder="e.g. Events, Campus, Students" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Display Order</label>
          <input type="number" name="display_order" defaultValue={image.display_order || 0} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
        </div>

        <div className="flex items-center pt-2">
          <input type="checkbox" name="is_active" id="is_active" defaultChecked={image.is_published} className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
          <label htmlFor="is_active" className="ml-2 block text-sm text-gray-900">
            Visible on public website
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3 border-t">
          <Link href="/admin/gallery" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
            Update Image
          </button>
        </div>
      </form>
    </div>
  )
}
