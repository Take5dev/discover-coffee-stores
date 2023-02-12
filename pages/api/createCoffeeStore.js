import { table, getMinifiedRecords, findRecordByFilter } from "../../lib/airtable";

const createCoffeeStore = async (req, res) => {
    if (req.method === "POST") {

        const { id, name, address, neighborhood, votes, imgUrl } = req.body;

        try {
            if (id) {
                const records = await findRecordByFilter(id);

                if (records.length > 0) {
                    res.status(200).json(records);
                } else {
                    if (name) {
                        const createdRecords = await table.create([
                            {
                                fields: {
                                    id,
                                    name,
                                    address,
                                    neighborhood,
                                    votes,
                                    imgUrl
                                }
                            }
                        ]);
                        const records = getMinifiedRecords(createdRecords);
                        res.status(200).json({ records });
                    }
                    else {
                        res.status(401).json({ message: "Name is missing" });
                    }
                }
            }
            else {
                res.status(402).json({ message: "ID is missing" });
            }
        }
        catch (error) {
            console.error("Error creating or finding store", error)
            res.status(500).json({ message: "Something went wrong", error });
        }
    }
};

export default createCoffeeStore;