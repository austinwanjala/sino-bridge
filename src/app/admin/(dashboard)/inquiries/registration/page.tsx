import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export const revalidate = 0

export default async function RegistrationInquiriesPage() {
  const supabase = await createClient()

  const { data: requests } = await supabase
    .from('registration_requests')
    .select('*')
    .order('created_at', { ascending: false })

  async function updateStatus(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const status = formData.get('status') as string
    
    const sb = await createClient()
    await sb.from('registration_requests').update({ status }).eq('id', id)
    revalidatePath('/admin/inquiries/registration')
  }

  async function deleteRequest(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    
    const sb = await createClient()
    await sb.from('registration_requests').delete().eq('id', id)
    revalidatePath('/admin/inquiries/registration')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Registration Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Manage inquiries from prospective students.</p>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Applicant</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Program & Preferences</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests?.map((req) => (
              <tr key={req.id} className={req.status === 'new' ? 'bg-red-50/30' : ''}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{req.full_name}</div>
                  <div className="text-sm text-gray-500">{req.email}</div>
                  <div className="text-sm text-gray-500">{req.phone_number}</div>
                  {req.age && <div className="text-xs text-gray-400 mt-1">Age: {req.age}</div>}
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{req.program_interested}</div>
                  <div className="text-sm text-gray-500">Mode: {req.preferred_class || 'Any'}</div>
                  {req.preferred_schedule && <div className="text-sm text-gray-500">Sched: {req.preferred_schedule}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${req.status === 'new' ? 'bg-blue-100 text-blue-800' : 
                      req.status === 'contacted' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-gray-100 text-gray-800'}`}>
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex flex-col items-end space-y-2">
                    <form action={updateStatus} className="flex items-center space-x-2">
                      <input type="hidden" name="id" value={req.id} />
                      <select name="status" defaultValue={req.status} className="text-xs bg-white text-gray-900 border-gray-300 rounded">
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="resolved">Resolved</option>
                      </select>
                      <button type="submit" className="text-xs font-semibold text-white bg-gray-800 px-2 py-1 rounded border border-gray-800 hover:bg-gray-900 shadow-sm">Update</button>
                    </form>
                    <form action={deleteRequest}>
                      <input type="hidden" name="id" value={req.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900 text-xs">Delete</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!requests || requests.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No registration requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
