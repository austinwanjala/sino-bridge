import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { revalidatePath } from 'next/cache'

export default async function EditFee(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const supabase = await createClient()
  
  const [feeRes, programsRes] = await Promise.all([
    supabase.from('fees').select('*').eq('id', params.id).single(),
    supabase.from('programs').select('id, name')
  ])

  const fee = feeRes.data
  const programs = programsRes.data

  if (!fee) {
    redirect('/admin/fees')
  }

  async function updateFee(formData: FormData) {
    'use server'
    const sb = await createClient()

    const updatedFee = {
      program_id: formData.get('program_id') || null,
      title: formData.get('title'),
      amount: formData.get('amount'),
      billing_cycle: formData.get('billing_cycle'),
      description: formData.get('description'),
    }

    await sb.from('fees').update(updatedFee).eq('id', params.id)

    revalidatePath('/admin/fees')
    revalidatePath('/fees')
    redirect('/admin/fees')
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Fee Structure</h1>
        <p className="text-sm text-gray-500 mt-1">Update pricing tier or fee.</p>
      </div>

      <form action={updateFee} className="bg-white shadow rounded-lg p-6 space-y-4">
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Fee Title *</label>
            <input type="text" name="title" defaultValue={fee.title} required placeholder="e.g. Standard Tuition" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Link to Program</label>
            <select name="program_id" defaultValue={fee.program_id || ''} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md">
              <option value="">General Fee (Not program specific)</option>
              {programs?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Amount *</label>
            <input type="text" name="amount" defaultValue={fee.amount} required placeholder="e.g. $500 or ¥3500" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Billing Cycle</label>
            <input type="text" name="billing_cycle" defaultValue={fee.billing_cycle || ''} placeholder="e.g. Per Term, Monthly, One-time" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description / What's Included</label>
          <textarea name="description" defaultValue={fee.description || ''} rows={3} placeholder="Includes materials, textbooks, etc." className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"></textarea>
        </div>

        <div className="pt-4 flex items-center justify-end space-x-3 border-t">
          <Link href="/admin/fees" className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancel
          </Link>
          <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
            Update Fee
          </button>
        </div>
      </form>
    </div>
  )
}
