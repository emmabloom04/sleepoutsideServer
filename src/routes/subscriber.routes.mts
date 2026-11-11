import { Router } from "express";
import subscriberService from "../services/subscriber.service.mts";
import { sanitize } from "../services/utils.mts";


const router = Router();



router.post("/", async (req,res,next) => {
    try {
     const cleanBody = sanitize(req.body)
    const {email, name} = cleanBody;
 
    const newUser = await subscriberService.registerSubscriber(email,  name)
    res.status(200).json({message:"Subscriber created successfully", userId: newUser.insertedId});
    } catch(err) {
        next(err)
    }
})
 

export default router