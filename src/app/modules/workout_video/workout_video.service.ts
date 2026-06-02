import httpStatus from 'http-status';
import QueryBuilder from '../../builder/QueryBuilder';
import AppError from '../../error/appError';
import { workoutVideoSearchableFields } from './workout_video.constant';
import { IWorkoutVideo } from './workout_video.interface';
import { WorkoutVideo } from './workout_video.model';

const normalizeSlug = (slug: string) => slug.trim().toLowerCase();

const createWorkoutVideo = async (payload: IWorkoutVideo) => {
  const slug = normalizeSlug(payload.slug);
  const isSlugExist = await WorkoutVideo.findOne({ slug });

  if (isSlugExist) {
    throw new AppError(httpStatus.CONFLICT, 'Workout video slug already exists');
  }

  const result = await WorkoutVideo.create({
    ...payload,
    slug,
  });
  return result;
};

const getAllWorkoutVideos = async (query: Record<string, unknown>) => {
  const workoutVideoQuery = new QueryBuilder(WorkoutVideo.find(), query)
    .search(workoutVideoSearchableFields)
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await workoutVideoQuery.modelQuery;
  const meta = await workoutVideoQuery.countTotal();

  return {
    meta,
    result,
  };
};

const getSingleWorkoutVideo = async (id: string) => {
  const result = await WorkoutVideo.findById(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Workout video not found');
  }

  return result;
};

const updateWorkoutVideo = async (
  id: string,
  payload: Partial<IWorkoutVideo>,
) => {
  if (payload.slug) {
    payload.slug = normalizeSlug(payload.slug);

    const isSlugExist = await WorkoutVideo.findOne({
      slug: payload.slug,
      _id: { $ne: id },
    });

    if (isSlugExist) {
      throw new AppError(httpStatus.CONFLICT, 'Workout video slug already exists');
    }
  }

  const result = await WorkoutVideo.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Workout video not found');
  }

  return result;
};

const deleteWorkoutVideo = async (id: string) => {
  const result = await WorkoutVideo.findByIdAndDelete(id);

  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, 'Workout video not found');
  }

  return result;
};

export const workoutVideoServices = {
  createWorkoutVideo,
  getAllWorkoutVideos,
  getSingleWorkoutVideo,
  updateWorkoutVideo,
  deleteWorkoutVideo,
};
