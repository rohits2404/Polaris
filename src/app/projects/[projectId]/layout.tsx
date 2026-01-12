import { ProjectIdLayout } from '@/features/projects/components/project-id-layout';
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';

interface LayoutProps {
    children: React.ReactNode;
    params: Promise<{ projectId: Id<"projects"> }>
}

const ProjectLayout = async ({ children, params }: LayoutProps) => {
    const { projectId } = await params;
    return (
        <ProjectIdLayout
        projectId={projectId}
        >
            {children}
        </ProjectIdLayout>
    )
}

export default ProjectLayout