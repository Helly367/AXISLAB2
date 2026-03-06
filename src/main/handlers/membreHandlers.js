import db from "../database/db.js";
import { memberSchema } from "../database/schemas/membreSchema.js";

/* ---------- Validation ---------- */

function validateMember(data) {
    const { error, value } = memberSchema.validate(data, {
        abortEarly: false
    });

    if (error) {
        return {
            isValid: false,
            errors: error.details.map(e => ({
                field: e.path[0],
                message: e.message
            }))
        };
    }

    return { isValid: true, value };
}

/* ---------- CREATE ---------- */

export async function createMember(data) {

    try {

        const validation = validateMember(data);

        if (!validation.isValid)
            return { success: false, errors: validation.errors };

        const cleanData = validation.value;

        const [id] = await db("members").insert({
            ...cleanData,
            competences: JSON.stringify(cleanData.competences),
            competencesRequises: JSON.stringify(cleanData.competencesRequises),
            historique: JSON.stringify(cleanData.historique),
            created_at: new Date(),
            updated_at: new Date()
        });

        return { success: true, id };

    } catch (err) {
        console.error("createMember error", err);

        return {
            success: false,
            error: "Erreur création membre"
        };
    }
}

/* ---------- UPDATE ---------- */

export async function updateMember(id, data) {

    try {

        const validation = validateMember(data);

        if (!validation.isValid)
            return { success: false, errors: validation.errors };

        const cleanData = validation.value;

        await db("members")
            .where({ id })
            .update({
                ...cleanData,
                competences: JSON.stringify(cleanData.competences),
                competencesRequises: JSON.stringify(cleanData.competencesRequises),
                historique: JSON.stringify(cleanData.historique),
                updated_at: new Date()
            });

        return { success: true };

    } catch (err) {
        console.error(err);

        return { success: false, error: "Erreur update membre" };
    }
}

/* ---------- GET ALL ---------- */

export async function getAllMembers() {

    try {

        const rows = await db("members").orderBy("created_at", "desc");

        return {
            success: true,
            data: rows.map(m => ({
                ...m,
                competences: JSON.parse(m.competences || "[]"),
                competencesRequises: JSON.parse(m.competencesRequises || "[]"),
                historique: JSON.parse(m.historique || "[]")
            }))
        };

    } catch (err) {
        return { success: false, error: err.message };
    }
}

/* ---------- DELETE ---------- */

export async function deleteMember(id) {

    try {

        await db("members").where({ id }).delete();

        return { success: true };

    } catch (err) {
        return { success: false, error: err.message };
    }
}

/* ---------- GET BY ID ---------- */

export async function getMemberById(id) {

    try {

        const member = await db("members")
            .where({ id })
            .first();

        if (!member)
            return { success: false, error: "Membre non trouvé" };

        return {
            success: true,
            data: {
                ...member,
                competences: JSON.parse(member.competences || "[]"),
                competencesRequises: JSON.parse(member.competencesRequises || "[]"),
                historique: JSON.parse(member.historique || "[]")
            }
        };

    } catch (err) {
        return { success: false, error: err.message };
    }
}