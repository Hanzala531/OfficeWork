import {NewsLetter} from "../models/newsLetter.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {ApiResponse} from "../utils/ApiResponse.js";

// For displaying all the subcribers

const getEmailAddresses = asyncHandler(async (req, res) => {
    try {
        const subscribers = await NewsLetter.find();

        if (subscribers.length === 0) {
            return res.status(404).json(new ApiResponse(404, null, "No subscribers found"));
        }
        
        res.json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"));    
    } catch (error) {
        console.error("Error in finding subscribers", error);
        res.status(500).json(new ApiError(500, "Something went wrong while fetching subscribers"));
    }
});


// For adding a new subcriber
const addEmail = asyncHandler(async (req, res) => {
    try {
        const { email } = req.body;
        console.log("Adding a new subscriber");

        // Get the next subscriber number safely
        const lastSubscriber = await NewsLetter.findOne({}, "subscriberNo", { sort: { subscriberNo: -1 } });
        const newSubscriberNo = lastSubscriber ? lastSubscriber.subscriberNo + 1 : 1;

        const newEmail = new NewsLetter({ email, subscriberNo: newSubscriberNo });
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
        console.log("Delete request received for ID:", req.params.id);

        // Find and delete the subscriber
        const subscriber = await NewsLetter.findByIdAndDelete(req.params.id);
        if (!subscriber) {
            console.log("Subscriber not found for ID:", req.params.id);
            return res.status(404).json(new ApiResponse(404, null, "Subscriber not found"));
        }

        // Fetch all remaining subscribers sorted by subscriberNo
        const remainingSubscribers = await NewsLetter.find().sort({ subscriberNo: 1 });

        // Update index numbers of remaining emails
        for (let i = 0; i < remainingSubscribers.length; i++) {
            remainingSubscribers[i].subscriberNo = i + 1; // Adjust numbering
            await remainingSubscribers[i].save();
        }

        res.status(200).json(new ApiResponse(200, null, "Subscriber deleted and subscriber numbers updated successfully"));
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