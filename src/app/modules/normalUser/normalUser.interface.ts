// normalUser.interface.ts

import { Types } from "mongoose"
import {
  ENUM_ACTIVITY_LEVEL,
  ENUM_EQUIPMENT,
  ENUM_EXPERIENCE_LEVEL,
  ENUM_FITNESS_GOAL,
  ENUM_GENDER
} from "./normalUser.enum"

export interface INormalUser {

  userId:          Types.ObjectId
  email:           string
  name:            string
  phone:           string
  profile_image?:  string
  bio?:            string
  gender?:  (typeof ENUM_GENDER)[keyof typeof ENUM_GENDER]
  age:      number      
  height:   number     
  weight:   number     
  fitnessGoal: (typeof ENUM_FITNESS_GOAL)[keyof typeof ENUM_FITNESS_GOAL]
  experienceLevel: (typeof ENUM_EXPERIENCE_LEVEL)[keyof typeof ENUM_EXPERIENCE_LEVEL]
  daysPerWeek: 2 | 3 | 4 | 5
  availableEquipment: (typeof ENUM_EQUIPMENT)[keyof typeof ENUM_EQUIPMENT][]
  preferredWorkoutTime: string
  injuries: string[]
  additionalNoteForInjuries?: string
  activityLevel: (typeof ENUM_ACTIVITY_LEVEL)[keyof typeof ENUM_ACTIVITY_LEVEL]
  dietaryPreferences: string[]   
  mealsPerDay:        number     
  wakeUpTime:         string     
  bedTime:            string     
  includeWarmup?: boolean        
}