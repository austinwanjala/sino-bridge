import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ success?: string }> }) {
  const supabase = await createClient()
  const resolvedParams = await searchParams;
  
  // Fetch active programs for the dropdown
  const { data: programs } = await supabase
    .from('programs')
    .select('id, name, level')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  async function submitRegistration(formData: FormData) {
    'use server'
    const sb = await createClient()
    
    const request = {
      full_name: formData.get('full_name'),
      email: formData.get('email'),
      phone_number: formData.get('phone_number'),
      age: formData.get('age') ? parseInt(formData.get('age') as string) : null,
      program_interested: formData.get('program_interested'),
      preferred_class: formData.get('preferred_class'),
      preferred_schedule: formData.get('preferred_schedule'),
      message: formData.get('message'),
      status: 'new'
    }

    await sb.from('registration_requests').insert(request)
    redirect('/register?success=true')
  }

  return (
    <div className="bg-gray-50 py-16 min-h-[calc(100vh-80px)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {resolvedParams.success ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Registration Request Received</h2>
            <p className="text-gray-600">
              Thank you for your interest in SinoBridge! Our admissions team will review your request and contact you shortly with the next steps.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="bg-red-700 px-6 py-8 sm:p-10 text-center">
              <h1 className="text-3xl font-bold text-white tracking-tight">Register for Classes</h1>
              <p className="mt-2 text-red-100">
                Submit this form to reserve your spot. We will contact you to finalize the registration.
              </p>
            </div>
            
            <form action={submitRegistration} className="px-6 py-8 sm:p-10 space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Full Name *</label>
                  <input type="text" id="full_name" name="full_name" required className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                  <input type="email" id="email" name="email" required className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                  <input type="tel" id="phone_number" name="phone_number" required className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                </div>
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">Student Age</label>
                  <input type="number" id="age" name="age" min="0" className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                </div>
              </div>

              <div>
                <label htmlFor="program_interested" className="block text-sm font-medium text-gray-700">Program of Interest *</label>
                <select id="program_interested" name="program_interested" required className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500">
                  <option value="">Select a program...</option>
                  {programs?.map(p => (
                    <option key={p.id} value={p.name}>{p.name} {p.level ? `(${p.level})` : ''}</option>
                  ))}
                  <option value="Other">Other / Not sure yet</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="preferred_class" className="block text-sm font-medium text-gray-700">Preferred Mode</label>
                  <select id="preferred_class" name="preferred_class" className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500">
                    <option value="">Any</option>
                    <option value="Physical">Physical Classes</option>
                    <option value="Online">Online Classes</option>
                    <option value="Hybrid">Hybrid</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="preferred_schedule" className="block text-sm font-medium text-gray-700">Preferred Schedule</label>
                  <input type="text" id="preferred_schedule" name="preferred_schedule" placeholder="e.g. Weekends, Evening" className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500" />
                </div>
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Additional Notes or Questions</label>
                <textarea id="message" name="message" rows={4} className="mt-1 block w-full px-4 py-3 bg-white text-gray-900 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"></textarea>
              </div>

              <div>
                <button type="submit" className="w-full flex justify-center py-4 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-red-700 hover:bg-red-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
                  Submit Registration Request
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
