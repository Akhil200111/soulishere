/**
 * Relationship-Aware Dynamic Family Tree Layout Engine for Soulishere Memorial Platform.
 * 
 * Architecture:
 * 1. buildFamilyGraph()
 * 2. normalizeRelationships()
 * 3. calculateGenerations()
 * 4. createRelationshipGroups()
 * 5. calculateGroupAndNodePositions()
 * 6. calculateEdgeRoutes() (Dedicated Edge Routing System with Family Junctions & Partner Groups)
 * 7. validateFamilyGraph()
 */

// Configurable Layout Constants
export const LAYOUT_CONFIG = {
    NODE_SIZE: 124,          // 124px diameter circular node
    NODE_RADIUS: 62,         // 62px radius
    PARTNER_GAP: 250,        // Spacing between partner node centers (40px clean gutter for middle stem)
    SIBLING_GAP: 250,        // Spacing between sibling node centers
    GENERATION_GAP: 330,     // Vertical distance between generation levels (prevents text & line overlaps)
    MIN_NODE_GAP: 250,       // Minimum horizontal space between adjacent nodes
    Y_START: 130              // Top padding for generation rows
};

/**
 * Main Layout Function
 */
export function calculateFamilyTreeLayout(familyMembers = [], mainMemorial = null) {
    const graph = buildFamilyGraph(familyMembers, mainMemorial);
    normalizeRelationships(graph);
    calculateGenerations(graph);
    createRelationshipGroups(graph);
    calculateGroupAndNodePositions(graph);
    calculateEdgeRoutes(graph);
    validateFamilyGraph(graph);

    return graph.output;
}

/**
 * Step 1: Build Initial Family Graph Structure
 */
function buildFamilyGraph(familyMembers = [], mainMemorial = null) {
    const rawMembers = Array.isArray(familyMembers) ? [...familyMembers] : [];

    const formatYearStr = (d) => {
        if (!d) return '';
        try {
            const dateObj = new Date(d);
            if (!isNaN(dateObj.getTime())) return dateObj.getFullYear().toString();
            return String(d).trim();
        } catch {
            return String(d).trim();
        }
    };

    let mainPersonId = null;
    let mainMemberIndex = rawMembers.findIndex(
        m => m.isMainPerson || (m.relationship && m.relationship.toLowerCase() === 'self')
    );

    if (mainMemberIndex !== -1) {
        mainPersonId = rawMembers[mainMemberIndex].id || 'main_person';
        rawMembers[mainMemberIndex] = {
            ...rawMembers[mainMemberIndex],
            id: mainPersonId,
            isMainPerson: true
        };
    } else if (mainMemorial) {
        mainPersonId = 'main_person';
        const birthYr = formatYearStr(mainMemorial.birthDate);
        const deathYr = formatYearStr(mainMemorial.deathDate);
        let datesStr = '';
        if (birthYr && deathYr) datesStr = `${birthYr} – ${deathYr}`;
        else if (birthYr) datesStr = `${birthYr} – current`;
        else if (deathYr) datesStr = `d. ${deathYr}`;

        const mainPersonNode = {
            id: mainPersonId,
            name: `${mainMemorial.firstName || ''} ${mainMemorial.lastName || ''}`.trim() || 'Memorial Subject',
            relationship: 'Self',
            dates: datesStr,
            gender: mainMemorial.gender || '',
            avatarUrl: mainMemorial.profilePicture || '',
            parentIds: [],
            spouseIds: [],
            generation: 0,
            bio: mainMemorial.lifeSummary || mainMemorial.biography || '',
            isMainPerson: true
        };
        rawMembers.unshift(mainPersonNode);
    }

    const nodesById = {};
    rawMembers.forEach((member, index) => {
        const id = member.id ? String(member.id).trim() : `fm_${index}_${Math.random().toString(36).substring(2, 7)}`;

        let datesStr = member.dates ? String(member.dates).trim() : '';
        if (!datesStr && (member.birthDate || member.deathDate)) {
            const b = formatYearStr(member.birthDate);
            const d = formatYearStr(member.deathDate);
            if (b && d) datesStr = `${b} – ${d}`;
            else if (b) datesStr = `${b} – current`;
            else if (d) datesStr = `d. ${d}`;
        }
        if (!datesStr) datesStr = 'nill';

        const isDeceased = datesStr.includes('–') && !datesStr.toLowerCase().includes('current') && datesStr !== 'nill'
            || datesStr.toLowerCase().includes('d.') || !!member.deathDate;

        nodesById[id] = {
            id,
            name: member.name ? String(member.name).trim() : 'Unnamed Member',
            relationship: member.relationship ? String(member.relationship).trim() : '',
            dates: datesStr,
            isDeceased,
            gender: member.gender ? String(member.gender).toLowerCase() : '',
            avatarUrl: member.avatarUrl || '',
            parentIds: Array.isArray(member.parentIds) ? member.parentIds.map(String) : [],
            spouseIds: Array.isArray(member.spouseIds) ? member.spouseIds.map(String) : [],
            childrenIds: [],
            generation: typeof member.generation === 'number' ? member.generation : 0,
            memorialRefId: member.memorialRefId || null,
            bio: member.bio || '',
            isMainPerson: !!member.isMainPerson || id === mainPersonId
        };
    });

    return {
        rawMembers,
        mainPersonId,
        nodesById,
        groups: [],
        partnerGroups: [],
        childGroups: [],
        genLevels: [],
        output: {}
    };
}

