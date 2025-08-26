import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

// --- TYPE DEFINITION ---
interface Project {
  id: number;
  slug: string;
  title: string;
  year: string;
  blurb: string;
  tags: string[];
  thumbnail?: string;
}

// --- DATA FETCHING ---
async function getProjects(): Promise<Project[]> {
  try {
    const response = await fetch('http://localhost:8000/api/projects', {
      cache: 'no-store'
    });
    if (!response.ok) {
      console.error("Failed to fetch projects, server responded with:", response.status);
      return [];
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch projects:", error);
    return [];
  }
}

export default async function AllProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight">All Projects</h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            A complete collection of my work, from web design to AI-driven campaigns.
          </p>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <Link href={`/projects/${p.slug}`} key={p.id} className="group">
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
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(p.tags || []).map((t) => (
                        <Badge key={t} variant="secondary" className="rounded-full">{t}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}