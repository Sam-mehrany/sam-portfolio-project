"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlusCircle, LogOut, ArrowLeft } from "lucide-react";
import AuthGuard from "@/components/auth/AuthGuard";

// ACTION: Updated the Project interface to include the thumbnail
interface Project {
  id: number;
  title: string;
  slug: string;
  year: string;
  thumbnail?: string; // Thumbnail is optional for older projects
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Use the relative URL for the proxy
        const response = await fetch('/api/projects');
        if (!response.ok) {
          throw new Error("Failed to fetch projects. Please ensure the backend is running.");
        }
        const data = await response.json();
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  const handleLogout = async () => {
    await fetch('/api/logout', { 
      method: 'POST',
      credentials: 'include' 
    });
    router.push('/admin/login');
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
        const response = await fetch(`/api/projects/${id}`, {
            method: 'DELETE',
            credentials: 'include'
        });
        if (!response.ok) throw new Error("Failed to delete project.");
        setProjects(projects.filter(p => p.id !== id));
    } catch (err: any) {
        setError(err.message);
    }
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <header className="mb-8">
            <div className="flex items-center justify-between mb-4">
                <Link href="/admin" className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Dashboard
                </Link>
                <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout">
                    <LogOut className="h-4 w-4" />
                </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold">Manage Projects</h1>
                <p className="text-slate-600">Create, edit, and delete your portfolio projects.</p>
              </div>
              <Link href="/admin/projects/new">
                <Button>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
              </Link>
            </div>
          </header>
          
          {isLoading && <p>Loading projects...</p>}
          {error && <p className="text-red-500 font-semibold p-4 bg-red-100 rounded-md">{error}</p>}

          <div className="space-y-4">
            {projects.map((project) => (
              <Card key={project.id}>
                <CardContent className="p-4 flex items-center justify-between gap-4">
                  {/* ACTION: Added thumbnail image display */}
                  <div className="flex items-center gap-4 flex-grow">
                    {project.thumbnail ? (
                      <img 
                        src={project.thumbnail} 
                        alt={`${project.title} thumbnail`}
                        className="w-24 h-16 object-cover rounded-md bg-slate-200"
                      />
                    ) : (
                      <div className="w-24 h-16 rounded-md bg-slate-200 flex items-center justify-center text-xs text-slate-500">
                        No Image
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{project.title}</h3>
                      <p className="text-sm text-slate-500">/{project.slug}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Link href={`/admin/projects/edit/${project.id}`}>
                      <Button variant="outline" size="sm">Edit</Button>
                    </Link>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}
