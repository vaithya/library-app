import express from 'express';
import { requestHandler } from '../middleware/handlers.js';
import MemberFunctions from '../logic/member.js';

export const memberRouter = () => {

	const memberRouter = express.Router();

	memberRouter.post   ('/members',     (req, res) => requestHandler(req, res, MemberFunctions.registerMember));
	memberRouter.delete ('/members/:id', (req, res) => requestHandler(req, res, MemberFunctions.unRegisterMember));

	return memberRouter;
};
