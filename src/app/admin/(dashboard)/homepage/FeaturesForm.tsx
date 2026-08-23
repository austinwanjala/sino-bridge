'use client'

import { useTransition } from 'react'

export default function FeaturesForm({ initialData, action }: { initialData: any, action: (formData: FormData) => void }) {
  const [isPending, startTransition] = useTransition()

  return (
    <form action={(formData) => startTransition(() => action(formData))} className="space-y-6">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Tagline</label>
          <input type="text" name="tagline" defaultValue={initialData?.tagline || 'Why SinoBridge?'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Section Heading</label>
          <input type="text" name="heading" defaultValue={initialData?.heading || 'Excellence in Chinese Education'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Section Description</label>
        <textarea name="description" rows={2} defaultValue={initialData?.description || 'We blend traditional cultural immersion with modern teaching methodologies to provide the best learning experience.'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"></textarea>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Feature 1</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Feature 1 Title</label>
            <input type="text" name="f1_title" defaultValue={initialData?.f1_title || 'Expert Instructors'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Feature 1 Description</label>
            <textarea name="f1_desc" rows={2} defaultValue={initialData?.f1_desc || 'Our teachers are native speakers with extensive experience and formal qualifications in teaching Chinese as a second language.'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"></textarea>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Feature 2</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Feature 2 Title</label>
            <input type="text" name="f2_title" defaultValue={initialData?.f2_title || 'Cultural Immersion'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Feature 2 Description</label>
            <textarea name="f2_desc" rows={2} defaultValue={initialData?.f2_desc || 'Language cannot be separated from culture. We host regular cultural events, workshops, and traditional festivals.'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"></textarea>
          </div>
        </div>
      </div>

      <div className="border-t pt-6 mt-6">
        <h3 className="text-md font-semibold text-gray-900 mb-4">Feature 3</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Feature 3 Title</label>
            <input type="text" name="f3_title" defaultValue={initialData?.f3_title || 'Proven Curriculum'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Feature 3 Description</label>
            <textarea name="f3_desc" rows={2} defaultValue={initialData?.f3_desc || 'Our structured curriculum is aligned with HSK standards, ensuring measurable progress and recognized qualifications.'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"></textarea>
          </div>
        </div>
      </div>

      <div className="pt-4 flex justify-end">
        <button type="submit" disabled={isPending} className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800 disabled:opacity-50">
          {isPending ? 'Saving...' : 'Save Features Section'}
        </button>
      </div>
    </form>
  )
}
