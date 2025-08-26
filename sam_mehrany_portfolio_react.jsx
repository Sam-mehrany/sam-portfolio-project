import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Instagram, Linkedin, Mail, ExternalLink, Play } from "lucide-react";

export default function Portfolio() {
  const [sent, setSent] = useState(false);
  const [newProject, setNewProject] = useState("");

  const projects = [
    {
      title: "Ronix DE Homepage Redesign",
      role: "Website Manager / B2B Strategist",
      year: "2025",
      blurb:
        "Led the shift from B2C to B2B for the German market, creating a homepage that speaks directly to tool retailers, improving conversion potential.",
      ctas: [],
      tags: ["B2B Web Design", "UX Writing", "Market Strategy"],
    },
    {
      title: "AI‑Driven Product Teasers & Campaigns",
      role: "AI Creative Director",
      year: "2025",
      blurb:
        "Produced high‑impact AI‑generated videos for Ronix products, leveraging ComfyUI workflows, Runway Gen‑3, and integrated sound design.",
      ctas: [],
      tags: ["GenAI Video", "ComfyUI", "Runway Gen‑3"],
    },
  ];

  const skills = [
    "B2B Marketing (DACH)",
    "Website Management",
    "UX Writing & Localization",
    "AI Video Production",
    "ComfyUI Workflows",
    "Content Strategy",
  ];

  const socials = [
    { icon: <Instagram className="h-5 w-5" />, label: "Instagram", href: "https://www.instagram.com/" },
    { icon: <Linkedin className="h-5 w-5" />, label: "LinkedIn", href: "https://www.linkedin.com/" },
    { icon: <Mail className="h-5 w-5" />, label: "Email", href: "mailto:email@example.com" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      {/* Hero */}
      <header className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-2">
            <div className="inline-flex items-center gap-2 rounded-2xl bg-slate-100 px-3 py-1 text-sm mb-4">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Open to collaborations (remote / EU)
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">Sam Mehrany</h1>
            <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-2xl">
              Marketing strategist and UX writer specializing in B2B transitions, AI‑powered campaigns, and high‑impact brand storytelling.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {skills.map((s) => (
                <Badge key={s} variant="secondary" className="rounded-full text-slate-700">
                  {s}
                </Badge>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#projects"><Button className="rounded-2xl">View projects</Button></a>
              <a href="#contact"><Button variant="outline" className="rounded-2xl">Contact</Button></a>
              {socials.map((s) => (
                <a key={s.label} href={s.href} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
                  {s.icon}<span className="underline decoration-dotted underline-offset-4">{s.label}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="md:justify-self-end">
            <Card className="rounded-3xl shadow-lg">
              <CardHeader>
                <CardTitle>Snapshot</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-slate-600">
                <div className="flex justify-between"><span>Role</span><span className="font-medium">Marketing & UX</span></div>
                <div className="flex justify-between"><span>Location</span><span className="font-medium">Germany (remote‑friendly)</span></div>
                <div className="flex justify-between"><span>Focus</span><span className="font-medium">B2B, GenAI Campaigns</span></div>
              </CardContent>
            </Card>
          </div>
        </div>
      </header>

      {/* Projects */}
      <section id="projects" className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl md:text-3xl font-semibold">Selected Work</h2>
        <p className="text-slate-600 mt-2">Key highlights of my recent projects.</p>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {projects.map((p) => (
            <Card key={p.title} className="rounded-3xl hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{p.title}</span>
                  <span className="text-sm font-normal text-slate-500">{p.year}</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-slate-700">{p.blurb}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {p.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
                  ))}
                </div>
                {p.ctas.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-3">
                    {p.ctas.map((c) => (
                      <a key={c.href} href={c.href} target="_blank" rel="noreferrer">
                        <Button variant="outline" size="sm" className="rounded-xl inline-flex items-center gap-2">
                          <Play className="h-4 w-4" /> {c.label} <ExternalLink className="h-4 w-4" />
                        </Button>
                      </a>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="mt-10 p-6 bg-white rounded-3xl shadow-md">
          <h3 className="text-lg font-semibold mb-2">Submit a new project request</h3>
          <form onSubmit={(e) => { e.preventDefault(); alert(`New project request submitted: ${newProject}`); setNewProject(""); }} className="flex gap-3">
            <Input placeholder="Describe your project idea…" value={newProject} onChange={(e) => setNewProject(e.target.value)} className="flex-1 rounded-2xl" required />
            <Button type="submit" className="rounded-2xl">Submit</Button>
          </form>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="max-w-6xl mx-auto px-6 py-16">
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle>Get in touch</CardTitle>
          </CardHeader>
          <CardContent>
            {sent ? (
              <p className="text-emerald-600">Thanks! Your message has been staged locally. Hook this form to your email/service to receive messages.</p>
            ) : (
              <form
                className="grid md:grid-cols-2 gap-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
              >
                <Input placeholder="Name" required className="rounded-2xl" />
                <Input type="email" placeholder="Email" required className="rounded-2xl" />
                <Textarea placeholder="Your message…" className="md:col-span-2 rounded-2xl min-h-[140px]" />
                <div className="md:col-span-2 flex items-center justify-between">
                  <div className="flex gap-3">
                    {socials.map((s) => (
                      <a key={s.label} href={s.href} className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900">
                        {s.icon}<span className="sr-only">{s.label}</span>
                      </a>
                    ))}
                  </div>
                  <Button type="submit" className="rounded-2xl">Send</Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      <footer className="py-10 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Sam Mehrany — Built with ❤️ + Tailwind
      </footer>
    </div>
  );
}