/**
 * Step 2: Normalize Relationships & Infer Hierarchy
 */
function normalizeRelationships(graph) {
    const { nodesById, mainPersonId } = graph;

    // 1. Infer relationships for legacy flat tags
    if (mainPersonId && nodesById[mainPersonId]) {
        const mainNode = nodesById[mainPersonId];
        Object.values(nodesById).forEach(node => {
            if (node.id === mainPersonId) return;
            const rel = node.relationship.toLowerCase();

            if (['father', 'mother', 'parent'].includes(rel)) {
                if (!mainNode.parentIds.includes(node.id)) mainNode.parentIds.push(node.id);
            } else if (['spouse', 'husband', 'wife', 'partner'].includes(rel)) {
                if (!mainNode.spouseIds.includes(node.id)) mainNode.spouseIds.push(node.id);
                if (!node.spouseIds.includes(mainNode.id)) node.spouseIds.push(mainNode.id);
            } else if (['son', 'daughter', 'child'].includes(rel)) {
                if (!node.parentIds.includes(mainNode.id)) node.parentIds.push(mainNode.id);
            } else if (['grandfather', 'grandmother'].includes(rel)) {
                // Link grandmother/grandfather as parent of mainNode's parents if available
                const parentNode = mainNode.parentIds.map(pid => nodesById[pid]).find(Boolean);
                if (parentNode) {
                    if (!parentNode.parentIds.includes(node.id)) parentNode.parentIds.push(node.id);
                } else {
                    // Fallback to mainNode parent if no parents defined yet
                    if (!mainNode.parentIds.includes(node.id)) mainNode.parentIds.push(node.id);
                    node.generation = -2;
                }
            } else if (['grandson', 'granddaughter'].includes(rel)) {
                // Link grandchild to mainNode's children if available
                const childNode = Object.values(nodesById).find(n => n.parentIds.includes(mainPersonId));
                if (childNode) {
                    if (!node.parentIds.includes(childNode.id)) node.parentIds.push(childNode.id);
                } else {
                    if (!node.parentIds.includes(mainPersonId)) node.parentIds.push(mainPersonId);
                    node.generation = 2;
                }
            }
        });
    }

    // 2. Bidirectional Link Syncing
    Object.values(nodesById).forEach(node => {
        node.parentIds.forEach(pid => {
            if (nodesById[pid] && !nodesById[pid].childrenIds.includes(node.id)) {
                nodesById[pid].childrenIds.push(node.id);
            }
        });
        node.spouseIds.forEach(sid => {
            if (nodesById[sid] && !nodesById[sid].spouseIds.includes(node.id)) {
                nodesById[sid].spouseIds.push(node.id);
            }
        });
    });
}

