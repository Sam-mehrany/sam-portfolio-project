import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase, GraduationCap, Wrench } from "lucide-react";

// --- TYPE DEFINITIONS ---
interface Experience {
  id: number;
  role: string;
  company: string;
  period: string;
  points: string;
}
interface Education {
  id: number;
  degree: string;
  university: string;
}
interface AboutPageContent {
  summary: string;
  experiences: Experience[];
  skills: {
    technical: string[];
    soft: string[];
    tools: string[];
  };
  educations: Education[];
}

// --- DATA FETCHING ---
async function getPageContent(): Promise<AboutPageContent | null> {
  try {
    const res = await fetch('http://localhost:8000/api/pages/about', { cache: 'no-store' });
    if (!res.ok) return null;
    const page = await res.json();
    return page.content;
  } catch (error) {
    console.error("Failed to fetch About page content:", error);
    return null;
  }
}

// --- COMPONENT ---
export default async function AboutPage() {
  const content = await getPageContent();

  // Provide default data if content fails to load
  const summary = content?.summary || "Content is loading...";
  const experiences = content?.experiences || [];
  const educations = content?.educations || [];
  
  // FIX: Directly use the arrays from the content object. No .split() needed.
  const technicalSkills = content?.skills?.technical || [];
  const softSkills = content?.skills?.soft || [];
  const tools = content?.skills?.tools || [];

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-16">
        {/* Header Section */}
        <header className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">About Me</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-3xl mx-auto">
            {summary}
          </p>
        </header>

        <div className="space-y-8">
          {/* Section Titles Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            <h2 className="md:col-span-2 text-3xl font-semibold flex items-center gap-3">
              <Briefcase className="h-8 w-8 text-slate-500" />
              Work Experience
            </h2>
            <h2 className="md:col-span-1 text-3xl font-semibold">
              Skills & Expertise
            </h2>
          </div>

          {/* Section Content Grid */}
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {/* Main Column: Work Experience Cards */}
            <div className="md:col-span-2 space-y-8">
              {experiences.map((exp) => (
                <Card key={exp.id} className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="flex justify-between items-baseline">
                      <span className="text-xl">{exp.role}</span>
                      <span className="text-sm font-normal text-slate-500">{exp.period}</span>
                    </CardTitle>
                    <p className="text-md text-slate-600 font-medium">{exp.company}</p>
                  </CardHeader>
                  <CardContent>
                    <ul className="list-disc list-inside space-y-2 text-slate-700">
                      {exp.points.split('\n').map((point, index) => (
                        point && <li key={index}>{point}</li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sidebar Column: Skills, Tools, Education Cards */}
            <div className="md:col-span-1 space-y-8">
              <Card className="rounded-2xl">
                <CardHeader><CardTitle className="text-xl">Technical Skills</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {technicalSkills.map(skill => <Badge key={skill}>{skill}</Badge>)}
                </CardContent>
              </Card>
              
              <Card className="rounded-2xl">
                <CardHeader><CardTitle className="text-xl">Soft Skills</CardTitle></CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {softSkills.map(skill => <Badge variant="secondary" key={skill}>{skill}</Badge>)}
                </CardContent>
              </Card>

              <Card className="rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2"><Wrench className="h-5 w-5" /> Tools & Software</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  {tools.map(tool => <Badge variant="outline" key={tool}>{tool}</Badge>)}
                </CardContent>
              </Card>

              {educations.map((edu) => (
                <Card key={edu.id} className="rounded-2xl">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2"><GraduationCap className="h-5 w-5" /> Education</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="font-semibold">{edu.degree}</p>
                    <p className="text-sm text-slate-600">{edu.university}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}