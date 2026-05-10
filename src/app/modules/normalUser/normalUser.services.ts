import httpStatus from 'http-status';
import { JwtPayload } from 'jsonwebtoken';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { User } from '../user/user.model';
import { normalUserSearchableFields } from './normalUser.constant';

const getAllUsers = async (query: Record<string, unknown>) => {
  const normalUserQuery = new QueryBuilder(User.find(), query)
    .search(normalUserSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await normalUserQuery.modelQuery;
  const meta = await normalUserQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleUser = async (id: string) => {
  const result = await User.findById(id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return result;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const updateUser = async (id: string, payload: any) => {
  const result = await User.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return result;
};

const deleteUser = async (id: string) => {
  const result = await User.findByIdAndUpdate(
    id,
    { isDeleted: true },
    { new: true }
  );
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return result;
};

const getMe = async (userData: JwtPayload) => {
  const result = await User.findById(userData.id);
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'User not found!');
  }
  return result;
};

export const normalUserServices = {
  getAllUsers,
  getSingleUser,
  updateUser,
  deleteUser,
};
