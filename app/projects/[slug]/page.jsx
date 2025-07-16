import { originalProjects } from "@/public/data/projects";
import { notFound } from "next/navigation";
import ProjectDetailClient from "../../../components/ProjectDetailClient";

export async function generateStaticParams() {
  console.log("Generating static params for:", originalProjects.map(p => p.slug));
  return originalProjects.map((project) => ({
    slug: project.slug,
  }));
}

export default function ProjectDetailPage({ params }) {
  const { slug } = params;

  const index = originalProjects.findIndex((p) => p.slug === slug);
  if (index === -1) return notFound();

  const project = originalProjects[index];
  const nextProject = originalProjects[(index + 1) % originalProjects.length];

  return <ProjectDetailClient project={project} nextProject={nextProject} />;
}