/**
 * Step 3: Calculate Dynamic Generations via Graph Traversal
 */
function calculateGenerations(graph) {
    const { nodesById, mainPersonId } = graph;
    const visitedGen = new Set();
    const genQueue = [];

    const rootSeedId = mainPersonId && nodesById[mainPersonId] ? mainPersonId : Object.keys(nodesById)[0];
    if (rootSeedId && nodesById[rootSeedId]) {
        const seedGen = typeof nodesById[rootSeedId].generation === 'number' ? nodesById[rootSeedId].generation : 0;
        genQueue.push({ id: rootSeedId, level: seedGen });
        visitedGen.add(rootSeedId);
    }

    while (genQueue.length > 0) {
        const { id, level } = genQueue.shift();
        const node = nodesById[id];
        if (!node) continue;

        node.generation = level;

        // Parents: level - 1
        node.parentIds.forEach(pid => {
            if (nodesById[pid] && !visitedGen.has(pid)) {
                visitedGen.add(pid);
                genQueue.push({ id: pid, level: level - 1 });
            }
        });

        // Spouses: level
        node.spouseIds.forEach(sid => {
            if (nodesById[sid] && !visitedGen.has(sid)) {
                visitedGen.add(sid);
                genQueue.push({ id: sid, level: level });
            }
        });

        // Children: level + 1
        node.childrenIds.forEach(cid => {
            if (nodesById[cid] && !visitedGen.has(cid)) {
                visitedGen.add(cid);
                genQueue.push({ id: cid, level: level + 1 });
            }
        });
    }

    // Ensure disjoint nodes receive valid generation numbers
    Object.values(nodesById).forEach(node => {
        if (!visitedGen.has(node.id)) {
            // Check relationship hints
            const rel = node.relationship.toLowerCase();
            if (['grandfather', 'grandmother'].includes(rel)) node.generation = -2;
            else if (['father', 'mother', 'parent'].includes(rel)) node.generation = -1;
            else if (['son', 'daughter', 'child'].includes(rel)) node.generation = 1;
            else if (['grandson', 'granddaughter'].includes(rel)) node.generation = 2;
            else node.generation = 0;
        }
    });

    // Group nodes by generation level
    const genMap = {};
    Object.values(nodesById).forEach(node => {
        const g = node.generation;
        if (!genMap[g]) genMap[g] = [];
        genMap[g].push(node);
    });

    graph.genMap = genMap;
    graph.genLevels = Object.keys(genMap).map(Number).sort((a, b) => a - b);
}

/**
 * Step 4: Create Relationship Groups (Partner Groups & Child Groups)
 */
function createRelationshipGroups(graph) {
    const { nodesById, genLevels, genMap } = graph;
    const partnerGroups = [];
    const processedSpouses = new Set();

    genLevels.forEach(level => {
        const nodesInGen = genMap[level];
        nodesInGen.forEach(node => {
            if (processedSpouses.has(node.id)) return;

            const spouseId = (node.spouseIds || []).find(sid => nodesById[sid] && nodesById[sid].generation === level);

            if (spouseId && !processedSpouses.has(spouseId)) {
                const spouseNode = nodesById[spouseId];
                const sharedChildren = Array.from(new Set([...node.childrenIds, ...spouseNode.childrenIds]));

                const group = {
                    id: `pg_${[node.id, spouseId].sort().join('_')}`,
                    type: 'partner',
                    members: [node, spouseNode],
                    memberIds: [node.id, spouseId],
                    childrenIds: sharedChildren,
                    generation: level
                };

                partnerGroups.push(group);
                processedSpouses.add(node.id);
                processedSpouses.add(spouseId);
            } else {
                const group = {
                    id: `sg_${node.id}`,
                    type: 'single',
                    members: [node],
                    memberIds: [node.id],
                    childrenIds: [...node.childrenIds],
                    generation: level
                };

                partnerGroups.push(group);
                processedSpouses.add(node.id);
            }
        });
    });

    graph.partnerGroups = partnerGroups;
}

