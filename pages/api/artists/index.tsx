import clientPromise from "../../../lib/mongodb";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const artists = await db
            .collection("artists")
            .find({})
            .sort({ artist: 1 })
            .limit(10)
            .toArray();
        res.json(artists);
    } catch (e) {
        console.error(e);
    }
}