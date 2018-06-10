import logger from '../logger.js';
import { db } from '../db/db.js';
import HttpStatus from 'http-status-codes';
import { validateMember } from '../validators/memberValidator.js';
import Sequelize from 'sequelize';

class Member {

	static async registerMember (req) {

		const { username = '', contactNumber = '' } = req.body;

		let existingMember;
		let validationError;

		try {
			validationError = validateMember({ username, contactNumber });
		}
		catch (error) {
			throw Error(error);
		}

		if (validationError) {
			return {
				status: HttpStatus.UNPROCESSABLE_ENTITY,
				result: 'Invalid input.',
				error: validationError,
			};
		}

		try {

			existingMember = await db.member.findOne({
				where: {
					username,
					unRegisteredYN: { [Sequelize.Op.ne]: true },
				},
			});

			if (existingMember) {
				return {
					status: HttpStatus.OK,
					result: 'The requested user is already a registered member.',
				};
			}

			await db.member.create({
				username,
				contactNumber,
			});

			return {
				status: HttpStatus.CREATED,
				result: 'The requested user has been registered.',
			};

		}
		catch (error) {

			logger.error(error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				result: 'Unable to register this user at the moment.',
				error,
			};

		}
	}

	static async unRegisterMember (req) {
		const memberId = req.params.id;

		try {

			const existingMember = await db.member.findOne({
				where: {
					id: memberId,
				},
			});

			if (!existingMember) {
				return {
					status: HttpStatus.BAD_REQUEST,
					result: 'This user is not already registered with us.',
				};
			}

			if (existingMember.unRegisteredYN) {
				return {
					status: HttpStatus.OK,
					result: 'This user has already unregistered with us.',
				};
			}

			await db.member.update({
				unRegisteredYN: true,
			}, {
				where: {
					id: memberId,
				},
			});

			return {
				status: HttpStatus.OK,
				result: 'The requested user has been unregistered.',
			};

		}
		catch (error) {

			logger.error(error);
			return {
				status: HttpStatus.INTERNAL_SERVER_ERROR,
				result: 'Unable to unregister this user at the moment.',
				error,
			};

		}
	}
}

export default Member;
