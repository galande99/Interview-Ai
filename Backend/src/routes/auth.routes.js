const {Router} = require("express")
const authController = require("../controllers/auth.controllers")
const authMiddleware = require("../middlewares/auth.middleware")
const authRouter = Router()



/**
 * @route POST /api/auth/register
 * @description register a new user
 * @access  public
 */


authRouter.post("/register",authController.registerUserController)


/**
 * @route POST /api/auth/login
 * @description login a user
 * @access  public
 */

authRouter.post("/login",authController.loginUserController) 



/**
 * @route POST /api/auth/logout
 * @description logout a user
 * @access  public  
 */

authRouter.get("/logout",authController.logoutUserController)



/**
 * @route GET /api/auth/get-me
 * @description get the current logged-in user's information
 * @access  private
 */


authRouter.get("/get-me",authMiddleware.authUser, authController.getMeController)

module.exports = authRouter