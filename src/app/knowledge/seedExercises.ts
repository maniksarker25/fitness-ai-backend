// src/knowledge/seedExercises.ts
// Run ONE time only to insert all exercises into MongoDB
// Command: npx ts-node src/knowledge/seedExercises.ts

import * as dotenv from 'dotenv'
dotenv.config()

import mongoose from 'mongoose'
import exercises from './exercises'

// ── Exercise Schema ───────────────────────────────────────────

const exerciseSchema = new mongoose.Schema({
  name:          { type: String, required: true, unique: true },
  displayName:   { type: String, required: true },
  bodyPart:      { type: String, enum: ['upper_body', 'lower_body'], required: true },
  category:      { type: String, enum: ['primary', 'assistance', 'remedial'], required: true },
  subCategory:   { type: String, required: true },
  equipment:     [{ type: String }],
  level:         [{ type: String, enum: ['beginner', 'intermediate', 'advanced'] }],
  isPrimeight:   { type: Boolean, default: false },
  gripType:      { type: String },
  gripWidth:     { type: String },
  isUnilateral:  { type: Boolean, default: false },
  notes:         { type: String }
}, {
  timestamps: true
})

// Indexes for fast querying when building plans
exerciseSchema.index({ category: 1, bodyPart: 1 })
exerciseSchema.index({ subCategory: 1 })
exerciseSchema.index({ equipment: 1 })
exerciseSchema.index({ level: 1 })
exerciseSchema.index({ isPrimeight: 1 })

const Exercise = mongoose.model('Exercise', exerciseSchema)

// ── Seed function ─────────────────────────────────────────────

async function seedExercises(): Promise<void> {
  try {
    await mongoose.connect(process.env.DATABASE_URL!)
    console.log('Connected to MongoDB')

    // Clear existing exercises
    await Exercise.deleteMany({})
    console.log('Cleared existing exercises')

    // Insert all exercises
    await Exercise.insertMany(exercises)
    console.log(`✓ Inserted ${exercises.length} exercises successfully`)

    // Quick verification
    const counts = await Exercise.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ])
    console.log('\nBreakdown by category:')
    counts.forEach(c => console.log(`  ${c._id}: ${c.count}`))

    const primeightCount = await Exercise.countDocuments({ isPrimeight: true })
    console.log(`\nPRIMEIGHT exercises: ${primeightCount}`)

  } catch (error) {
    console.error('Seed failed:', error)
  } finally {
    await mongoose.disconnect()
    console.log('\nDone. Disconnected from MongoDB.')
  }
}

seedExercises()