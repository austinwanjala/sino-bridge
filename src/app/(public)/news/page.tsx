import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { Calendar } from 'lucide-react'

export const revalidate = 0

export default async function NewsPage() {
  const supabase = await createClient()

  const { data: articles } = await supabase
    .from('news')
    .select('*')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return (
    <div className="bg-gray-50 py-16 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">News & Announcements</h1>
          <p className="mt-4 text-xl text-gray-600">
            Stay up to date with the latest from SinoBridge.
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {articles?.map((article) => (
            <article key={article.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex flex-col md:flex-row hover:shadow-md transition-shadow">
              {article.image_url && (
                <div className="md:w-1/3">
                  <img src={article.image_url} alt={article.title} className="w-full h-48 md:h-full object-cover" />
                </div>
              )}
              <div className={`p-8 flex flex-col justify-center ${article.image_url ? 'md:w-2/3' : 'w-full'}`}>
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(article.published_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{article.title}</h2>
                <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                  {article.summary || article.content}
                </p>
                <div className="mt-auto">
                  <Link href={`/news/${article.slug}`} className="text-red-600 font-semibold hover:text-red-800 transition-colors">
                    Read full article &rarr;
                  </Link>
                </div>
              </div>
            </article>
          ))}

          {(!articles || articles.length === 0) && (
            <div className="text-center py-12 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
              No news articles have been published yet.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
