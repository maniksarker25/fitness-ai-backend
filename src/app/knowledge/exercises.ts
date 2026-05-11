
// All exercises from KILO Exercise Database (PDF 3)
// Store these directly into MongoDB exercises collection
// Run: npx ts-node src/knowledge/seedExercises.ts

// ── Types ─────────────────────────────────────────────────────

export type BodyPart = 'upper_body' | 'lower_body'

export type Category = 'primary' | 'assistance' | 'remedial'

export type SubCategory =
  // upper body
  | 'pushing'
  | 'pulling'
  | 'triceps'
  | 'biceps'
  | 'lateral_deltoid'
  | 'posterior_deltoid'
  | 'pectorals'
  | 'upper_back'
  | 'external_rotators'
  | 'scapular_retractors'
  | 'neck'
  | 'forearms'
  // lower body
  | 'quad_dominant'
  | 'hip_dominant'
  | 'knee_extension'
  | 'knee_flexion'
  | 'specialty_squat'
  | 'specialty_deadlift'
  | 'hip_extension'
  | 'calves'
  | 'abdominals'

export type Equipment =
  | 'barbell'
  | 'dumbbell'
  | 'cable'
  | 'machine'
  | 'bodyweight'
  | 'rings'
  | 'swiss_ball'
  | 'med_ball'
  | 'foam_roller'
  | 'bands'
  | 'trap_bar'
  | 'safety_bar'
  | 'cambered_bar'
  | 'ez_bar'
  | 'thick_bar'
  | 'parallel_bar'
  | 'dip_bar'
  | 'pull_up_bar'
  | 'scott_bench'
  | 'glute_ham'
  | 'leg_press'
  | 'leg_curl'
  | 'pendulum'
  | 'reverse_hyper'

export type Level = 'beginner' | 'intermediate' | 'advanced'

export type GripType = 'pronated' | 'supinated' | 'neutral' | 'semi_pronated' | 'semi_supinated' | 'mixed'

export type GripWidth = 'close' | 'medium' | 'wide'

export interface Exercise {
  name: string                    // full technical name from KILO database
  displayName: string             // short human readable name
  bodyPart: BodyPart
  category: Category
  subCategory: SubCategory
  equipment: Equipment[]
  level: Level[]
  isPrimeight: boolean            // one of the 8 primary KILO exercises
  gripType?: GripType
  gripWidth?: GripWidth
  isUnilateral?: boolean          // single arm or leg variation
  notes?: string
}

// ── Exercises ─────────────────────────────────────────────────

