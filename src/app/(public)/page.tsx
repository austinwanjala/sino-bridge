import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const revalidate = 0

export default async function Home() {
  const supabase = await createClient()

  const { data: heroContent } = await supabase
    .from('homepage_content')
    .select('content')
    .eq('section_type', 'hero')
    .single()

  const hero = heroContent?.content || {
    heading: 'Learn Chinese. Connect with the World.',
    description: 'Discover Chinese language and culture through practical, engaging and flexible learning programs.',
    image_url: 'https://images.unsplash.com/photo-1543332143-4e8c27e3256f?q=80&w=2064&auto=format&fit=crop',
    primary_btn_text: 'Explore Classes',
    primary_btn_link: '/classes',
    secondary_btn_text: 'Register Now',
    secondary_btn_link: '/register',
  }

  const { data: featuresContent } = await supabase
    .from('homepage_content')
    .select('content')
    .eq('section_type', 'features')
    .single()

  const features = featuresContent?.content || {
    tagline: 'Why SinoBridge?',
    heading: 'Excellence in Chinese Education',
    description: 'We blend traditional cultural immersion with modern teaching methodologies to provide the best learning experience.',
    f1_title: 'Expert Instructors',
    f1_desc: 'Our teachers are native speakers with extensive experience and formal qualifications in teaching Chinese as a second language.',
    f2_title: 'Cultural Immersion',
    f2_desc: 'Language cannot be separated from culture. We host regular cultural events, workshops, and traditional festivals.',
    f3_title: 'Proven Curriculum',
    f3_desc: 'Our structured curriculum is aligned with HSK standards, ensuring measurable progress and recognized qualifications.'
  }

  const { data: ctaContent } = await supabase
    .from('homepage_content')
    .select('content')
    .eq('section_type', 'cta')
    .single()

  const cta = ctaContent?.content || {
    heading: 'Ready to start your journey?',
    description: 'Join hundreds of students discovering the beauty of the Chinese language. Registration for the upcoming semester is now open.',
    btn_text: 'Enroll Today',
    btn_link: '/register'
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-900 text-white overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={hero.image_url}
            alt="Hero Background"
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 lg:py-48 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
            {hero.heading}
          </h1>
          <p className="mt-4 text-xl text-gray-300 max-w-3xl mb-10 leading-relaxed">
            {hero.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href={hero.primary_btn_link}
              className="bg-red-600 text-white hover:bg-red-700 px-8 py-4 rounded-md text-lg font-medium transition-colors shadow-lg"
            >
              {hero.primary_btn_text}
            </Link>
            <Link
              href={hero.secondary_btn_link}
              className="bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 border border-white/30 px-8 py-4 rounded-md text-lg font-medium transition-colors shadow-lg"
            >
              {hero.secondary_btn_text}
            </Link>
          </div>
        </div>
      </section>
      
      {/* Why Choose Us Section */}
      <section className="py-24 bg-white relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 opacity-5 pointer-events-none">
          <svg width="404" height="404" fill="none" viewBox="0 0 404 404">
            <defs>
              <pattern id="85737c0e-0916-41d7-917f-596dc7edfa27" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect x="0" y="0" width="4" height="4" className="text-red-700" fill="currentColor" />
              </pattern>
            </defs>
            <rect width="404" height="404" fill="url(#85737c0e-0916-41d7-917f-596dc7edfa27)" />
          </svg>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-sm font-bold text-red-700 tracking-wide uppercase mb-2">{features.tagline}</h2>
            <h3 className="text-3xl md:text-4xl font-extrabold text-gray-900">{features.heading}</h3>
            <p className="mt-4 text-xl text-gray-600">
              {features.description}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-700 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-red-700/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{features.f1_title}</h4>
              <p className="text-gray-600 leading-relaxed">{features.f1_desc}</p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8 border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-gray-900 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-gray-900/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{features.f2_title}</h4>
              <p className="text-gray-600 leading-relaxed">{features.f2_desc}</p>
            </div>

            <div className="bg-red-50 rounded-2xl p-8 border border-red-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-red-700 rounded-xl flex items-center justify-center mb-6 shadow-md shadow-red-700/20">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h4 className="text-xl font-bold text-gray-900 mb-3">{features.f3_title}</h4>
              <p className="text-gray-600 leading-relaxed">{features.f3_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links CTA */}
      <section className="bg-gray-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-700 rounded-3xl p-8 md:p-12 shadow-2xl flex flex-col md:flex-row items-center justify-between overflow-hidden relative">
            {/* Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
            
            <div className="relative z-10 md:w-2/3 mb-8 md:mb-0">
              <h2 className="text-3xl font-bold text-white mb-4">{cta.heading}</h2>
              <p className="text-red-100 text-lg">{cta.description}</p>
            </div>
            <div className="relative z-10 md:w-1/3 flex justify-end w-full">
              <Link href={cta.btn_link} className="w-full sm:w-auto bg-white text-red-800 hover:bg-gray-50 font-bold px-8 py-4 rounded-lg text-center transition-colors shadow-lg text-lg">
                {cta.btn_text}
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
