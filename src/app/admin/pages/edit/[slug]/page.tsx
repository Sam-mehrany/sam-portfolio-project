"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { LogOut, PlusCircle, Trash2 } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";
import { Checkbox } from "@/components/ui/checkbox";

// --- TYPE DEFINITIONS ---
interface Project { id: number; title: string; }
interface Experience { id: number; role: string; company: string; period: string; points: string; }
interface Education { id: number; degree: string; university: string; }

interface HomePageContent {
  hero: { availability: string; headline: string; skills: string; };
  snapshot: { role: string; location: string; focus: string; socials: { instagram: string; linkedin: string; email: string; }; };
  work: { title: string; subtitle: string; selectedProjects: number[] };
}

interface AboutPageContent {
  summary: string;
  experiences: Experience[];
  skills: { technical: string[]; soft: string[]; tools: string[]; };
  educations: Education[];
}

// --- COMPONENT ---
export default function EditPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<any>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      const fetchData = async () => {
        setIsLoading(true);
        try {
            const [pageRes, projectsRes] = await Promise.all([
                fetch(`/api/pages/${slug}`, { credentials: 'include' }),
                fetch('/api/projects', { credentials: 'include' })
            ]);
            
            if (pageRes.ok) {
              const data = await pageRes.json();
              setTitle(data.title);
              setContent(data.content);
            }
            if (projectsRes.ok) setAllProjects(await projectsRes.json());
        } catch (error) {
            console.error("Failed to fetch data:", error);
        }
        setIsLoading(false);
      };
      fetchData();
    }
  }, [slug]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST', credentials: 'include' });
    router.push('/admin/login');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("Saving...");
    const response = await fetch(`/api/pages/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, content }),
      credentials: 'include'
    });
    if (response.ok) setMessage("Page saved successfully!");
    else setMessage("Error: Failed to save page.");
    setTimeout(() => setMessage(""), 3000);
  };

  // --- GENERIC HANDLER for nested objects ---
  const handleContentChange = (path: string, value: any) => {
    setContent((prev: any) => {
        const newContent = JSON.parse(JSON.stringify(prev));
        let current = newContent;
        const keys = path.split('.');
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) current[keys[i]] = {};
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        return newContent;
    });
  };

  // --- DYNAMIC LIST HANDLERS (for Experience, Skills, Education) ---
  const addListItem = (listName: 'experiences' | 'educations' | 'skills.technical' | 'skills.soft' | 'skills.tools') => {
    setContent((prev: any) => {
        const newContent = JSON.parse(JSON.stringify(prev));
        if (listName.startsWith('skills.')) {
            const skillType = listName.split('.')[1] as keyof AboutPageContent['skills'];
            if(!newContent.skills) newContent.skills = { technical: [], soft: [], tools: [] };
            newContent.skills[skillType] = [...(newContent.skills[skillType] || []), 'New Skill'];
        } else {
            const newItem = listName === 'experiences' 
                ? { id: Date.now(), role: '', company: '', period: '', points: '' }
                : { id: Date.now(), degree: '', university: '' };
            newContent[listName] = [...(newContent[listName] || []), newItem];
        }
        return newContent;
    });
  };

  const removeListItem = (listName: 'experiences' | 'educations' | 'skills.technical' | 'skills.soft' | 'skills.tools', indexOrId: number) => {
     setContent((prev: any) => {
        const newContent = JSON.parse(JSON.stringify(prev));
        if (listName.startsWith('skills.')) {
            const skillType = listName.split('.')[1] as keyof AboutPageContent['skills'];
            newContent.skills[skillType].splice(indexOrId, 1);
        } else {
            newContent[listName] = newContent[listName].filter((item: any) => item.id !== indexOrId);
        }
        return newContent;
    });
  };

  const handleListItemChange = (listName: 'experiences' | 'educations' | 'skills.technical' | 'skills.soft' | 'skills.tools', indexOrId: number, value: string, field?: string) => {
    setContent((prev: any) => {
        const newContent = JSON.parse(JSON.stringify(prev));
        if (listName.startsWith('skills.')) {
            const skillType = listName.split('.')[1] as keyof AboutPageContent['skills'];
            newContent.skills[skillType][indexOrId] = value;
        } else {
            const list = newContent[listName];
            const itemIndex = list.findIndex((item: any) => item.id === indexOrId);
            if (itemIndex > -1 && field) {
                list[itemIndex][field] = value;
            }
        }
        return newContent;
    });
  };

  // --- HANDLER for HOME PAGE ---
  const handleProjectSelection = (projectId: number) => {
    setContent((prev: any) => {
        const selected = prev.work?.selectedProjects || [];
        const newSelection = selected.includes(projectId)
            ? selected.filter((id: number) => id !== projectId)
            : [...selected, projectId];
        return { ...prev, work: { ...prev.work, selectedProjects: newSelection } };
    });
  };

  // --- RENDER LOGIC ---
  const renderForm = () => {
    if (typeof content !== 'object' || content === null) return <p>Loading form...</p>;

    // ACTION: Render the Homepage Editor
    if (slug === 'home') {
      const homeContent = content as HomePageContent;
      return (
        <div className="space-y-6">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page Title (internal use)" />
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="font-semibold">Hero Section</h3>
            <Input value={homeContent.hero?.availability || ''} onChange={(e) => handleContentChange('hero.availability', e.target.value)} placeholder="Availability Status" />
            <Textarea value={homeContent.hero?.headline || ''} onChange={(e) => handleContentChange('hero.headline', e.target.value)} placeholder="Headline" className="min-h-[100px]" />
            <Textarea value={homeContent.hero?.skills || ''} onChange={(e) => handleContentChange('hero.skills', e.target.value)} placeholder="Skills (comma-separated)" />
          </div>
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="font-semibold">Snapshot Card</h3>
            <Input value={homeContent.snapshot?.role || ''} onChange={(e) => handleContentChange('snapshot.role', e.target.value)} placeholder="Role" />
            <Input value={homeContent.snapshot?.location || ''} onChange={(e) => handleContentChange('snapshot.location', e.target.value)} placeholder="Location" />
            <Input value={homeContent.snapshot?.focus || ''} onChange={(e) => handleContentChange('snapshot.focus', e.target.value)} placeholder="Focus" />
            <h4 className="font-medium text-sm pt-2">Social Links</h4>
            <Input value={homeContent.snapshot?.socials?.instagram || ''} onChange={(e) => handleContentChange('snapshot.socials.instagram', e.target.value)} placeholder="Instagram URL" />
            <Input value={homeContent.snapshot?.socials?.linkedin || ''} onChange={(e) => handleContentChange('snapshot.socials.linkedin', e.target.value)} placeholder="LinkedIn URL" />
            <Input value={homeContent.snapshot?.socials?.email || ''} onChange={(e) => handleContentChange('snapshot.socials.email', e.target.value)} placeholder="Email URL (mailto:...)" />
          </div>
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="font-semibold">Selected Work Section</h3>
            <Input value={homeContent.work?.title || ''} onChange={(e) => handleContentChange('work.title', e.target.value)} placeholder="Section Title" />
            <Input value={homeContent.work?.subtitle || ''} onChange={(e) => handleContentChange('work.subtitle', e.target.value)} placeholder="Section Subtitle" />
            <h4 className="font-medium text-sm pt-2">Featured Projects</h4>
            <div className="space-y-2">
                {allProjects.map((project) => (
                    <div key={project.id} className="flex items-center space-x-2">
                        <Checkbox id={`project-${project.id}`} checked={homeContent.work?.selectedProjects?.includes(project.id)} onCheckedChange={() => handleProjectSelection(project.id)}/>
                        <label htmlFor={`project-${project.id}`} className="text-sm font-medium">{project.title}</label>
                    </div>
                ))}
            </div>
          </div>
        </div>
      );
    }
    
    // ACTION: Render the About Me Page Editor
    if (slug === 'about') {
      const aboutContent = content as AboutPageContent;
      return (
        <div className="space-y-6">
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page Title (e.g., About Me)" />
          <div className="p-4 border rounded-lg space-y-3">
            <h3 className="font-semibold">Summary</h3>
            <Textarea value={aboutContent.summary || ''} onChange={(e) => handleContentChange('summary', e.target.value)} placeholder="Summary..." className="min-h-[120px]" />
          </div>
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">Work Experience</h3>
            {aboutContent.experiences?.map((exp, index) => (
              <div key={exp.id} className="p-3 border rounded-md relative space-y-2">
                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => removeListItem('experiences', exp.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                <h4 className="font-medium">Experience #{index + 1}</h4>
                <Input value={exp.role} onChange={(e) => handleListItemChange('experiences', exp.id, e.target.value, 'role')} placeholder="Role" />
                <Input value={exp.company} onChange={(e) => handleListItemChange('experiences', exp.id, e.target.value, 'company')} placeholder="Company" />
                <Input value={exp.period} onChange={(e) => handleListItemChange('experiences', exp.id, e.target.value, 'period')} placeholder="Period" />
                <Textarea value={exp.points} onChange={(e) => handleListItemChange('experiences', exp.id, e.target.value, 'points')} placeholder="Key points (one per line)..." className="min-h-[100px]" />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addListItem('experiences')}><PlusCircle className="h-4 w-4 mr-2" /> Add Experience</Button>
          </div>
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">Skills</h3>
            {['technical', 'soft', 'tools'].map(skillType => (
                <div key={skillType}>
                    <h4 className="font-medium capitalize">{skillType} Skills</h4>
                    {(aboutContent.skills?.[skillType as keyof typeof aboutContent.skills] || []).map((skill: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 mt-2">
                            <Input value={skill} onChange={(e) => handleListItemChange(`skills.${skillType}` as any, index, e.target.value)} placeholder={`New ${skillType} skill...`} />
                            <Button type="button" variant="ghost" size="icon" onClick={() => removeListItem(`skills.${skillType}` as any, index)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                        </div>
                    ))}
                    <Button type="button" variant="outline" size="sm" className="mt-2" onClick={() => addListItem(`skills.${skillType}` as any)}><PlusCircle className="h-4 w-4 mr-2" /> Add {skillType} skill</Button>
                </div>
            ))}
          </div>
          <div className="p-4 border rounded-lg space-y-4">
            <h3 className="font-semibold">Education</h3>
            {aboutContent.educations?.map((edu, index) => (
              <div key={edu.id} className="p-3 border rounded-md relative space-y-2">
                <Button type="button" variant="ghost" size="icon" className="absolute top-1 right-1 h-7 w-7" onClick={() => removeListItem('educations', edu.id)}><Trash2 className="h-4 w-4 text-red-500" /></Button>
                <h4 className="font-medium">Education #{index + 1}</h4>
                <Input value={edu.degree} onChange={(e) => handleListItemChange('educations', edu.id, e.target.value, 'degree')} placeholder="Degree" />
                <Input value={edu.university} onChange={(e) => handleListItemChange('educations', edu.id, e.target.value, 'university')} placeholder="University & Period" />
              </div>
            ))}
            <Button type="button" variant="outline" onClick={() => addListItem('educations')}><PlusCircle className="h-4 w-4 mr-2" /> Add Education</Button>
          </div>
        </div>
      );
    }

    // Fallback for other pages (e.g., Contact)
    return (
      <div className="space-y-4">
        <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page Title" />
        <Textarea value={typeof content === 'string' ? content : ''} onChange={(e) => setContent(e.target.value)} className="min-h-[400px]" placeholder="Page content (Markdown)..." />
      </div>
    );
  };

  if (isLoading || content === null) {
    return <AuthGuard><div className="text-center py-24">Loading page content...</div></AuthGuard>;
  }

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-100">
        <div className="max-w-3xl mx-auto px-6 py-16">
          <header className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-4xl font-bold capitalize">Edit {slug} Page</h1>
              <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout"><LogOut className="h-4 w-4" /></Button>
            </div>
            <Link href="/admin/pages" className="text-sm text-blue-500 hover:underline">← Back to All Pages</Link>
          </header>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit}>
                {renderForm()}
                <Button type="submit" className="mt-6">Save Changes</Button>
              </form>
              {message && <p className={`mt-4 text-sm ${message.startsWith('Error') ? 'text-red-500' : 'text-green-600'}`}>{message}</p>}
            </CardContent>
          </Card>
        </div>
      </main>
    </AuthGuard>
  );
}
