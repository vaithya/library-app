import express from 'express';
import { requestHandler } from '../middleware/handlers.js';
import MemberFunctions from '../logic/member.js';

export const memberRouter = () => {

	const memberRouter = express.Router();

	memberRouter.post   ('/members',     async (req, res) => requestHandler(req, res, MemberFunctions.registerMember));
	memberRouter.delete ('/members/:id', async (req, res) => requestHandler(req, res, MemberFunctions.unRegisterMember));

	return memberRouter;
};
