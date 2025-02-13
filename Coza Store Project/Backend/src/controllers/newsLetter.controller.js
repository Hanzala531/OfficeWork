import {NewsLetter} from "../models/newsLetter.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

// For displaying all the subcribers

const getEmailAddresses = asyncHandler(async ( req , res ) => {
    try{
        const subcribers = await NewsLetter.find();
    
    if(subcribers.lenght === 0){
        throw new ApiResponse(404, "No subcribers found");
    }
    res.json(new ApiResponse(200, subcribers, "Subcribers fetched successfully"));    

    }
    catch(error){
        console.log("Error in finding subcribers", error);
        throw new ApiError(500, "Something went wrong while fetching subcribers");
    }
})

// For adding a new subcriber
const addEmail = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Adding a new subscriber");

        // Find the current highest subscriberNo
        const lastSubscriber = await NewsLetter.findOne().sort({ subscriberNo: -1 });
        const newSubscriberNo = lastSubscriber ? lastSubscriber.subscriberNo + 1 : 1;

        const newEmail = new NewsLetter({
            email,
            subscriberNo: newSubscriberNo,
        });
        await newEmail.save();
        res.status(201).json(new ApiResponse(201, newEmail, "Subscriber added successfully"));
    } catch (error) {
        console.error("Error in adding subscriber", error);
        res.status(500).json(new ApiError(500, "Something went wrong while adding subscriber"));
    }
});

// For deleting a subcriber

const deleteEmail = asyncHandler(async (req, res) => {
    try {
        console.log("Delete request received for ID:", req.params.id); // Debugging statement
        const subscriber = await NewsLetter.findByIdAndDelete(req.params.id);
        if (!subscriber) {
            console.log("Subscriber not found for ID:", req.params.id); // Debugging statement
            return res.status(404).json(new ApiResponse(404, null, "Subscriber not found"));
        }
        res.status(200).json(new ApiResponse(200, null, "Subscriber deleted successfully"));
    } catch (error) {
        console.error("Error in deleting subscriber", error);
        res.status(500).json(new ApiError(500, "Something went wrong while deleting subscriber"));
    }
});

export {
    getEmailAddresses,
    addEmail,
    deleteEmail,
}