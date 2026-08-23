import { createClient } from '@/lib/supabase/server'
import HeroForm from './HeroForm'
import FeaturesForm from './FeaturesForm'
import CTAForm from './CTAForm'
import { revalidatePath } from 'next/cache'

export default async function HomepageCMS() {
  const supabase = await createClient()

  // Fetch Hero content
  const { data: heroData } = await supabase
    .from('homepage_content')
    .select('content')
    .eq('section_type', 'hero')
    .single()

  const heroContent = heroData?.content || {
    heading: 'Learn Chinese. Connect with the World.',
    description: 'Discover Chinese language and culture through practical, engaging and flexible learning programs.',
    image_url: 'https://images.unsplash.com/photo-1543332143-4e8c27e3256f?q=80&w=2064&auto=format&fit=crop',
    primary_btn_text: 'Explore Classes',
    primary_btn_link: '/classes',
    secondary_btn_text: 'Register Now',
    secondary_btn_link: '/register',
  }

  // Fetch Features content
  const { data: featuresData } = await supabase
    .from('homepage_content')
    .select('content')
    .eq('section_type', 'features')
    .single()
  const featuresContent = featuresData?.content || {}

  // Fetch CTA content
  const { data: ctaData } = await supabase
    .from('homepage_content')
    .select('content')
    .eq('section_type', 'cta')
    .single()
  const ctaContent = ctaData?.content || {}

  // Server Action for saving Hero content
  async function saveHeroContent(formData: FormData) {
    'use server'
    const sb = await createClient()
    const content = {
      heading: formData.get('heading'),
      description: formData.get('description'),
      image_url: formData.get('image_url'),
      primary_btn_text: formData.get('primary_btn_text'),
      primary_btn_link: formData.get('primary_btn_link'),
      secondary_btn_text: formData.get('secondary_btn_text'),
      secondary_btn_link: formData.get('secondary_btn_link'),
    }

    await sb.from('homepage_sections').upsert({ section_type: 'hero', is_visible: true, display_order: 1 })
    await sb.from('homepage_content').upsert({ section_type: 'hero', content: content }, { onConflict: 'section_type' })

    revalidatePath('/') 
    revalidatePath('/admin/homepage')
  }

  // Server Action for saving Features content
  async function saveFeaturesContent(formData: FormData) {
    'use server'
    const sb = await createClient()
    const content = {
      tagline: formData.get('tagline'),
      heading: formData.get('heading'),
      description: formData.get('description'),
      f1_title: formData.get('f1_title'),
      f1_desc: formData.get('f1_desc'),
      f2_title: formData.get('f2_title'),
      f2_desc: formData.get('f2_desc'),
      f3_title: formData.get('f3_title'),
      f3_desc: formData.get('f3_desc'),
    }

    await sb.from('homepage_sections').upsert({ section_type: 'features', is_visible: true, display_order: 2 })
    await sb.from('homepage_content').upsert({ section_type: 'features', content: content }, { onConflict: 'section_type' })

    revalidatePath('/') 
    revalidatePath('/admin/homepage')
  }

  // Server Action for saving CTA content
  async function saveCTAContent(formData: FormData) {
    'use server'
    const sb = await createClient()
    const content = {
      heading: formData.get('heading'),
      description: formData.get('description'),
      btn_text: formData.get('btn_text'),
      btn_link: formData.get('btn_link'),
    }

    await sb.from('homepage_sections').upsert({ section_type: 'cta', is_visible: true, display_order: 3 })
    await sb.from('homepage_content').upsert({ section_type: 'cta', content: content }, { onConflict: 'section_type' })

    revalidatePath('/') 
    revalidatePath('/admin/homepage')
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Homepage Sections</h1>
        <p className="text-sm text-gray-500 mt-1">Manage the content blocks on the public homepage.</p>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Hero Section</h2>
        <HeroForm initialData={heroContent} action={saveHeroContent} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Why Choose Us (Features)</h2>
        <FeaturesForm initialData={featuresContent} action={saveFeaturesContent} />
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">Call to Action (CTA)</h2>
        <CTAForm initialData={ctaContent} action={saveCTAContent} />
      </div>
    </div>
  )
}
