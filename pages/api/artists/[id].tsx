import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { id } = req.query;

    // Validate that id exists and is a string
    if (!id || typeof id !== "string") {
        return res.status(400).json({ error: "Invalid or missing artist ID" });
    }

    // Validate that id is a valid ObjectId format
    if (!ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid ObjectId format" });
    }

    try {
        const client = await clientPromise;
        const db = client.db("musicapp");

        // Use findOne since you're looking for a single artist by ID
        const artist = await db
            .collection("artists")
            .findOne({ _id: new ObjectId(id) });

        // Check if artist was found
        if (!artist) {
            return res.status(400).json({ error: "Artist not found" });
        }

        res.status(200).json(artist);
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}