import clientPromise from "@/lib/mongodb";

const dataByName = async (value: string) => {
    try {
        const client = await clientPromise;
        const db = client.db("musicapp");
        const data = await db.collection("artists").findOne({name: value});
        return JSON.parse(JSON.stringify(data));
    } catch (e) {
        console.error(e);
    }
}

export default dataByName;