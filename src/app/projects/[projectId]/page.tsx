import { ProjectIdView } from '@/features/projects/components/project-id-view';
import React from 'react'
import { Id } from '../../../../convex/_generated/dataModel';

const IndividualProject = async ({ params }: { params: Promise<{ projectId: Id<"projects"> }>}) => {
    const { projectId } = await params;
    return (
        <ProjectIdView projectId={projectId}/>
    )
}

export default IndividualProject