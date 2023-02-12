import { findRecordByFilter, getMinifiedRecords, table } from "../../lib/airtable";

const favouriteCoffeeStoreByID = async (req, res) => {
    if (req.method === "PUT") {
        const { id } = req.body;

        try {
            if (id) {
                const records = await findRecordByFilter(id);

                if (records.length > 0) {
                    const record = records[0];
                    const calculateVoting = +record.votes + 1;

                    const updateRecord = await table.update([{
                        id: record.recordID,
                        fields: {
                            votes: calculateVoting
                        }
                    }]);

                    if (updateRecord) {
                        const minifiedRecords = getMinifiedRecords(updateRecord);
                        res.status(200).json(minifiedRecords);
                    }
                } else {
                    res.status(400).json({ message: `Coffee Store with ID ${id} doesn't exist` });
                }
            }
            else {
                res.status(400).json({ message: "ID is missing" });
            }
        }
        catch (error) {
            console.error("Error finding store", error)
            res.status(500).json({ message: "Error upvoting coffee store", error });
        }
    }
};

export default favouriteCoffeeStoreByID;