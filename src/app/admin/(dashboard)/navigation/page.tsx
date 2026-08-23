import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export const revalidate = 0

export default async function NavigationPage() {
  const supabase = await createClient()

  const { data: navItems } = await supabase
    .from('navigation_items')
    .select('*')
    .order('display_order', { ascending: true })

  async function addNavItem(formData: FormData) {
    'use server'
    const title = formData.get('title') as string
    const url = formData.get('url') as string
    const display_order = parseInt(formData.get('display_order') as string) || 0

    if (title && url) {
      const sb = await createClient()
      await sb.from('navigation_items').insert({ title, url, display_order, is_visible: true })
      revalidatePath('/')
      revalidatePath('/admin/navigation')
    }
  }

  async function deleteNavItem(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    if (id) {
      const sb = await createClient()
      await sb.from('navigation_items').delete().eq('id', id)
      revalidatePath('/')
      revalidatePath('/admin/navigation')
    }
  }

  async function toggleVisibility(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const current_visible = formData.get('current_visible') === 'true'
    
    if (id) {
      const sb = await createClient()
      await sb.from('navigation_items').update({ is_visible: !current_visible }).eq('id', id)
      revalidatePath('/')
      revalidatePath('/admin/navigation')
    }
  }

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Navigation Menu</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the primary navigation links shown on the public website.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* List of current items */}
        <div className="lg:col-span-2 bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {navItems?.map((item) => (
                <tr key={item.id} className={!item.is_visible ? 'bg-gray-50 opacity-60' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{item.title}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.url}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{item.display_order}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <form action={toggleVisibility}>
                        <input type="hidden" name="id" value={item.id} />
                        <input type="hidden" name="current_visible" value={String(item.is_visible)} />
                        <button type="submit" className="text-gray-600 hover:text-gray-900">
                          {item.is_visible ? 'Hide' : 'Show'}
                        </button>
                      </form>
                      <form action={deleteNavItem}>
                        <input type="hidden" name="id" value={item.id} />
                        <button type="submit" className="text-red-600 hover:text-red-900">Delete</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {(!navItems || navItems.length === 0) && (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                    No navigation items found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Add new item form */}
        <div className="bg-white shadow rounded-lg p-6 h-fit">
          <h2 className="text-lg font-medium text-gray-900 mb-4 border-b pb-2">Add New Link</h2>
          <form action={addNavItem} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Link Title</label>
              <input type="text" name="title" required placeholder="e.g. Programs" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">URL path</label>
              <input type="text" name="url" required placeholder="e.g. /classes" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Display Order</label>
              <input type="number" name="display_order" defaultValue="0" className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            </div>
            <button type="submit" className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
              Add Link
            </button>
          </form>
        </div>

      </div>
    </div>
  )
}
