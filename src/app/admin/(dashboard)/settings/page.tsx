import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export const revalidate = 0

export default async function SettingsPage() {
  const supabase = await createClient()

  // Fetch settings. We assume a single row.
  const { data: settings } = await supabase
    .from('site_settings')
    .select('*')
    .single()

  async function saveSettings(formData: FormData) {
    'use server'
    const sb = await createClient()

    const newSettings = {
      school_name: formData.get('school_name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      whatsapp: formData.get('whatsapp'),
      address: formData.get('address'),
      facebook: formData.get('facebook'),
      instagram: formData.get('instagram'),
      tiktok: formData.get('tiktok'),
      youtube: formData.get('youtube'),
      footer_description: formData.get('footer_description'),
      copyright_text: formData.get('copyright_text'),
    }

    const { data: existingSettings } = await sb.from('site_settings').select('id').single()

    if (existingSettings?.id) {
      await sb.from('site_settings').update(newSettings).eq('id', existingSettings.id)
    } else {
      await sb.from('site_settings').insert(newSettings)
    }

    revalidatePath('/')
    revalidatePath('/admin/settings')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Site Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Manage global website settings, contact information, and social links.</p>
      </div>

      <form action={saveSettings} className="bg-white shadow rounded-lg p-6 space-y-8">
        
        {/* General Info */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">General Information</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">School Name</label>
              <input type="text" name="school_name" defaultValue={settings?.school_name || 'SinoBridge Chinese School'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Contact Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email Address</label>
              <input type="email" name="email" defaultValue={settings?.email || 'hello@sinobridge.edu'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Phone Number</label>
              <input type="text" name="phone" defaultValue={settings?.phone || '+1 234 567 8900'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">WhatsApp Number</label>
              <input type="text" name="whatsapp" defaultValue={settings?.whatsapp || '0757028379'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">Physical Address</label>
              <textarea name="address" rows={2} defaultValue={settings?.address || '123 Education Lane, Learning City, 10000'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"></textarea>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Social Media Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Facebook URL</label>
              <input type="url" name="facebook" defaultValue={settings?.facebook || ''} placeholder="https://facebook.com/..." className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Instagram Handle / URL</label>
              <input type="text" name="instagram" defaultValue={settings?.instagram || 'antony_demba1'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">TikTok Handle / URL</label>
              <input type="text" name="tiktok" defaultValue={settings?.tiktok || ''} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">YouTube URL</label>
              <input type="url" name="youtube" defaultValue={settings?.youtube || ''} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 border-b pb-2 mb-4">Footer Details</h2>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Footer Description</label>
              <textarea name="footer_description" rows={2} defaultValue={settings?.footer_description || 'Discover Chinese language and culture through practical, engaging, and flexible learning programs designed for all ages.'} className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-md"></textarea>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Copyright Text</label>
              <input type="text" name="copyright_text" defaultValue={settings?.copyright_text || '© 2026 SinoBridge Chinese School. All rights reserved.'} placeholder="© 2026 SinoBridge. All rights reserved." className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 placeholder-gray-500 border border-gray-300 rounded-md" />
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end border-t">
          <button type="submit" className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-700 hover:bg-red-800">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