/**
 * Step 5: Calculate Group and Node Coordinates (x, y)
 */
function calculateGroupAndNodePositions(graph) {
    const { nodesById, partnerGroups, genLevels, genMap } = graph;
    const { PARTNER_GAP, SIBLING_GAP, GENERATION_GAP, MIN_NODE_GAP, Y_START, NODE_RADIUS } = LAYOUT_CONFIG;

    const layoutPositions = {};

    // First pass: Assign initial horizontal X & Y per generation row
    genLevels.forEach((level, genIdx) => {
        const genY = Y_START + genIdx * GENERATION_GAP;
        const groupsInGen = partnerGroups.filter(g => g.generation === level);

        const totalWidth = groupsInGen.reduce((acc, g) => {
            return acc + (g.type === 'partner' ? PARTNER_GAP : 0);
        }, 0) + (groupsInGen.length - 1) * MIN_NODE_GAP;

        let startX = -totalWidth / 2;

        groupsInGen.forEach(group => {
            if (group.type === 'single') {
                const node = group.members[0];
                layoutPositions[node.id] = { x: startX, y: genY, generation: level };
                group.midX = startX;
                group.midY = genY;
                startX += MIN_NODE_GAP;
            } else if (group.type === 'partner') {
                const [n1, n2] = group.members;
                const leftX = startX - PARTNER_GAP / 2;
                const rightX = startX + PARTNER_GAP / 2;

                layoutPositions[n1.id] = { x: leftX, y: genY, generation: level };
                layoutPositions[n2.id] = { x: rightX, y: genY, generation: level };

                group.midX = startX;
                group.midY = genY;

                startX += MIN_NODE_GAP + PARTNER_GAP / 2;
            }
        });
    });

    // Second Pass (Bottom-Up & Top-Down Centering): Center children under parent groups & parent groups over children
    genLevels.slice().reverse().forEach((level) => {
        const groupsInGen = partnerGroups.filter(g => g.generation === level);
        groupsInGen.forEach(group => {
            if (group.childrenIds.length > 0) {
                // Layout children symmetrically under group midpoint
                const childrenNodes = group.childrenIds.map(cid => nodesById[cid]).filter(Boolean);
                const nChildren = childrenNodes.length;

                if (nChildren > 0) {
                    const childrenTotalWidth = (nChildren - 1) * SIBLING_GAP;
                    const childStartX = group.midX - childrenTotalWidth / 2;

                    childrenNodes.forEach((child, idx) => {
                        const targetChildX = childStartX + idx * SIBLING_GAP;
                        if (layoutPositions[child.id]) {
                            layoutPositions[child.id].x = targetChildX;
                        }
                    });
                }
            }
        });
    });

    // Third Pass: Overlap Resolution
    genLevels.forEach(level => {
        const nodesInGen = Object.values(nodesById)
            .filter(n => n.generation === level)
            .sort((a, b) => (layoutPositions[a.id]?.x || 0) - (layoutPositions[b.id]?.x || 0));

        for (let i = 0; i < nodesInGen.length - 1; i++) {
            const n1 = nodesInGen[i];
            const n2 = nodesInGen[i + 1];
            const p1 = layoutPositions[n1.id];
            const p2 = layoutPositions[n2.id];

            if (p1 && p2 && p2.x - p1.x < MIN_NODE_GAP) {
                const overlap = MIN_NODE_GAP - (p2.x - p1.x);
                p2.x += overlap;
            }
        }
    });

    // Build Finalized Node List
    const finalNodes = Object.values(nodesById).map(node => {
        const pos = layoutPositions[node.id] || { x: 0, y: Y_START, generation: 0 };
        return {
            ...node,
            x: pos.x,
            y: pos.y,
            radius: NODE_RADIUS
        };
    });

    graph.finalNodes = finalNodes;
}

/**
 * Step 6: Dedicated Edge Routing System
 * 
 * Generates:
 * 1. Partner horizontal connectors with central heart medallion.
 * 2. ONE Single Family Junction per parent/partner group with children:
 *    - Parent/Partner Center stem down
 *    - Horizontal distribution bar
 *    - Vertical drops into children top node caps with small golden circle dots.
 * 3. Ancestor edges (Grandparent -> Parent).
 */
