import { findRecordByFilter } from "../../lib/airtable";

const getCoffeeStoreByID = async (req, res) => {
    const { id } = req.query;
    try {
        if (id && id !== undefined) {
            const records = await findRecordByFilter(id);

            if (records.length > 0) {
                res.status(200).json(records);
            }
            else {
                res.status(400).json({ message: "ID could not be found" });
            }
        }
        else {
            res.status(400).json({ message: "ID is missing" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong", error })
    }
};

export default getCoffeeStoreByID;