import { createClient } from '@/lib/supabase/server'

export const revalidate = 0

export default async function GalleryPage() {
  const supabase = await createClient()

  const { data: galleryItems } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('is_published', true)
    .order('display_order', { ascending: true })

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Photo Gallery</h1>
          <p className="mt-4 text-xl text-gray-600">
            A glimpse into our classrooms, cultural events, and community.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {galleryItems?.map((item) => (
            <div key={item.id} className="relative group overflow-hidden rounded-xl shadow-sm bg-white cursor-pointer aspect-w-1 aspect-h-1">
              <img src={item.image_url} alt={item.title || 'Gallery Image'} className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                {item.title && <h3 className="text-white font-bold text-lg leading-tight">{item.title}</h3>}
                {item.description && <p className="text-red-300 text-sm font-medium mt-1">{item.description}</p>}
              </div>
            </div>
          ))}

          {(!galleryItems || galleryItems.length === 0) && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Gallery is currently empty. Check back soon for photos!
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