function calculateEdgeRoutes(graph) {
    const { finalNodes, partnerGroups, genLevels, genMap, nodesById } = graph;
    const { NODE_RADIUS, GENERATION_GAP } = LAYOUT_CONFIG;

    const partnerEdges = [];
    const familyJunctions = [];
    const ancestorEdges = [];

    // 1. Partner Edges (Connecting actual node boundaries)
    partnerGroups.forEach(group => {
        if (group.type === 'partner') {
            const [n1, n2] = group.members.map(m => finalNodes.find(fn => fn.id === m.id));
            if (!n1 || !n2) return;

            const leftN = n1.x <= n2.x ? n1 : n2;
            const rightN = n1.x <= n2.x ? n2 : n1;

            const startX = leftN.x + NODE_RADIUS + 2;
            const startY = leftN.y;
            const endX = rightN.x - NODE_RADIUS - 2;
            const endY = rightN.y;

            const heartX = (startX + endX) / 2;
            const heartY = startY;

            partnerEdges.push({
                id: `sp_${leftN.id}_${rightN.id}`,
                fromId: leftN.id,
                toId: rightN.id,
                startX,
                startY,
                endX,
                endY,
                heartX,
                heartY,
                pathData: `M ${startX} ${startY} L ${endX} ${endY}`
            });

            group.stemOriginX = heartX;
            group.stemOriginY = heartY + 12; // Origin stem drops right below heart medallion
        } else {
            const singleNode = finalNodes.find(fn => fn.id === group.members[0].id);
            if (singleNode) {
                group.stemOriginX = singleNode.x;
                group.stemOriginY = singleNode.y + NODE_RADIUS + 88; // Stem drops cleanly below node name, relationship, & dates text (62+88 = 150px)!
            }
        }
    });

    // 2. Family Junctions (Parent Group -> Children Group)
    partnerGroups.forEach(group => {
        if (group.childrenIds.length > 0) {
            const childrenNodes = group.childrenIds
                .map(cid => finalNodes.find(fn => fn.id === cid))
                .filter(Boolean)
                .sort((a, b) => a.x - b.x);

            if (childrenNodes.length === 0) return;

            const stemStartX = group.stemOriginX;
            const stemStartY = group.stemOriginY;

            const minChildY = Math.min(...childrenNodes.map(c => c.y));
            const junctionY = stemStartY + (minChildY - NODE_RADIUS - 12 - stemStartY) * 0.55;

            // Compute children drop paths
            const childDrops = childrenNodes.map(child => {
                const targetX = child.x;
                const targetY = child.y - NODE_RADIUS - 4; // Node boundary top cap

                return {
                    childId: child.id,
                    targetX,
                    targetY,
                    dropPath: `M ${targetX} ${junctionY} L ${targetX} ${targetY}`,
                    dotCap: { x: targetX, y: targetY }
                };
            });

            const leftmostChildX = Math.min(...childrenNodes.map(c => c.x));
            const rightmostChildX = Math.max(...childrenNodes.map(c => c.x));

            familyJunctions.push({
                id: `fj_${group.id}`,
                groupId: group.id,
                stemStartX,
                stemStartY,
                junctionY,
                stemPath: `M ${stemStartX} ${stemStartY} L ${stemStartX} ${junctionY}`,
                hasHorizontalBar: childrenNodes.length > 1,
                barStartX: leftmostChildX,
                barEndX: rightmostChildX,
                barPath: `M ${leftmostChildX} ${junctionY} L ${rightmostChildX} ${junctionY}`,
                childDrops,
                flourishPoint: { x: stemStartX, y: junctionY }
            });
        }
    });

    // 3. Ancestor Edges (Grandparent -> Parent / Parent -> Subject)
    finalNodes.forEach(node => {
        if (node.generation <= -2 || (node.parentIds.length > 0 && !partnerGroups.some(pg => pg.childrenIds.includes(node.id)))) {
            node.parentIds.forEach(pId => {
                const parent = finalNodes.find(fn => fn.id === pId);
                if (!parent) return;

                const originX = parent.x;
                const originY = parent.y + NODE_RADIUS + 88; // Origin drops cleanly below parent text label!
                const targetX = node.x;
                const targetY = node.y - NODE_RADIUS - 4;
                const midY = originY + (targetY - originY) * 0.5;

                ancestorEdges.push({
                    id: `anc_${parent.id}_${node.id}`,
                    fromId: parent.id,
                    toId: node.id,
                    originX,
                    originY,
                    targetX,
                    targetY,
                    pathData: `M ${originX} ${originY} C ${originX} ${midY}, ${targetX} ${midY}, ${targetX} ${targetY}`,
                    dotCap: { x: targetX, y: targetY },
                    flourish: { x: originX, y: midY }
                });
            });
        }
    });

    graph.edges = {
        partner: partnerEdges,
        familyJunctions,
        ancestor: ancestorEdges
    };
}

