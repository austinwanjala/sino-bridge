import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Calendar, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export const revalidate = 0

export default async function NewsArticlePage(props: { params: Promise<{ slug: string }> }) {
  const params = await props.params;
  const supabase = await createClient()

  const { data: article } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!article) {
    notFound()
  }

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/news" className="inline-flex items-center text-red-600 hover:text-red-800 transition-colors font-medium">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to News
          </Link>
        </div>

        <article className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {article.featured_image_url && (
            <div className="w-full h-[400px]">
              <img 
                src={article.featured_image_url} 
                alt={article.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          )}
          
          <div className="p-8 md:p-12">
            <div className="flex items-center text-sm text-gray-500 mb-6">
              <Calendar className="h-5 w-5 mr-2" />
              {new Date(article.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8 leading-tight">
              {article.title}
            </h1>
            
            <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {article.content}
            </div>
          </div>
        </article>
      </div>
    </div>
  )
}
