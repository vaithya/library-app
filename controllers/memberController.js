import express from 'express';
import { requestHandler } from '../middleware/handlers.js';
import MemberFunctions from '../logic/member.js';

export const memberRouter = () => {

	const memberRouter = express.Router();

	/**
	 * @swagger
	 * /api/members:
	 *   post:
	 *     description: Registers a member to the library
	 *     tags:
	 *       - Members
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *        - in: body
	 *          name: body
	 *          schema:
	 *            type: object
	 *            properties:
	 *              username:
	 *                type: string
	 *              contactNumber:
	 *                type: string
	 *     responses:
	 *        "201":
	 *           description: Registered the member successfully.
	 *        "400":
	 *           description: Bad request.
	 *        "422":
	 *           description: Missing/Incorrect input. Member is already registered.
	 *        "500":
	 *           description: Unable to process the request.
	 */
	memberRouter.post ('/members', (req, res) => requestHandler(req, res, MemberFunctions.registerMember));

	/**
	 * @swagger
	 * /api/members/:id:
	 *   delete:
	 *     description: Unregisters a member from the library
	 *     tags:
	 *       - Members
	 *     produces:
	 *       - application/json
	 *     parameters:
	 *       - in: path
	 *         name: member id
	 *         description: The id of the member you want to unregister.
	 *     responses:
	 *        "200":
	 *           description: Unregistered the member successfully. Member is already unregistered.
	 *        "400":
	 *           description: Bad request. Missing/Incorrect input. Member is not registered.
	 *        "500":
	 *           description: Unable to process the request.
	 */
	memberRouter.delete ('/members/:id', (req, res) => requestHandler(req, res, MemberFunctions.unRegisterMember));

	return memberRouter;
};
