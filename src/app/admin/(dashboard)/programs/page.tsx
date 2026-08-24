import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { revalidatePath } from 'next/cache'

export default async function ProgramsCMS() {
  const supabase = await createClient()

  const { data: programs } = await supabase
    .from('programs')
    .select('*')
    .order('display_order', { ascending: true })

  async function deleteProgram(formData: FormData) {
    'use server'
    const id = formData.get('id') as string
    const sb = await createClient()
    await sb.from('programs').delete().eq('id', id)
    revalidatePath('/admin/programs')
    revalidatePath('/classes')
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Programs</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your language programs and classes.</p>
        </div>
        <Link 
          href="/admin/programs/new" 
          className="inline-flex items-center bg-red-700 text-white px-4 py-2 rounded-md hover:bg-red-800"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Program
        </Link>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {programs?.map((program) => (
              <tr key={program.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{program.name}</div>
                  <div className="text-sm text-gray-500">{program.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {program.level || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${program.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                    {program.is_active ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Link href={`/admin/programs/${program.id}/edit`} className="text-indigo-600 hover:text-indigo-900" title="Edit">
                      <Edit className="h-5 w-5" />
                    </Link>
                    <form action={deleteProgram}>
                      <input type="hidden" name="id" value={program.id} />
                      <button type="submit" className="text-red-600 hover:text-red-900" title="Delete">
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {(!programs || programs.length === 0) && (
              <tr>
                <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                  No programs found. Create one to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
