// src/knowledge/seedExercises.ts
// Run only when exercises.ts changes.
// PowerShell command:
// $env:CONFIRM_EXERCISE_SEED='true'; npm run seed:exercises

import * as dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import exercises from './exercises'

const requiredEnv = ['DATABASE_URL'] as const

for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
}

const databaseUrl = process.env.DATABASE_URL as string

const exerciseSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  displayName: { type: String, required: true },
  bodyPart: { type: String, enum: ['upper_body', 'lower_body'], required: true },
  category: { type: String, enum: ['primary', 'assistance', 'remedial'], required: true },
  subCategory: { type: String, required: true },
  equipment: [{ type: String }],
  level: [{ type: String, enum: ['beginner', 'intermediate', 'advanced'] }],
  isPrimeight: { type: Boolean, default: false },
  gripType: { type: String },
  gripWidth: { type: String },
  isUnilateral: { type: Boolean, default: false },
  notes: { type: String },
}, {
  timestamps: true,
})

exerciseSchema.index({ category: 1, bodyPart: 1 })
exerciseSchema.index({ subCategory: 1 })
exerciseSchema.index({ equipment: 1 })
exerciseSchema.index({ level: 1 })
exerciseSchema.index({ isPrimeight: 1 })

const Exercise = mongoose.model('Exercise', exerciseSchema)

async function seedExercises(): Promise<void> {
  if (process.env.CONFIRM_EXERCISE_SEED !== 'true') {
    throw new Error(
      'Refusing to replace exercises. Re-run with CONFIRM_EXERCISE_SEED=true when you intentionally want to reseed.',
    )
  }

  try {
    await mongoose.connect(databaseUrl)
    console.log('Connected to MongoDB')

    await Exercise.bulkWrite([
      { deleteMany: { filter: {} } },
      ...exercises.map(exercise => ({
        insertOne: {
          document: exercise,
        },
      })),
    ], { ordered: true })

    console.log(`Inserted ${exercises.length} exercises successfully`)

    const counts = await Exercise.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ])

    console.log('\nBreakdown by category:')
    counts.forEach(category => console.log(`  ${category._id}: ${category.count}`))

    const primeightCount = await Exercise.countDocuments({ isPrimeight: true })
    console.log(`\nPRIMEIGHT exercises: ${primeightCount}`)
  } finally {
    await mongoose.disconnect()
    console.log('\nDone. Disconnected from MongoDB.')
  }
}

seedExercises().catch(error => {
  console.error('Seed failed:', error)
  process.exit(1)
})
