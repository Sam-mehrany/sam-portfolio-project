import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- TYPE DEFINITION ---
interface Post {
  id: number;
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  tags: string[];
}

// --- DATA FETCHING ---
async function getPosts(): Promise<Post[]> {
  try {
    // On the server, we use the full URL to the backend
    const res = await fetch('http://localhost:8000/api/posts', { 
      cache: 'no-store' // This ensures the list is always fresh
    });
    if (!res.ok) {
      console.error("Failed to fetch posts, server responded with:", res.status);
      return [];
    }
    return res.json();
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return [];
  }
}

// --- COMPONENT ---
export default async function BlogListPage() {
  const posts = await getPosts();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="max-w-4xl mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">Blog & Articles</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Thoughts on design, technology, and creative strategy.
          </p>
        </header>

        <div className="space-y-8">
          {posts.length > 0 ? posts.map((post) => (
            <Link href={`/blog/${post.slug}`} key={post.id} className="block group">
              <Card className="rounded-2xl hover:shadow-xl transition-shadow">
                <CardHeader>
                  <CardTitle className="group-hover:text-blue-600 transition-colors">{post.title}</CardTitle>
                  <p className="text-sm text-slate-500 pt-1">
                    {/* Format the date for better readability */}
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-700 mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-2">
                    {(post.tags || []).map((tag) => (
                      <Badge key={tag} variant="secondary">{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          )) : (
            <div className="text-center py-12">
              <p className="text-slate-500">No blog posts have been published yet.</p>
              <p className="text-sm text-slate-400 mt-2">Go to the admin panel to create your first post.</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