/**
 * Step 7: Validate Family Graph & Mark Disconnected Nodes
 */
function validateFamilyGraph(graph) {
    const { finalNodes, edges, genLevels, mainPersonId } = graph;
    const { Y_START, GENERATION_GAP } = LAYOUT_CONFIG;

    const connectedNodeIds = new Set();
    connectedNodeIds.add(mainPersonId);

    // Collect all nodes referenced in edges
    edges.partner.forEach(e => { connectedNodeIds.add(e.fromId); connectedNodeIds.add(e.toId); });
    edges.familyJunctions.forEach(fj => {
        const group = graph.partnerGroups.find(g => g.id === fj.groupId);
        if (group) group.memberIds.forEach(id => connectedNodeIds.add(id));
        fj.childDrops.forEach(cd => connectedNodeIds.add(cd.childId));
    });
    edges.ancestor.forEach(e => { connectedNodeIds.add(e.fromId); connectedNodeIds.add(e.toId); });

    const disconnectedNodes = [];
    finalNodes.forEach(node => {
        if (!connectedNodeIds.has(node.id)) {
            node.isDisconnected = true;
            disconnectedNodes.push(node);
        }
    });

    // Generate Generation Banners placed midway between generation levels
    const generationBanners = genLevels.map((level, idx) => {
        const nodesInGen = finalNodes.filter(n => n.generation === level && !n.isDisconnected);
        const genY = nodesInGen[0] ? nodesInGen[0].y : Y_START + idx * GENERATION_GAP;

        let label = 'MAIN GENERATION';
        if (level < 0) {
            label = level === -1 ? 'PARENTS & ANCESTORS' : `ANCESTORS (GEN ${level})`;
        } else if (level > 0) {
            label = level === 1 ? 'DESCENDANTS (GEN +1)' : `DESCENDANTS (GEN +${level})`;
        }

        const bannerY = idx === 0 ? genY - 130 : genY - (GENERATION_GAP / 2);

        return {
            level,
            label,
            y: bannerY,
            x: 0
        };
    });

    // Compute view bounding box
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    finalNodes.forEach(node => {
        if (node.x - 180 < minX) minX = node.x - 180;
        if (node.x + 180 > maxX) maxX = node.x + 180;
        if (node.y - 160 < minY) minY = node.y - 160;
        if (node.y + 240 > maxY) maxY = node.y + 240;
    });

    if (!isFinite(minX)) {
        minX = -450; maxX = 450; minY = 0; maxY = 600;
    }

    const canvasWidth = Math.max(maxX - minX, 1000);
    const canvasHeight = Math.max(maxY - minY, 700);

    graph.output = {
        nodes: finalNodes,
        nodesById: graph.nodesById,
        mainPersonId,
        mainPerson: graph.nodesById[mainPersonId] || null,
        edges,
        partnerGroups: graph.partnerGroups,
        generationBanners,
        disconnectedNodes,
        bounds: {
            minX,
            maxX,
            minY,
            maxY,
            canvasWidth,
            canvasHeight
        }
    };
}

export default calculateFamilyTreeLayout;
