import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export const revalidate = 0

export default async function ContactInquiriesPage() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('contact_messages')
    .select('*')
    .order('created_at', { ascending: false })

  async function updateStatus(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const status = formData.get('status') as string
    
    const sb = await createClient()
    await sb.from('contact_messages').update({ status }).eq('id', id)
    revalidatePath('/admin/inquiries/contact')
  }

  async function deleteMessage(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    
    const sb = await createClient()
    await sb.from('contact_messages').delete().eq('id', id)
    revalidatePath('/admin/inquiries/contact')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
        <p className="text-sm text-gray-500 mt-1">Manage general inquiries from the public website.</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sender</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {messages?.map((msg) => (
              <tr key={msg.id} className={msg.status === 'new' ? 'bg-red-50/30' : ''}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{msg.name}</div>
                  <div className="text-sm text-gray-500">{msg.email}</div>
                  <div className="text-sm text-gray-500">{msg.phone || 'No phone'}</div>
                  <div className="text-xs text-gray-400 mt-1">{new Date(msg.created_at).toLocaleString()}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900 mb-1">{msg.subject || 'General Inquiry'}</div>
                  <div className="text-sm text-gray-600 line-clamp-3">{msg.message}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${msg.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                      msg.status === 'read' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {msg.status.charAt(0).toUpperCase() + msg.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex flex-col items-end space-y-2">
                    <form action={updateStatus} className="flex items-center space-x-2">
                      <input type="hidden" name="id" value={msg.id} />
                      <select name="status" defaultValue={msg.status} className="text-xs bg-white text-gray-900 border-gray-300 rounded">
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                      </select>
                      <button type="submit" className="text-xs font-semibold text-white bg-gray-800 px-2 py-1 rounded border border-gray-800 hover:bg-gray-900 shadow-sm">Update</button>
                    </form>
                    <form action={deleteMessage}>
                      <input type="hidden" name="id" value={msg.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900 text-xs">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!messages || messages.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No contact messages found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
