"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogOut, FolderKanban, FileText, MessageSquare, Newspaper } from "lucide-react"; // Added Newspaper
import AuthGuard from "@/components/auth/AuthGuard";

export default function AdminDashboardPage() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/logout', { 
      method: 'POST',
      credentials: 'include' 
    });
    router.push('/admin/login');
  };

  return (
    <AuthGuard>
      <main className="min-h-screen bg-slate-100">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <header className="flex items-start justify-between mb-12">
            <div>
              <h1 className="text-4xl font-bold">Admin Dashboard</h1>
              <p className="mt-2 text-slate-600">Select a content type to manage.</p>
            </div>
            <Button variant="outline" size="icon" onClick={handleLogout} aria-label="Logout">
              <LogOut className="h-4 w-4" />
            </Button>
          </header>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Projects Card */}
            <Link href="/admin/projects">
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl"><FolderKanban className="h-8 w-8" />Manage Projects</CardTitle>
                </CardHeader>
                <CardContent><p className="text-slate-600">Create, edit, and delete your portfolio projects.</p></CardContent>
              </Card>
            </Link>

            {/* Pages Card */}
            <Link href="/admin/pages">
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl"><FileText className="h-8 w-8" />Manage Pages</CardTitle>
                </CardHeader>
                <CardContent><p className="text-slate-600">Edit the content of your Home, About, and Contact pages.</p></CardContent>
              </Card>
            </Link>

            {/* ACTION: Added the Manage Blog card */}
            <Link href="/admin/blog">
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl"><Newspaper className="h-8 w-8" />Manage Blog</CardTitle>
                </CardHeader>
                <CardContent><p className="text-slate-600">Write, edit, and publish new blog posts.</p></CardContent>
              </Card>
            </Link>

            {/* Messages Card */}
            <Link href="/admin/messages">
              <Card className="hover:shadow-lg hover:-translate-y-1 transition-all">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-2xl"><MessageSquare className="h-8 w-8" />Manage Messages</CardTitle>
                </CardHeader>
                <CardContent><p className="text-slate-600">View and delete project requests from your homepage form.</p></CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </AuthGuard>
  );
}