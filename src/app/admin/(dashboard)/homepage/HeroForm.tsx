'use client'

import { useState, useTransition } from 'react'
import { createClient } from '@/lib/supabase/client'

export default function HeroForm({ initialData, action }: { initialData: any, action: any }) {
  const [isPending, startTransition] = useTransition()
  const [errorMsg, setErrorMsg] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  
  // Keep track of the URL input to clear it when a file is selected
  const [imageUrl, setImageUrl] = useState(initialData.image_url || '')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrorMsg('')
    const form = e.currentTarget
    const formData = new FormData(form)
    
    const image_file = formData.get('image_file') as File | null
    let final_url = formData.get('image_url') as string

    if (image_file && image_file.size > 0) {
      setIsUploading(true)
      const supabase = createClient()
      const fileName = `${Date.now()}-${image_file.name}`
      
      const { data, error } = await supabase.storage.from('gallery').upload(`public/${fileName}`, image_file)
      
      setIsUploading(false)

      if (error) {
        setErrorMsg(`Upload failed: ${error.message}`)
        return
      }

      if (data) {
        const { data: urlData } = supabase.storage.from('gallery').getPublicUrl(data.path)
        final_url = urlData.publicUrl
        formData.set('image_url', final_url)
      }
    }

    startTransition(() => {
      action(formData)
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-2xl">
      {errorMsg && (
        <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm">
          {errorMsg}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700">Heading</label>
        <input
          type="text"
          name="heading"
          defaultValue={initialData.heading}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          name="description"
          defaultValue={initialData.description}
          rows={3}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Upload Hero Image</label>
        <input 
          type="file" 
          name="image_file" 
          accept="image/*" 
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              setImageUrl(''); // Clear the text URL if they upload a file
            }
          }}
          className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">OR Image URL</label>
        <input
          type="text"
          name="image_url"
          value={imageUrl || ''}
          onChange={(e) => setImageUrl(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
        />
        <p className="text-xs text-gray-500 mt-1">Provide a direct link if not uploading a file.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Button Text</label>
          <input
            type="text"
            name="primary_btn_text"
            defaultValue={initialData.primary_btn_text}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Primary Button Link</label>
          <input
            type="text"
            name="primary_btn_link"
            defaultValue={initialData.primary_btn_link}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Secondary Button Text</label>
          <input
            type="text"
            name="secondary_btn_text"
            defaultValue={initialData.secondary_btn_text}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Secondary Button Link</label>
          <input
            type="text"
            name="secondary_btn_link"
            defaultValue={initialData.secondary_btn_link}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm text-gray-900"
          />
        </div>
      </div>

      <div className="pt-4">
        <button
          type="submit"
          disabled={isPending || isUploading}
          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50"
        >
          {isUploading ? 'Uploading Image...' : isPending ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  )
}
