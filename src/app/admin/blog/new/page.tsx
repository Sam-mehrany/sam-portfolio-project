"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { LogOut, PlusCircle, Trash2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";

// Define the structure for a content section, same as projects
interface ContentSection {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  image: File | null;
  imageUrl?: string;
}

export default function NewBlogPage() {
  const router = useRouter();

  // State for the blog post details
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [tags, setTags] = useState("");
  
  // State for the dynamic content sections
  const [sections, setSections] = useState<ContentSection[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
  };

  // --- Section Management Handlers ---
  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: "", subtitle: "", body: "", image: null }]);
  };

  const removeSection = (id: number) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const handleSectionChange = (id: number, field: keyof Omit<ContentSection, 'id' | 'imageUrl'>, value: string | File | null) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };
  
  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];
    const formData = new FormData();
    files.forEach(file => formData.append('images', file));
    const uploadResponse = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    if (!uploadResponse.ok) throw new Error('Image upload failed');
    const uploadResult = await uploadResponse.json();
    return uploadResult.paths;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("Processing...");

    try {
      // Upload images from sections and prepare final section data
      const finalSectionsData = await Promise.all(
        sections.map(async (section) => {
          let imageUrl = '';
          if (section.image) {
            const uploadedUrls = await uploadImages([section.image]);
            imageUrl = uploadedUrls[0];
          }
          return {
            title: section.title,
            subtitle: section.subtitle,
            body: section.body,
            imageUrl: imageUrl,
          };
        })
      );

      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const newPost = {
        title,
        slug,
        excerpt,
        tags: tagsArray,
        content: finalSectionsData, // Use the new section-based content
        date: new Date().toISOString().split('T')[0]
      };

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error((await response.json()).error || 'Failed to create post.');
      }
      
      setMessage("Success! Post created. Redirecting...");
      setTimeout(() => router.push('/admin/blog'), 1500);

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold">Create New Post</h1>
              <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <Link href="/admin/blog" className="text-sm text-blue-500 hover:underline">
              ← Back to All Posts
            </Link>
          </header>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Post Details</h3>
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Post Title</label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Your amazing blog post title" required />
                  </div>
                  <div>
                    <label htmlFor="slug" className="block text-sm font-medium text-gray-700">URL Slug</label>
                    <Input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="your-amazing-blog-post-title" required />
                  </div>
                  <div>
                    <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">Excerpt</label>
                    <Textarea id="excerpt" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="A short summary of the post..." />
                  </div>
                  <div>
                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                    <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="e.g., Tech, AI, Web Dev" />
                  </div>
                </div>

                <div className="p-4 border rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">Post Content</h3>
                  {sections.map((section, index) => (
                    <div key={section.id} className="p-4 border rounded-md relative space-y-3">
                        <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => removeSection(section.id)}>
                            <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                        <h4 className="font-medium">Section {index + 1}</h4>
                        <Input value={section.title} onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)} placeholder="Section Title (optional)" />
                        <Input value={section.subtitle} onChange={(e) => handleSectionChange(section.id, 'subtitle', e.target.value)} placeholder="Section Subtitle (optional)" />
                        <Textarea value={section.body} onChange={(e) => handleSectionChange(section.id, 'body', e.target.value)} placeholder="Section body text... (Markdown supported)" className="min-h-[120px]" />
                        <Input type="file" onChange={(e) => handleSectionChange(section.id, 'image', e.target.files ? e.target.files[0] : null)} />
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addSection}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Section
                  </Button>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing Post...' : 'Publish Post'}
                </Button>
              </form>
              {message && <p className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthGuard>
  );
}