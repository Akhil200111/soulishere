import { calculateFamilyTreeLayout } from './familyTreeLayout';

/**
 * Backwards compatible wrapper for buildFamilyTree.
 * Delegates to calculateFamilyTreeLayout for 100% dynamic position & curve generation.
 */
export function buildFamilyTree(familyMembers = [], mainMemorial = null) {
    const layout = calculateFamilyTreeLayout(familyMembers, mainMemorial);
    
    // Group generations for legacy callers if needed
    const genMap = {};
    layout.nodes.forEach(n => {
        if (!genMap[n.generation]) genMap[n.generation] = [];
        genMap[n.generation].push(n);
    });

    const generationLevels = Object.keys(genMap)
        .map(Number)
        .sort((a, b) => a - b)
        .map(level => ({
            level,
            label: level === 0 ? 'Main Generation' : (level < 0 ? `Ancestors (Gen ${level})` : `Descendants (Gen +${level})`),
            nodes: genMap[level]
        }));

    return {
        ...layout,
        generations: generationLevels,
        connections: {
            parentChild: layout.edges.parentChild,
            spouse: layout.edges.spouse
        }
    };
}

export default buildFamilyTree;
