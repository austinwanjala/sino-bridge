import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function FeesCMS() {
  const supabase = await createClient()

  const { data: fees } = await supabase
    .from('fees')
    .select('*, programs(name)')
    .order('display_order', { ascending: true })

  async function deleteFee(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const sb = await createClient()
    await sb.from('fees').delete().eq('id', id)
    revalidatePath('/admin/fees')
    revalidatePath('/fees')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tuition & Fees</h1>
          <p className="text-sm text-gray-500 mt-1">Manage pricing for programs and services.</p>
        </div>
        <Link 
          href="/admin/fees/new" 
          className="inline-flex items-center bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Fee Structure
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title / Program</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Billing Cycle</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {fees?.map((fee) => (
              <tr key={fee.id}>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{fee.title}</div>
                  {fee.programs && <div className="text-xs text-gray-500">{fee.programs.name}</div>}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">{fee.amount}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {fee.billing_cycle || 'One-time'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={`/admin/fees/${fee.id}/edit`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <Edit className="h-5 w-5" />
                    </Link>
                    <form action={deleteFee}>
                      <input type="hidden" name="id" value={fee.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!fees || fees.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No fees found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
