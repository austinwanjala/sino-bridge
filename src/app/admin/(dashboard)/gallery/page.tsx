import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function GalleryCMS() {
  const supabase = await createClient()

  const { data: galleryItems } = await supabase
    .from('gallery_images')
    .select('*')
    .order('created_at', { ascending: false })

  async function deleteImage(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const sb = await createClient()
    await sb.from('gallery_images').delete().eq('id', id)
    revalidatePath('/admin/gallery')
    revalidatePath('/gallery')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Photo Gallery</h1>
          <p className="text-sm text-gray-500 mt-1">Manage images displayed on the public gallery page.</p>
        </div>
        <Link 
          href="/admin/gallery/new" 
          className="inline-flex items-center bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Image
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleryItems?.map((item) => (
          <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden relative group">
            <div className="aspect-w-1 aspect-h-1 w-full bg-gray-200">
              <img src={item.image_url} alt={item.title || 'Gallery Image'} className="w-full h-48 object-cover" />
            </div>
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 truncate">{item.title || 'Untitled'}</h3>
              <p className="text-xs text-gray-500 truncate">{item.description || 'General'}</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <form action={deleteImage}>
                <input type="hidden" name="id" value={item.id} />
                <button type="submit" className="bg-white p-2 rounded-full shadow text-red-600 hover:text-red-900" title="Delete">
                  <Trash2 className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>

      {(!galleryItems || galleryItems.length === 0) && (
        <div className="bg-white shadow rounded-lg p-12 text-center text-gray-500">
          No images in the gallery yet. Click "Add Image" to get started.
        </div>
      )}
    </div>
  )
}