const exercises: Exercise[] = [

  // ============================================================
  // UPPER BODY — PRIMARY EXERCISES
  // ============================================================

  // ── Pushing ─────────────────────────────────────────────────

  {
    name: 'Press - Standing - BB - Medium Grip - Pronated',
    displayName: 'Overhead Press',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pushing',
    equipment: ['barbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'pronated',
    gripWidth: 'medium'
  },
  {
    name: 'Press - 35° Incline - BB - Medium Grip - Pronated',
    displayName: 'Incline Press',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pushing',
    equipment: ['barbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'pronated',
    gripWidth: 'medium'
  },
  {
    name: 'Press - Flat - BB - Medium Grip - Pronated',
    displayName: 'Bench Press',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pushing',
    equipment: ['barbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'pronated',
    gripWidth: 'medium'
  },
  {
    name: 'Dip - V Bar - Medium Grip - Semi-Pronated',
    displayName: 'Dip',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pushing',
    equipment: ['dip_bar'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'semi_pronated',
    gripWidth: 'medium'
  },

  // ── Pulling ─────────────────────────────────────────────────

  {
    name: 'Chin-Up - Close Grip - Supinated',
    displayName: 'Chin-Up Close Supinated',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pulling',
    equipment: ['pull_up_bar'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'supinated',
    gripWidth: 'close'
  },
  {
    name: 'Chin-Up - Close Grip - Neutral',
    displayName: 'Chin-Up Close Neutral',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pulling',
    equipment: ['pull_up_bar'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'neutral',
    gripWidth: 'close'
  },
  {
    name: 'Chin-Up - Medium Grip - Supinated',
    displayName: 'Chin-Up Medium Supinated',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pulling',
    equipment: ['pull_up_bar'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'supinated',
    gripWidth: 'medium'
  },
  {
    name: 'Chin-Up - Medium Grip - Neutral',
    displayName: 'Chin-Up Medium Neutral',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pulling',
    equipment: ['pull_up_bar'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'neutral',
    gripWidth: 'medium'
  },
  {
    name: 'Chin-Up - Wide Grip - Supinated',
    displayName: 'Chin-Up Wide Supinated',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pulling',
    equipment: ['pull_up_bar'],
    level: ['intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'supinated',
    gripWidth: 'wide'
  },
  {
    name: 'Chin-Up - Wide Grip - Neutral',
    displayName: 'Chin-Up Wide Neutral',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pulling',
    equipment: ['pull_up_bar'],
    level: ['intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'neutral',
    gripWidth: 'wide'
  },
  {
    name: 'Pull-Up - Close Grip - Pronated',
    displayName: 'Pull-Up Close',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pulling',
    equipment: ['pull_up_bar'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'close'
  },
  {
    name: 'Pull-Up - Medium Grip - Pronated',
    displayName: 'Pull-Up Medium',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pulling',
    equipment: ['pull_up_bar'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'medium'
  },
  {
    name: 'Pull-Up - Wide Grip - Pronated',
    displayName: 'Pull-Up Wide',
    bodyPart: 'upper_body',
    category: 'primary',
    subCategory: 'pulling',
    equipment: ['pull_up_bar'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'wide'
  },

  // ============================================================
  // UPPER BODY — ASSISTANCE EXERCISES
  // ============================================================

  // ── Overhead Press Assistance ────────────────────────────────

  {
    name: 'Press - Seated - DB',
    displayName: 'Seated DB Press',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Press - Seated - Arnold - DB',
    displayName: 'Arnold Press',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Press - Standing - DB - One-Arm',
    displayName: 'Single Arm DB Press',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    isUnilateral: true
  },

  // ── Incline Press Assistance ─────────────────────────────────

  {
    name: 'Press - 35° Incline - DB',
    displayName: 'Incline DB Press 35°',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Press - 45° Incline - DB',
    displayName: 'Incline DB Press 45°',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Press - 55° Incline - DB',
    displayName: 'Incline DB Press 55°',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── Flat Press Assistance ────────────────────────────────────

  {
    name: 'Press - Flat - DB',
    displayName: 'Flat DB Press',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Press - Flat - BB - Close Grip',
    displayName: 'Close Grip Bench Press',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'close'
  },
  {
    name: 'Press - Flat - DB - Swiss Ball',
    displayName: 'Swiss Ball DB Press',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell', 'swiss_ball'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── Decline Press Assistance ─────────────────────────────────

  {
    name: 'Press - 15° Decline - DB',
    displayName: 'Decline DB Press 15°',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Press - 25° Decline - DB',
    displayName: 'Decline DB Press 25°',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── Push-Up Assistance ───────────────────────────────────────

  {
    name: 'Push-Up',
    displayName: 'Push-Up',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['bodyweight'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Push-Up - Swiss Ball',
    displayName: 'Swiss Ball Push-Up',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['bodyweight', 'swiss_ball'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Push-Up - Rings',
    displayName: 'Ring Push-Up',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pushing',
    equipment: ['rings'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── Rowing Assistance ────────────────────────────────────────

  {
    name: 'Row - Bent-Over - DB - Neutral - One-Arm',
    displayName: 'DB Row One Arm Neutral',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'neutral',
    isUnilateral: true
  },
  {
    name: 'Row - Bent-Over - DB - Supinating - One-Arm',
    displayName: 'DB Row One Arm Supinating',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'supinated',
    isUnilateral: true
  },
  {
    name: 'Row - Bent-Over - BB - Medium Grip - Supinated',
    displayName: 'Barbell Row Supinated',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'supinated',
    gripWidth: 'medium'
  },
  {
    name: 'Row - Bent-Over - BB - Medium Grip - Pronated',
    displayName: 'Barbell Row Pronated',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'medium'
  },
  {
    name: 'Row - Seated - Close Grip - Neutral',
    displayName: 'Seated Cable Row Close Neutral',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'neutral',
    gripWidth: 'close'
  },
  {
    name: 'Row - Seated - Medium Grip - Pronated',
    displayName: 'Seated Cable Row Medium Pronated',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'medium'
  },
  {
    name: 'Row - Seated - Wide Grip - Pronated',
    displayName: 'Seated Cable Row Wide Pronated',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'wide'
  },

  // ── Pulldown Assistance ──────────────────────────────────────

  {
    name: 'Pulldown - Close Grip - Neutral',
    displayName: 'Pulldown Close Neutral',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'neutral',
    gripWidth: 'close'
  },
  {
    name: 'Pulldown - Medium Grip - Supinated',
    displayName: 'Pulldown Medium Supinated',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'supinated',
    gripWidth: 'medium'
  },
  {
    name: 'Pulldown - Medium Grip - Pronated',
    displayName: 'Pulldown Medium Pronated',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'medium'
  },
  {
    name: 'Pulldown - Wide Grip - Pronated',
    displayName: 'Pulldown Wide Pronated',
    bodyPart: 'upper_body',
    category: 'assistance',
    subCategory: 'pulling',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'wide'
  },

  // ============================================================
  // UPPER BODY — REMEDIAL EXERCISES
  // ============================================================

  // ── Triceps ─────────────────────────────────────────────────

  {
    name: 'Pressdown - High Pulley - Pronated - One-Arm',
    displayName: 'Cable Pressdown One Arm',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'triceps',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    isUnilateral: true
  },
  {
    name: 'Pressdown - High Pulley - Close Grip - Pronated',
    displayName: 'Cable Pressdown Close Pronated',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'triceps',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'close'
  },
  {
    name: 'Triceps Extension - Flat - DB',
    displayName: 'Flat DB Triceps Extension',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'triceps',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Triceps Extension - Flat - EZ Bar - Close Grip - Semi-Pronated',
    displayName: 'Skull Crusher EZ Bar',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'triceps',
    equipment: ['ez_bar'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'semi_pronated',
    gripWidth: 'close'
  },
  {
    name: 'Triceps Extension - 35° Incline - DB',
    displayName: 'Incline DB Triceps Extension',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'triceps',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'French Press - Seated - DB',
    displayName: 'French Press DB',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'triceps',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'French Press - Seated - EZ Bar - Close Grip - Semi-Pronated',
    displayName: 'French Press EZ Bar',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'triceps',
    equipment: ['ez_bar'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'semi_pronated'
  },

  // ── Biceps ───────────────────────────────────────────────────

  {
    name: 'Curl - 45° Incline - DB - Supinated',
    displayName: 'Incline DB Curl 45°',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'biceps',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'supinated'
  },
  {
    name: 'Curl - 45° Incline - DB - Neutral',
    displayName: 'Incline Hammer Curl 45°',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'biceps',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'neutral'
  },
  {
    name: 'Curl - 45° Incline - DB - Zottman',
    displayName: 'Zottman Curl 45°',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'biceps',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Curl - Standing - DB - Supinated',
    displayName: 'Standing DB Curl',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'biceps',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'supinated'
  },
  {
    name: 'Curl - Standing - DB - Neutral',
    displayName: 'Hammer Curl',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'biceps',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'neutral'
  },
  {
    name: 'Curl - Standing - Low Pulley - Supinated - One-Arm',
    displayName: 'Cable Curl One Arm',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'biceps',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'supinated',
    isUnilateral: true
  },
  {
    name: 'Curl - Scott - DB - Supinated',
    displayName: 'Scott Curl DB',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'biceps',
    equipment: ['dumbbell', 'scott_bench'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'supinated'
  },
  {
    name: 'Curl - Scott - EZ Bar - Close Grip - Semi-Supinated',
    displayName: 'Scott Curl EZ Bar',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'biceps',
    equipment: ['ez_bar', 'scott_bench'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'semi_supinated'
  },
  {
    name: 'Curl - Spider - DB - Supinated',
    displayName: 'Spider Curl DB',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'biceps',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'supinated'
  },

  // ── Lateral Deltoid ──────────────────────────────────────────

  {
    name: 'Lateral Raise - Standing - DB',
    displayName: 'Lateral Raise DB',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'lateral_deltoid',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Lateral Raise - Seated - DB',
    displayName: 'Seated Lateral Raise DB',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'lateral_deltoid',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Lateral Raise - Standing - Low Pulley - One-Arm',
    displayName: 'Cable Lateral Raise',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'lateral_deltoid',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    isUnilateral: true
  },

  // ── Pectorals ────────────────────────────────────────────────

  {
    name: 'Fly - Flat - DB',
    displayName: 'Flat DB Fly',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'pectorals',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Fly - 35° Incline - DB',
    displayName: 'Incline DB Fly 35°',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'pectorals',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Fly - 15° Decline - DB',
    displayName: 'Decline DB Fly',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'pectorals',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Fly - Flat - Low Pulley - Rope',
    displayName: 'Cable Fly Flat',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'pectorals',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── External Rotators ────────────────────────────────────────

  {
    name: 'External Rotation - Side Lying - DB - One-Arm',
    displayName: 'Side Lying External Rotation',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'external_rotators',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    isUnilateral: true
  },
  {
    name: 'External Rotation - Sideway - Low Pulley - Neutral - One-Arm',
    displayName: 'Cable External Rotation',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'external_rotators',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    isUnilateral: true
  },
  {
    name: 'External Rotation - Seated - Cuban Press - DB',
    displayName: 'Cuban Press',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'external_rotators',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── Scapular Retractors ──────────────────────────────────────

  {
    name: 'Scapula Retraction - Standing - Facing - Mid Pulley',
    displayName: 'Cable Scapula Retraction',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'scapular_retractors',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Powell Raise - 45° Incline - DB',
    displayName: 'Powell Raise',
    bodyPart: 'upper_body',
    category: 'remedial',
    subCategory: 'scapular_retractors',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },

  // ============================================================
  // LOWER BODY — PRIMARY EXERCISES
  // ============================================================

  {
    name: 'Squat - Back - BB - Medium Stance',
    displayName: 'Back Squat',
    bodyPart: 'lower_body',
    category: 'primary',
    subCategory: 'quad_dominant',
    equipment: ['barbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true
  },
  {
    name: 'Squat - Front - BB - Medium Stance',
    displayName: 'Front Squat',
    bodyPart: 'lower_body',
    category: 'primary',
    subCategory: 'quad_dominant',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: true,
    notes: 'Maximum 6 reps per KILO methodology'
  },
  {
    name: 'Deadlift - Conventional - BB - Medium Grip - Pronated',
    displayName: 'Deadlift',
    bodyPart: 'lower_body',
    category: 'primary',
    subCategory: 'hip_dominant',
    equipment: ['barbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: true,
    gripType: 'pronated',
    gripWidth: 'medium',
    notes: 'Maximum 6 reps per KILO methodology'
  },

  // ============================================================
  // LOWER BODY — ASSISTANCE EXERCISES
  // ============================================================

  // ── Knee Extension (Split Squat / Lunge) ─────────────────────

  {
    name: 'Split Squat - DB',
    displayName: 'Split Squat DB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_extension',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Split Squat - BB',
    displayName: 'Split Squat BB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_extension',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Split Squat - Bulgarian - DB',
    displayName: 'Bulgarian Split Squat DB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_extension',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Split Squat - Bulgarian - BB',
    displayName: 'Bulgarian Split Squat BB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_extension',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Split Squat - Front Foot Elevated - DB',
    displayName: 'Front Foot Elevated Split Squat',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_extension',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Lunge - DB',
    displayName: 'Lunge DB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_extension',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Lunge - BB',
    displayName: 'Lunge BB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_extension',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Lunge - Walking - DB',
    displayName: 'Walking Lunge DB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_extension',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── Knee Flexion ─────────────────────────────────────────────

  {
    name: 'Leg Curl - Lying - Feet Neutral - Dorsiflexed',
    displayName: 'Lying Leg Curl Neutral',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_flexion',
    equipment: ['leg_curl'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Leg Curl - Lying - Feet In - Dorsiflexed',
    displayName: 'Lying Leg Curl Feet In',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_flexion',
    equipment: ['leg_curl'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Leg Curl - Lying - Feet Out - Dorsiflexed',
    displayName: 'Lying Leg Curl Feet Out',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_flexion',
    equipment: ['leg_curl'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Leg Curl - Standing - Foot Neutral - Dorsiflexed',
    displayName: 'Standing Leg Curl',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_flexion',
    equipment: ['leg_curl'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    isUnilateral: true
  },
  {
    name: 'Knee Flexion - Swiss Ball',
    displayName: 'Swiss Ball Leg Curl',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_flexion',
    equipment: ['swiss_ball'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Glute Ham Raise - Knee Flexion',
    displayName: 'Glute Ham Raise',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_flexion',
    equipment: ['glute_ham'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Nordic Curl',
    displayName: 'Nordic Curl',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'knee_flexion',
    equipment: ['bodyweight'],
    level: ['advanced'],
    isPrimeight: false
  },

  // ── Specialty Squat ──────────────────────────────────────────

  {
    name: 'Squat - Hack - BB',
    displayName: 'Hack Squat BB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_squat',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    notes: 'Specialty squat progression position 1'
  },
  {
    name: 'Squat - Pin Touch - BB - Top Range',
    displayName: 'Pin Touch Squat Top Range',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_squat',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    notes: 'Specialty squat progression position 2'
  },
  {
    name: 'Squat - Cyclist - BB',
    displayName: 'Cyclist Squat BB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_squat',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    notes: 'Specialty squat progression position 3'
  },
  {
    name: 'Squat - Pin Touch - BB - Mid Range',
    displayName: 'Pin Touch Squat Mid Range',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_squat',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    notes: 'Specialty squat progression position 4'
  },
  {
    name: 'Squat - Quad - BB',
    displayName: 'Quad Squat BB',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_squat',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    notes: 'Specialty squat progression position 5'
  },
  {
    name: 'Squat - Heel Elevated - BB',
    displayName: 'Heel Elevated Squat',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_squat',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    notes: 'Specialty squat progression position 7'
  },

  // ── Specialty Deadlift ───────────────────────────────────────

  {
    name: 'Deadlift - Rack - Mid Thigh - BB - Wide Grip',
    displayName: 'Rack Pull Mid Thigh Wide',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_deadlift',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'wide',
    notes: 'Specialty deadlift progression position 1'
  },
  {
    name: 'Deadlift - Rack - Above Knee - BB - Medium Grip',
    displayName: 'Rack Pull Above Knee Medium',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_deadlift',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'medium',
    notes: 'Specialty deadlift progression position 2'
  },
  {
    name: 'Deadlift - Rack - Below Knee - BB - Wide Grip',
    displayName: 'Rack Pull Below Knee Wide',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_deadlift',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'wide',
    notes: 'Specialty deadlift progression position 3'
  },
  {
    name: 'Deadlift - Trap Bar - High Handles',
    displayName: 'Trap Bar Deadlift High',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_deadlift',
    equipment: ['trap_bar'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    notes: 'Specialty deadlift progression position 4'
  },
  {
    name: 'Deadlift - 2" Deficit - Medium Grip',
    displayName: 'Deficit Deadlift 2 inch',
    bodyPart: 'lower_body',
    category: 'assistance',
    subCategory: 'specialty_deadlift',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'medium',
    notes: 'Specialty deadlift progression position 8'
  },

  // ============================================================
  // LOWER BODY — REMEDIAL EXERCISES
  // ============================================================

  // ── Hip Extension ────────────────────────────────────────────

  {
    name: 'Deadlift - Romanian - BB - Medium Grip',
    displayName: 'Romanian Deadlift',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'hip_extension',
    equipment: ['barbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    gripType: 'pronated',
    gripWidth: 'medium'
  },
  {
    name: 'Deadlift - Romanian - DB',
    displayName: 'Romanian Deadlift DB',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'hip_extension',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Back Extension - Incline',
    displayName: 'Incline Back Extension',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'hip_extension',
    equipment: ['bodyweight'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Back Extension - Incline - DB',
    displayName: 'Incline Back Extension DB',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'hip_extension',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Back Extension - Horizontal',
    displayName: 'Horizontal Back Extension',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'hip_extension',
    equipment: ['bodyweight'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Hip Extension - Supine',
    displayName: 'Supine Hip Extension',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'hip_extension',
    equipment: ['bodyweight'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Reverse Hyper - Feet Medium',
    displayName: 'Reverse Hyper',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'hip_extension',
    equipment: ['reverse_hyper'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Goodmorning - Standing - BB - Medium Stance',
    displayName: 'Good Morning BB',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'hip_extension',
    equipment: ['barbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── Knee Extension (Leg Press / Step Up) ─────────────────────

  {
    name: 'Leg Press - Medium Stance',
    displayName: 'Leg Press Medium',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'knee_extension',
    equipment: ['leg_press'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Leg Press - Wide Stance',
    displayName: 'Leg Press Wide',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'knee_extension',
    equipment: ['leg_press'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Leg Press - Unilateral',
    displayName: 'Single Leg Press',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'knee_extension',
    equipment: ['leg_press'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false,
    isUnilateral: true
  },
  {
    name: 'Step-Up - Front - DB',
    displayName: 'Front Step Up DB',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'knee_extension',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Step-Up - Petersen - DB',
    displayName: 'Petersen Step Up',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'knee_extension',
    equipment: ['dumbbell'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── Calves ───────────────────────────────────────────────────

  {
    name: 'Calf Raise - Standing - Machine',
    displayName: 'Standing Calf Raise',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'calves',
    equipment: ['machine'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Calf Raise - Seated - Machine',
    displayName: 'Seated Calf Raise',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'calves',
    equipment: ['machine'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Calf Raise - Standing - DB - Unilateral',
    displayName: 'Single Leg Calf Raise DB',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'calves',
    equipment: ['dumbbell'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false,
    isUnilateral: true
  },
  {
    name: 'Anterior Tibialis Raise - Standing',
    displayName: 'Tibialis Raise',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'calves',
    equipment: ['bodyweight'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },

  // ── Abdominals ───────────────────────────────────────────────

  {
    name: 'Plank - Front',
    displayName: 'Front Plank',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'abdominals',
    equipment: ['bodyweight'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Plank - Side',
    displayName: 'Side Plank',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'abdominals',
    equipment: ['bodyweight'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Crunch - Swiss Ball',
    displayName: 'Swiss Ball Crunch',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'abdominals',
    equipment: ['swiss_ball'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Crunch - Kneeling - High Pulley',
    displayName: 'Cable Crunch',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'abdominals',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Leg Raise - Hanging',
    displayName: 'Hanging Leg Raise',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'abdominals',
    equipment: ['pull_up_bar'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Ab Roll-Out',
    displayName: 'Ab Wheel Rollout',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'abdominals',
    equipment: ['bodyweight'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Wood Chop - High Pulley',
    displayName: 'Cable Wood Chop High',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'abdominals',
    equipment: ['cable'],
    level: ['intermediate', 'advanced'],
    isPrimeight: false
  },
  {
    name: 'Pallof Press - Mid Pulley',
    displayName: 'Pallof Press',
    bodyPart: 'lower_body',
    category: 'remedial',
    subCategory: 'abdominals',
    equipment: ['cable'],
    level: ['beginner', 'intermediate', 'advanced'],
    isPrimeight: false
  }

]

export default exercises