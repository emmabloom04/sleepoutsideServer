import { Router } from "express";
import userService from "../services/user.service.mts";
import { sanitize } from "../services/utils.mts";
import EntityNotFoundError from "../errors/EntityNotFoundError.mts";
import authorize from "../middleware/authorize.mts";

const router = Router();

router.post('/login', async (req, res, next) => {
   try
   {
      const cleanBody = sanitize(req.body);
      const {email, password} = cleanBody;

      const results = await userService.login(email, password);
      console.log(results);

      if (!results.token || !results.user){
         return next(new EntityNotFoundError({message: "User not found or bad password", code: "ERR_NF", statusCode: 401}));
      }
      res.status(200).json(results);
   } catch(err) {
      next(err);
   }
});

router.post("/", async (req,res,next) => {
    try {
     const cleanBody = sanitize(req.body)
    const {email, name, password} = cleanBody;
 
    const newUser = await userService.register(email, password, name)
    res.status(200).json({message:"User created successfully", userId: newUser.insertedId});
    } catch(err) {
        next(err)
    }
})
 
router.get('/protected', authorize, (req, res) => {
    console.log(res.locals.user)
  res.json({ message: `Hello, ${res.locals.user.email}!` });
});
 
export default router