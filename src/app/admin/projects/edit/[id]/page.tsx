"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useParams, useRouter } from 'next/navigation';
import { PlusCircle, Trash2, X, LogOut } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";

// Define the structure for a content section
interface ContentSection {
  id: number;
  title: string;
  subtitle: string;
  body: string;
  image: File | null;
  imageUrl?: string;
}

export default function AdminEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  // State for project details
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState("");
  const [blurb, setBlurb] = useState("");
  const [tags, setTags] = useState("");
  
  // ACTION: Add state for thumbnail management
  const [existingThumbnail, setExistingThumbnail] = useState<string | null>(null);
  const [newThumbnail, setNewThumbnail] = useState<File | null>(null);

  const [outcome, setOutcome] = useState("");
  const [challenge, setChallenge] = useState("");
  const [solution, setSolution] = useState("");
  const [existingBannerImages, setExistingBannerImages] = useState<string[]>([]);
  const [newBannerImages, setNewBannerImages] = useState<File[]>([]);
  const [sections, setSections] = useState<ContentSection[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");
  
  const handleLogout = async () => {
    await fetch('/api/logout', { 
      method: 'POST',
      credentials: 'include' 
    });
    router.push('/admin/login');
  };

  useEffect(() => {
    if (id) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`/api/projects/${id}`, { credentials: 'include' });
          if (!response.ok) {
            if (response.status === 401) router.push('/admin/login');
            throw new Error('Project not found');
          }
          const data = await response.json();
          setTitle(data.title || "");
          setSlug(data.slug || "");
          setYear(data.year || "");
          setBlurb(data.blurb || "");
          setTags((data.tags || []).join(', '));
          setOutcome(data.outcome || "");
          setChallenge(data.challenge || "");
          setSolution(data.solution || "");
          setExistingBannerImages(data.images || []);
          // ACTION: Set the existing thumbnail from fetched data
          setExistingThumbnail(data.thumbnail || null);
          setSections(
            (data.content || []).map((item: any) => ({ 
              ...item, id: Date.now() + Math.random(), image: null 
            }))
          );
        } catch (error: any) {
          setMessage(`Error: ${error.message}`);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProject();
    }
  }, [id, router]);

  // --- Section Management Handlers ---
  const addSection = () => {
    setSections([...sections, { id: Date.now(), title: "", subtitle: "", body: "", image: null, imageUrl: '' }]);
  };

  const removeSection = (id: number) => {
    setSections(sections.filter(section => section.id !== id));
  };

  const handleSectionChange = (id: number, field: keyof Omit<ContentSection, 'id'>, value: string | File | null) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, [field]: value } : section
    ));
  };

  const handleRemoveImage = (id: number) => {
    setSections(sections.map(section => 
      section.id === id ? { ...section, imageUrl: '', image: null } : section
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
    return (await uploadResponse.json()).paths;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("Processing...");

    try {
      // ACTION: Handle thumbnail upload logic
      let finalThumbnailUrl = existingThumbnail;
      if (newThumbnail) {
        const [uploadedUrl] = await uploadImages([newThumbnail]);
        finalThumbnailUrl = uploadedUrl;
      }

      const newBannerImageUrls = await uploadImages(newBannerImages);
      const finalBannerUrls = [...existingBannerImages, ...newBannerImageUrls];

      const finalSectionsData = await Promise.all(
        sections.map(async (section) => {
          let finalImageUrl = section.imageUrl || '';
          if (section.image instanceof File) {
            finalImageUrl = (await uploadImages([section.image]))[0];
          }
          return {
            title: section.title,
            subtitle: section.subtitle,
            body: section.body,
            imageUrl: finalImageUrl,
          };
        })
      );
      
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(Boolean);
      const updatedProject = {
        slug, title, year, blurb, tags: tagsArray,
        thumbnail: finalThumbnailUrl, // ACTION: Add final thumbnail URL
        images: finalBannerUrls,
        outcome,
        challenge,
        solution,
        content: finalSectionsData,
      };

      const response = await fetch(`/api/projects/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProject),
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to update project');
      
      setMessage("Success! Project updated. Redirecting...");
      setTimeout(() => router.push('/admin/projects'), 1500);

    } catch (error: any) {
      setMessage(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleRemoveExistingBannerImage = (imageUrl: string) => {
    setExistingBannerImages(existingBannerImages.filter(img => img !== imageUrl));
  };

  if (isLoading) {
    return (
      <AuthGuard>
        <div className="text-center py-24">Loading project...</div>
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold">Edit Project</h1>
              <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
            <Link href="/admin/projects" className="text-sm text-blue-500 hover:underline">
              ← Back to All Projects
            </Link>
          </header>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Basic Information</h3>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Project Title" required />
                  <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="URL Slug" required />
                  <Input value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" />
                  <Textarea value={blurb} onChange={(e) => setBlurb(e.target.value)} placeholder="Blurb (short summary)" />
                  <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Tags (comma-separated)" />
                </div>

                {/* ACTION: New Thumbnail Section */}
                <div className="space-y-2 p-4 border rounded-lg">
                    <label className="block text-lg font-semibold">Thumbnail Image</label>
                    <p className="text-xs text-gray-500">This image will be shown on project listing pages.</p>
                    <div className="relative w-full max-w-xs">
                        {newThumbnail ? (
                            <img src={URL.createObjectURL(newThumbnail)} alt="New thumbnail preview" className="rounded-md w-full h-auto" />
                        ) : existingThumbnail ? (
                            <img src={existingThumbnail} alt="Current thumbnail" className="rounded-md w-full h-auto" />
                        ) : null}
                        
                        {(newThumbnail || existingThumbnail) && (
                            <Button 
                                type="button" 
                                variant="destructive" 
                                size="icon" 
                                className="absolute top-1 right-1 h-6 w-6"
                                onClick={() => { setNewThumbnail(null); setExistingThumbnail(null); }}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                    <Input 
                        type="file" 
                        onChange={(e) => setNewThumbnail(e.target.files ? e.target.files[0] : null)} 
                    />
                </div>
                
                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Key Project Details</h3>
                  <Textarea value={outcome} onChange={(e) => setOutcome(e.target.value)} placeholder="Key Outcome..." className="min-h-[100px]" />
                  <Textarea value={challenge} onChange={(e) => setChallenge(e.target.value)} placeholder="The Challenge..." className="min-h-[120px]" />
                  <Textarea value={solution} onChange={(e) => setSolution(e.target.value)} placeholder="The Solution..." className="min-h-[120px]" />
                </div>

                <div className="space-y-2 p-4 border rounded-lg">
                  <label className="block text-lg font-semibold">Project Page Banner</label>
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {(existingBannerImages || []).map(imgUrl => (
                      <div key={imgUrl} className="relative">
                        <img src={imgUrl} alt="Existing banner" className="rounded-md" />
                        <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => handleRemoveExistingBannerImage(imgUrl)}>
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <label className="block text-sm font-medium">Add New Banner Images</label>
                  <Input type="file" multiple onChange={(e) => setNewBannerImages(Array.from(e.target.files || []))} />
                </div>

                <div className="space-y-4 p-4 border rounded-lg">
                  <h3 className="font-semibold text-lg">Additional Content Sections</h3>
                  {(sections || []).map((section, index) => (
                    <div key={section.id} className="p-4 border rounded-md relative space-y-3">
                      <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => removeSection(section.id)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                      <h4 className="font-medium">Section {index + 1}</h4>
                      <Input value={section.title} onChange={(e) => handleSectionChange(section.id, 'title', e.target.value)} placeholder="Section Title" />
                      <Input value={section.subtitle} onChange={(e) => handleSectionChange(section.id, 'subtitle', e.target.value)} placeholder="Section Subtitle" />
                      <Textarea value={section.body} onChange={(e) => handleSectionChange(section.id, 'body', e.target.value)} placeholder="Section body..." className="min-h-[120px]" />
                      
                      <div className="space-y-2">
                            <label className="text-sm font-medium">Image</label>
                            <div className="relative w-full max-w-xs">
                                {section.image ? (
                                    <img src={URL.createObjectURL(section.image)} alt="New preview" className="rounded-md w-full h-auto" />
                                ) : section.imageUrl ? (
                                    <img src={section.imageUrl} alt="Current image" className="rounded-md w-full h-auto" />
                                ) : null}
                                
                                {(section.imageUrl || section.image) && (
                                    <Button 
                                        type="button" 
                                        variant="destructive" 
                                        size="icon" 
                                        className="absolute top-1 right-1 h-6 w-6"
                                        onClick={() => handleRemoveImage(section.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </Button>
                                )}
                            </div>
                            <Input type="file" onChange={(e) => handleSectionChange(section.id, 'image', e.target.files ? e.target.files[0] : null)} />
                        </div>
                    </div>
                  ))}
                  <Button type="button" variant="outline" onClick={addSection}>
                    <PlusCircle className="h-4 w-4 mr-2" />
                    Add Dynamic Section
                  </Button>
                </div>

                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving Changes...' : 'Save Changes'}
                </Button>
              </form>
              {message && <p className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthGuard>
  );
}
