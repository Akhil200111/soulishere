import mongoose from 'mongoose';

/**
 * Validates and normalizes familyMembers array for lineage tree schema.
 * Ensures backward compatibility with flat/legacy family member records.
 *
 * @param {Array} familyMembers
 * @returns {Array} normalizedFamilyMembers
 * @throws {Error} if validation fails
 */
export function processFamilyMembers(familyMembers) {
    if (!familyMembers) return undefined;
    if (!Array.isArray(familyMembers)) {
        throw new Error('familyMembers must be an array');
    }

    // Step 1: Normalize properties and assign unique IDs to any member missing an id
    const normalized = familyMembers.map((member) => {
        const id = (member.id && String(member.id).trim() !== '')
            ? String(member.id).trim()
            : new mongoose.Types.ObjectId().toString();

        const parentIds = Array.isArray(member.parentIds)
            ? member.parentIds.map(p => String(p).trim()).filter(Boolean)
            : [];

        const spouseIds = Array.isArray(member.spouseIds)
            ? member.spouseIds.map(s => String(s).trim()).filter(Boolean)
            : [];

        let generation = 0;
        if (typeof member.generation === 'number' && !isNaN(member.generation)) {
            generation = member.generation;
        } else if (member.generation !== undefined && member.generation !== null && member.generation !== '') {
            const parsed = parseInt(member.generation, 10);
            if (!isNaN(parsed)) generation = parsed;
        }

        return {
            id,
            relationship: member.relationship ? String(member.relationship) : '',
            name: member.name ? String(member.name) : '',
            dates: member.dates ? String(member.dates) : '',
            gender: member.gender ? String(member.gender) : '',
            avatarUrl: member.avatarUrl ? String(member.avatarUrl) : '',
            parentIds,
            spouseIds,
            generation,
            memorialRefId: member.memorialRefId || null,
            bio: member.bio ? String(member.bio) : ''
        };
    });

    // Step 2: Validate unique member IDs and self-referencing
    const idSet = new Set();
    for (const member of normalized) {
        if (idSet.has(member.id)) {
            throw new Error(`Duplicate family member ID: "${member.id}"`);
        }
        idSet.add(member.id);

        if (member.parentIds.includes(member.id)) {
            throw new Error(`Family member "${member.name || member.id}" cannot reference itself in parentIds`);
        }

        if (member.spouseIds.includes(member.id)) {
            throw new Error(`Family member "${member.name || member.id}" cannot reference itself in spouseIds`);
        }
    }

    // Step 3: Validate that parentIds and spouseIds reference valid member IDs in the list
    for (const member of normalized) {
        for (const parentId of member.parentIds) {
            if (!idSet.has(parentId)) {
                throw new Error(`Family member "${member.name || member.id}" references an invalid parentId: "${parentId}"`);
            }
        }
        for (const spouseId of member.spouseIds) {
            if (!idSet.has(spouseId)) {
                throw new Error(`Family member "${member.name || member.id}" references an invalid spouseId: "${spouseId}"`);
            }
        }
    }

    return normalized;
}
