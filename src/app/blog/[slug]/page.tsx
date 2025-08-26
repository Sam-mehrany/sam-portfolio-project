import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

// --- TYPE DEFINITIONS ---
interface ContentSection {
  title: string;
  subtitle: string;
  body: string;
  imageUrl?: string;
}

interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
  content: ContentSection[];
}

// --- DATA FETCHING ---
async function getPost(slug: string): Promise<Post | null> {
  try {
    const res = await fetch(`http://localhost:8000/api/posts/slug/${slug}`, { cache: 'no-store' });
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error("Failed to fetch post:", error);
    return null;
  }
}

// --- COMPONENT ---
export default async function SinglePostPage({ params }: { params: { slug: string } }) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="text-center py-24">
        <h1 className="text-4xl font-bold">Post Not Found</h1>
        <Link href="/blog" className="mt-4 text-blue-500 hover:underline">
          Return to Blog
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-16 lg:py-24">
        <header className="mb-12">
          <Link href="/blog" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">{post.title}</h1>
          <p className="mt-3 text-sm text-slate-500">
            Published on {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(post.tags || []).map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <article className="prose lg:prose-xl">
          {/* Render each section from the post's content array */}
          {(post.content || []).map((section, index) => (
            <section key={index} className="mb-8">
              {section.title && <h2>{section.title}</h2>}
              {section.subtitle && <h3 className="text-slate-600">{section.subtitle}</h3>}
              {section.imageUrl && (
                <img 
                  src={section.imageUrl} // The proxy will handle the full URL
                  alt={section.title || 'Blog post image'}
                  className="rounded-lg my-4 w-full h-auto"
                />
              )}
              {/* Use ReactMarkdown to render the body text */}
              <ReactMarkdown>{section.body}</ReactMarkdown>
            </section>
          ))}
        </article>
      </div>
    </main>
  );
}
