import { NextApiRequest, NextApiResponse } from "next";
import clientPromise from '@/lib/mongodb';
import type { ArtistOid } from "@/lib/types";

async function getArtists(): Promise<ArtistOid[]> {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db
            .collection("artists")
            .find({})
            .limit(10)
            .toArray();
        return JSON.parse(JSON.stringify(artists));
    } catch (e) {
        console.error(e);
        return [];
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "GET") {
        try {
            const artists = await getArtists();
            res.status(200).json(artists);
        } catch (error) {
            res.status(500).json({ error: "Failed to fetch artists "});
        }
    } else {
        res.setHeader("Allow", ["GET"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}