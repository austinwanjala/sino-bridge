import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default function NewNewsArticle() {
  async function createArticle(formData: FormData) {
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
      const { data, error } = await sb.storage.from('news').upload(`public/${fileName}`, image_file);
      if (data) {
        const { data: urlData } = sb.storage.from('news').getPublicUrl(data.path);
        final_image_url = urlData.publicUrl;
      }
    }

    const newArticle = {
      title,
      slug,
      excerpt: formData.get('summary'),
      content: formData.get('content'),
      featured_image_url: final_image_url,
      published_at: formData.get('published_at') || new Date().toISOString(),
      status: formData.get('is_published') === 'on' ? 'published' : 'draft',
    }

    await sb.from('news_posts').insert(newArticle)

    revalidatePath('/admin/news')
    revalidatePath('/news')
    redirect('/admin/news')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Add Article</h1>
        <p className="text-sm text-gray-500 mt-1">Publish an announcement or news post.</p>
      </div>

      <form action={createArticle} className="bg-white shadow rounded-lg p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title *</label>
            <input type="text" name="title" required className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input type="text" name="slug" placeholder="e.g. spring-semester-opening" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Short Summary</label>
          <textarea name="summary" rows={2} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Full Content</label>
          <textarea name="content" rows={10} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md font-mono text-sm"></textarea>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Upload Cover Image</label>
          <input type="file" name="image_file" accept="image/*" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">OR Image URL</label>
            <input type="url" name="image_url" placeholder="https://..." className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Publish Date</label>
            <input type="date" name="published_at" defaultValue={new Date().toISOString().split('T')[0]} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div className="flex items-center pt-2">
          <input type="checkbox" name="is_published" id="is_published" defaultChecked className="h-4 w-4 text-red-600 border-gray-300 rounded focus:ring-red-500" />
          <label htmlFor="is_published" className="ml-2 block text-sm text-gray-900">
            Publish Immediately (Visible on public website)
          </label>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3 border-t">
          <Link href="/admin/news" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
            Save Article
          </button>
        </div>
      </form>
    </div>
  )
}
