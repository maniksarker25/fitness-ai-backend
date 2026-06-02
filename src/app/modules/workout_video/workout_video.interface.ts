export interface IWorkoutVideo {
  title: string;
  slug: string;

  description: string;

  thumbnail: string;

  video_url: string;
  durationInMinutes: number;
  category:
    | 'push'
    | 'pull'
    | 'legs'
    | 'full-body'
    | 'cardio'
    | 'abs'
    | 'mobility'
    | 'custom';

  difficulty: 'beginner' | 'intermediate' | 'advanced';

  estimatedCalories?: number;

  tags: string[];

  covers: string[];

  exercises: {
    name: string;
    sets: number;
    reps: string;
    restSeconds: number;
    completed?: boolean;
  }[];

  isFeatured: boolean;
  isPublished: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}
