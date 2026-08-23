import { createClient } from '@/lib/supabase/server'
import { Check } from 'lucide-react'

export const revalidate = 0

export default async function FeesPage() {
  const supabase = await createClient()

  const { data: fees } = await supabase
    .from('fees')
    .select('*, programs(name)')
    .order('display_order', { ascending: true })

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Tuition & Fees</h1>
          <p className="mt-4 text-xl text-gray-600">
            Transparent pricing for our language programs. Invest in your future today.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {fees?.map((fee) => (
            <div key={fee.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow relative">
              <div className="bg-red-700 h-2 w-full absolute top-0"></div>
              <div className="p-8 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-gray-900">{fee.title}</h3>
                {fee.programs && <p className="text-sm text-red-600 font-medium mt-1">{fee.programs.name}</p>}
                
                <div className="mt-6 mb-8 flex items-baseline">
                  <span className="text-4xl font-extrabold text-gray-900">{fee.amount}</span>
                  {fee.billing_cycle && (
                    <span className="ml-2 text-sm text-gray-500 font-medium">/ {fee.billing_cycle}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  {fee.description && (
                    <div className="text-gray-600 text-sm whitespace-pre-line">
                      <ul className="space-y-3">
                        {fee.description.split('\n').filter(Boolean).map((line: string, idx: number) => (
                          <li key={idx} className="flex items-start">
                            <Check className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
                            <span>{line}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                <div className="mt-8">
                  <a href="/register" className="block w-full bg-red-50 text-red-700 text-center hover:bg-red-100 px-4 py-3 rounded-md text-sm font-bold transition-colors">
                    Enroll Now
                  </a>
                </div>
              </div>
            </div>
          ))}

          {(!fees || fees.length === 0) && (
            <div className="col-span-full text-center py-12 text-gray-500">
              Pricing details are currently being updated.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
