'use client'

import { useTransition } from 'react'

export default function CTAForm({ initialData, action }: { initialData: any, action: (formData: FormData) => void }) {
  const [isPending, startTransition] = useTransition()

  return (
    <form action={(formData) => startTransition(() => action(formData))} className="space-y-6">
      
      <div>
        <label className="block text-sm font-medium text-gray-700">CTA Heading</label>
        <input type="text" name="heading" defaultValue={initialData?.heading || 'Ready to start your journey?'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">CTA Description</label>
        <textarea name="description" rows={2} defaultValue={initialData?.description || 'Join hundreds of students discovering the beauty of the Chinese language. Registration for the upcoming semester is now open.'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Text</label>
          <input type="text" name="btn_text" defaultValue={initialData?.btn_text || 'Enroll Today'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Button Link</label>
          <input type="text" name="btn_link" defaultValue={initialData?.btn_link || '/register'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isPending} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save CTA Section'}
        </button>
      </div>
    </form>
  )
}
