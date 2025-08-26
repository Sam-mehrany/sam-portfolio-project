// projects[slug].tsx

"use client";

import { Badge } from "@/components/ui/badge";
import { ArrowLeft, CheckCircle, Target, Wrench, X } from "lucide-react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

// ... (Your interfaces can stay the same)
interface ContentSection {
  title: string;
  subtitle: string;
  body: string;
  imageUrl?: string;
}

interface ProjectDetails {
  id: number;
  slug: string;
  title: string;
  year: string;
  blurb: string;
  tags: string[];
  images: string[];
  outcome: string;
  challenge: string;
  solution: string;
  content: ContentSection[];
}


export default function SingleProjectPage() {
  const params = useParams();
  const slug = params.slug;

  const [project, setProject] = useState<ProjectDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      const fetchProject = async () => {
        try {
          const response = await fetch(`http://localhost:8000/api/projects/slug/${slug}`);
          if (!response.ok) throw new Error('Could not find this project.');
          const data = await response.json();
          setProject(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProject();
    }
  }, [slug]);

  if (isLoading) return <div className="text-center py-24">Loading project...</div>;

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen text-center">
        <h1 className="text-4xl font-bold">Project Not Found</h1>
        <p className="text-slate-600 mt-2">{error}</p>
        <Link href="/projects" className="mt-4 text-blue-500 hover:underline">
          Return to All Projects
        </Link>
      </div>
    );
  }

  return (
    <>
      <main className="min-h-screen bg-gradient-to-b from-white to-slate-50 text-slate-900">
        {/* ... (Your header and carousel JSX can stay the same) ... */}
        <div className="max-w-4xl mx-auto px-6 pt-16">
          <header className="mb-12">
            <Link href="/projects" className="inline-flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to all projects
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{project.title}</h1>
            <p className="text-lg text-slate-600 mt-2">{project.blurb}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(project.tags || []).map(tag => <Badge key={tag}>{tag}</Badge>)}
            </div>
          </header>
        </div>

        {(project.images || []).length > 0 && (
          <div className="w-full mb-12">
            <Carousel className="w-full" opts={{ align: "start", loop: true }}>
              <CarouselContent className="-ml-4">
                {(project.images || []).map((imageSrc, index) => (
                  <CarouselItem key={index} className="pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <div className="cursor-pointer" onClick={() => setLightboxImage(`http://localhost:8000${imageSrc}`)}>
                      <img 
                        src={`http://localhost:8000${imageSrc}`}
                        alt={`Project image ${index + 1} for ${project.title}`}
                        className="w-full h-auto object-cover rounded-lg"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="ml-16"/>
              <CarouselNext className="mr-16"/>
            </Carousel>
          </div>
        )}

        <div className="max-w-3xl mx-auto px-6 pb-16 space-y-12">
          {/* Fixed sections */}
          {project.outcome && (
            <section>
              <h2 className="text-3xl font-bold flex items-center gap-3 mb-3">
                <CheckCircle className="h-8 w-8 text-emerald-500" /> Key Outcome
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{project.outcome}</p>
            </section>
          )}
          {project.challenge && (
            <section>
              <h2 className="text-3xl font-bold flex items-center gap-3 mb-3">
                <Target className="h-8 w-8 text-slate-500" /> The Challenge
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{project.challenge}</p>
            </section>
          )}
          {project.solution && (
            <section>
              <h2 className="text-3xl font-bold flex items-center gap-3 mb-3">
                <Wrench className="h-8 w-8 text-slate-500" /> The Solution
              </h2>
              <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{project.solution}</p>
            </section>
          )}

          {/* Dynamic sections */}
          {(project.content || []).map((section, index) => {
            // ACTION: Added this console.log for debugging
            console.log(`Rendering Section ${index + 1}:`, section);

            return (
              <section key={index}>
                {section.title && <h2 className="text-3xl font-bold mb-2">{section.title}</h2>}
                {section.subtitle && <h3 className="text-xl text-slate-600 font-semibold mb-4">{section.subtitle}</h3>}
                {section.imageUrl && (
                  <img 
                    src={`http://localhost:8000${section.imageUrl}`}
                    alt={section.title || 'Section image'}
                    className="rounded-lg my-4 w-full h-auto cursor-pointer"
                    onClick={() => setLightboxImage(`http://localhost:8000${section.imageUrl}`)}
                  />
                )}
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">{section.body}</p>
              </section>
            );
          })}
        </div>
      </main>

      {/* Lightbox component */}
      {lightboxImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-slate-300"
            onClick={() => setLightboxImage(null)}
          >
            <X className="h-8 w-8" />
          </button>
          <img 
            src={lightboxImage} 
            alt="Expanded view" 
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  );
}