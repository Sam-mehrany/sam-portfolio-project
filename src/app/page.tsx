"use client";

import Link from 'next/link';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Instagram, Linkedin, Mail } from "lucide-react";

// Define types for our data to prevent errors
interface HomePageContent {
  hero: { availability: string; headline: string; skills: string; };
  snapshot: { role: string; location: string; focus: string; socials: { instagram: string; linkedin: string; email: string; }; };
  work: { title: string; subtitle: string; selectedProjects: number[] };
}

// ACTION: Updated the Project interface to include the thumbnail
interface Project {
  id: number;
  slug: string;
  title: string;
  year: string;
  blurb: string;
  tags: string[];
  thumbnail?: string; // Thumbnail is optional
}

export default function Portfolio() {
  // --- STATE MANAGEMENT ---
  const [content, setContent] = useState<HomePageContent | null>(null);
  const [allProjects, setAllProjects] = useState<Project[]>([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projectDescription, setProjectDescription] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --- DATA FETCHING ---
  useEffect(() => {
    const getHomePageContent = async () => {
      try {
        const res = await fetch('/api/pages/home');
        if (res.ok) {
          const data = await res.json();
          setContent(data.content);
        }
      } catch (error) {
        console.error("Failed to fetch homepage content:", error);
      }
    };

    const getProjects = async () => {
      try {
        const res = await fetch('/api/projects');
        if (res.ok) {
          const data = await res.json();
          setAllProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    };

    getHomePageContent();
    getProjects();
  }, []);

  // --- FORM HANDLERS ---
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (projectDescription) setIsModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!contactInfo) {
      alert("Please provide your contact information.");
      return;
    }

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectDescription, contactInfo }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit message.");
      }

      setIsSubmitted(true);

      setTimeout(() => {
        setIsModalOpen(false);
        setTimeout(() => {
          setIsSubmitted(false);
          setProjectDescription("");
          setContactInfo("");
        }, 500);
      }, 2000);

    } catch (error) {
      console.error("Submission error:", error);
      alert("There was an error submitting your request. Please try again.");
    }
  };

  // Filter projects based on the selection from the CMS
  const featuredProjects = allProjects.filter(project =>
    content?.work?.selectedProjects?.includes(project.id)
  );

  const skills = (content?.hero?.skills || '').split(',').map(s => s.trim()).filter(Boolean);
  const socials = [
    { icon: <Instagram className="h-5 w-5" />, label: "Instagram", href: content?.snapshot?.socials?.instagram || '#' },
    { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", href: content?.snapshot?.socials?.linkedin || '#' },
    { icon: <Mail className="h-5 w-5" />, label: "Email", href: content?.snapshot?.socials?.email || '#' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-3 py-1 text-sm mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              {content?.hero?.availability || 'Loading...'}
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Sam Mehrany</h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl">
              {content?.hero?.headline || 'Loading...'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="rounded-full text-slate-700">{s}</Badge>
              ))}
            </div>
            <div className="mt-8">
              <Link href="/about"><Button variant="default">Learn More About Me</Button></Link>
            </div>
          </div>
          <div className="md:justify-self-end w-full">
            <Card className="rounded-xl shadow-lg">
              <CardHeader><CardTitle>Snapshot</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Role</span><span className="font-medium ml-2">{content?.snapshot?.role}</span></div>
                <div className="flex justify-between"><span>Location</span><span className="font-medium ml-2">{content?.snapshot?.location}</span></div>
                <div className="flex justify-between"><span>Focus</span><span className="font-medium ml-2">{content?.snapshot?.focus}</span></div>
                <div className="flex items-center justify-start gap-4 pt-4 mt-4 border-t">
                  {socials.map((s) => (
                    <a key={s.label} href={s.href} className="text-slate-600 hover:text-slate-900" target="_blank" rel="noopener noreferrer">
                      {s.icon}<span className="sr-only">{s.label}</span>
                    </a>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Projects */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-2xl md:text-3xl font-semibold">{content?.work?.title || 'Selected Work'}</h2>
        <p className="text-slate-600 mt-2">{content?.work?.subtitle}</p>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {featuredProjects.length > 0 ? featuredProjects.map((p) => (
            <Link href={`/projects/${p.slug}`} key={p.slug} className="group">
              {/* The only change is adding "p-0" to this line */}
              <Card className="p-0 rounded-lg hover:shadow-xl transition-shadow h-full flex flex-col overflow-hidden">
                <div className="aspect-[16/9] bg-slate-100">
                  {p.thumbnail ? (
                    <img
                      src={p.thumbnail}
                      alt={`${p.title} thumbnail`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
                      No Image
                    </div>
                  )}
                </div>
                <div className="flex flex-col flex-grow p-4">
                  <CardHeader className="p-0">
                    <CardTitle className="flex items-center justify-between group-hover:text-blue-600 transition-colors">
                      <span>{p.title}</span>
                      <span className="text-sm font-normal text-slate-500">{p.year}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0 pt-4 flex-grow">
                    <p className="text-slate-700">{p.blurb}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(p.tags || []).map((t) => (
                        <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          )) : <p className="text-slate-500 md:col-span-2">No featured projects have been selected yet.</p>}
        </div>
        <div className="mt-8">
          <Link href="/projects"><Button>View All Projects</Button></Link>
        </div>

        {/* Project Request Form */}
        <div id="contact" className="mt-12">
          <Card className="p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-2">Have a project in mind?</h3>
            <form onSubmit={handleInitialSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Describe your project idea in a few words…"
                value={projectDescription}
                onChange={(e) => setProjectDescription(e.target.value)}
                required
              />
              <Button type="submit">Continue</Button>
            </form>
          </Card>
        </div>
      </section>

      {/* Confirmation Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className={`sm:max-w-[425px] transition-colors duration-300 ${isSubmitted ? 'bg-emerald-50' : ''}`}>
          {!isSubmitted ? (
            <>
              <DialogHeader>
                <DialogTitle>Complete Your Request</DialogTitle>
                <DialogDescription>
                  Just one last step. Please provide your contact info so I can get back to you.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <h4 className="font-semibold text-sm text-slate-500">Your Project Idea:</h4>
                  <p className="text-sm p-3 bg-slate-100 rounded-md mt-1">{projectDescription}</p>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="contact-info" className="font-semibold text-sm">Your WhatsApp or Email</label>
                  <Input
                    id="contact-info"
                    placeholder="Enter contact info..."
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button onClick={handleFinalSubmit}>Submit Request</Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader className="text-center py-8">
                <DialogTitle className="text-2xl">Thank You!</DialogTitle>
                <DialogDescription className="text-emerald-900 pt-2">
                  Your project request has been submitted. I will get back to you shortly.
                </DialogDescription>
              </DialogHeader>
            </>
          )}
        </DialogContent>
      </Dialog>

      <footer className="py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Sam Mehrany — Built with ❤️ + Tailwind
      </footer>
    </div>
  );
}