// ============================================================
// src/knowledge/chunks.ts
// Complete knowledge base for KILO Strength Society RAG system
// PDF 1 — Rep Schemes Database
// PDF 2 — Program Design Resource
// ============================================================

// ── Types ────────────────────────────────────────────────────

export type Goal =
  | 'hypertrophy'
  | 'strength'
  | 'functional_hypertrophy'
  | 'endurance'
  | 'power'
  | 'all'

export type Level = 'beginner' | 'intermediate' | 'advanced' | 'all'

export type Phase = 'accumulation' | 'intensification' | 'both'

export interface ChunkMetadata {
  source: string
  section: string
  goal: Goal | Goal[]
  level: Level | Level[]
  phase: Phase
  topic: string
  intensityRange?: string
  frequency?: number
  text?: string        // added when uploading to Pinecone
}

export interface Chunk {
  id: string
  text: string
  metadata: ChunkMetadata
}

// ── Chunks ───────────────────────────────────────────────────

const chunks: Chunk[] = [

  // ============================================================
  // PDF 1 — REP SCHEMES DATABASE
  // ============================================================

  {
    id: 'rep_001',
    text: `
TOPIC: The four strength qualities in KILO methodology
GOAL: all
LEVEL: all
PHASE: both

KILO training is built around four distinct strength qualities.
Each quality targets a different physiological adaptation and
corresponds to a specific intensity and rep range.

RELATIVE STRENGTH (85-100% intensity, 1-5 reps):
Develops strength through improved neuromuscular function.
The CNS becomes more efficient at recruiting motor units at
optimal firing rates. Greatest neural adaptations. Best for
intermediate to advanced lifters.

FUNCTIONAL HYPERTROPHY (78-83% intensity, 6-8 reps):
Develops hypertrophy through increased cross-sectional area
AND improved neuromuscular function. A hybrid quality combining
both neural and metabolic adaptations.

HYPERTROPHY (70-76% intensity, 7-12 reps):
Develops muscle size through increased cross-sectional area
and improved metabolic functions. Primary metabolic adaptation
zone. Suitable for all levels.

STRENGTH ENDURANCE (40-68% intensity, 13-50 reps):
Develops muscular endurance through improved metabolic functions
and increased tolerance to fatigue. Greatest metabolic
adaptations. High rep, low intensity zone.

The 1RM Continuum runs Neural (high intensity) to Metabolic
(low intensity). Each quality falls on this continuum.

WHEN TO USE: When determining what goal a user has and what
intensity and rep range to assign to their training plan.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'strength_qualities',
      goal: 'all',
      level: 'all',
      phase: 'both',
      topic: 'strength_quality_definitions'
    }
  },

  {
    id: 'rep_002',
    text: `
TOPIC: Strength Endurance rep schemes at 40-68% intensity
GOAL: endurance
LEVEL: beginner, intermediate
PHASE: accumulation

For strength endurance training (40-68% of 1RM), use the
following rep schemes. These are high rep, low intensity sets
targeting metabolic adaptations and fatigue tolerance.

At 40% intensity:
- Standard range: 40-50 reps per set (50 reps target)

At 45% intensity:
- Standard range: 30-40 reps per set (40 reps target)

At 50% intensity:
- Standard range: 20-30 reps per set (30 reps target)
- Descending: 50, 30, 20 (100 total reps)
- Descending: 30/15/15 (60 total reps)

At 53% intensity:
- Descending: 20, 20, 50 (90 total reps)

At 55% intensity:
- Standard range: 20-25 reps per set (25 reps target)

At 60% intensity:
- Standard range: 15-20 reps per set (20 reps target)
- Descending: 15, 15, 30 (60 total reps)
- Constant: 20/20/20 (60 total reps)
- Constant: 20/10/10 (40 total reps)

At 61% intensity:
- Descending: 30, 20, 15, 10 (75 total reps)
- Ascending: 10, 15, 20, 30 (75 total reps)

At 66% intensity:
- Standard range: 12-15 reps per set (15 reps target)
- Constant: 15/15/15 (45 total reps)

At 67% intensity:
- Descending: 12, 12, 20 (44 total reps)

At 68% intensity:
- Descending: 10, 12, 15, 20 (57 total reps)
- Ascending: 20, 15, 12, 10 (57 total reps)

WHEN TO USE: When user goal is endurance or muscular endurance.
These rep schemes are appropriate for beginners and intermediates.
Use during accumulation phases only.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'strength_endurance_intensity',
      goal: 'endurance',
      level: ['beginner', 'intermediate'],
      phase: 'accumulation',
      intensityRange: '40-68',
      topic: 'strength_endurance_rep_schemes'
    }
  },

  {
    id: 'rep_003',
    text: `
TOPIC: Hypertrophy rep schemes at 70-76% intensity
GOAL: hypertrophy
LEVEL: beginner, intermediate
PHASE: accumulation

For hypertrophy training (70-76% of 1RM), use the following
rep schemes. These target muscle size through increased
cross-sectional area and metabolic adaptations.

At 70% intensity:
- Standard range: 10-12 reps per set
- Descending: 15, 12, 10 (37 total reps)
- Drop set: 12/10/8 (30 total reps)
- Extended descending: 15, 12, 10, 10 (47 total reps)

At 72% intensity:
- Standard range: 9-11 reps per set

At 73% intensity:
- Back-off set: 12, 10, 8, 12 (42 total reps)
- Extended back-off: 12, 12, 10, 10, 8 (52 total reps)

At 74% intensity:
- Standard range: 8-10 reps per set
- Back-off extended: 12, 10, 8, 6, 15 (51 total reps)
- Constant: 10/10/10 (30 total reps)
- Drop set: 10/8/8 (26 total reps)
- Drop set: 10/8/6 (24 total reps)

At 75% intensity:
- Descending: 12, 10, 8, 8 (38 total reps)
- Paler ascending: 8, 8, 8, 12, 12 (48 total reps)

At 76% intensity:
- Standard range: 7-9 reps per set
- Descending: 12, 10, 8, 6 (36 total reps)
- Flat descending: 12, 8, 8, 8 (36 total reps)
- Ascending: 6, 8, 10, 12 (36 total reps)
- Multi-set: 10, 10, 8, 8, 8 (44 total reps)
- Drop set: 9/7/7 (23 total reps)
- Drop set: 9/7/5 (21 total reps)

WHEN TO USE: When user goal is hypertrophy. Match lower
intensities (70-72%) to beginners, higher (74-76%) to
intermediates. Use during accumulation phases.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'hypertrophy_intensity',
      goal: 'hypertrophy',
      level: ['beginner', 'intermediate'],
      phase: 'accumulation',
      intensityRange: '70-76',
      topic: 'hypertrophy_rep_schemes'
    }
  },

  {
    id: 'rep_004',
    text: `
TOPIC: Functional Hypertrophy rep schemes at 78-83% intensity
GOAL: functional_hypertrophy
LEVEL: intermediate, advanced
PHASE: both

For functional hypertrophy training (78-83% of 1RM), use these
rep schemes. This quality combines neural and metabolic
adaptations through moderate intensity and moderate rep ranges.

At 78% intensity:
- Standard range: 6-8 reps per set
- Descending: 11, 9, 7, 5 (32 total reps)
- Wave: 10, 8, 6, 10, 8, 6 (48 total reps)
- Broad pyramid: 10, 8, 6, 6, 8, 10 (48 total reps)
- Drop set: 8/6/6 (20 total reps)

At 79% intensity:
- Descending: 9, 8, 7, 6 (30 total reps)
- Ascending: 6, 7, 8, 9 (30 total reps)
- Stage descending: 10, 10, 6, 6, 6 (38 total reps)
- Stage ascending: 6, 6, 8, 8, 10 (38 total reps)
- Paler: 6, 6, 6, 10, 10 (38 total reps)

At 80% intensity:
- Standard range: 5-7 reps per set
- Paler descending: 8, 8, 8, 6, 6 (36 total reps)
- Wave back-off: 7, 7, 5, 5, 12 (36 total reps)
- Stage: 9, 9, 7, 7, 5, 5 (42 total reps)
- Wave: 9, 7, 5, 9, 7, 5 (42 total reps)
- Broad pyramid: 9, 7, 5, 5, 7, 9 (42 total reps)
- Drop set: 7/5/5 (17 total reps)

At 81% intensity:
- Stage: 8, 8, 6, 6 (28 total reps)
- Back-off: 8, 6, 4, 4, 12 (34 total reps)
- Stage ascending: 6, 6, 6, 8, 8 (34 total reps)
- Paler ascending: 5, 5, 5, 9, 9 (33 total reps)

At 82% intensity:
- Paler: 4, 4, 8, 8, 8 (32 total reps)

At 83% intensity:
- Standard range: 4-6 reps per set
- Descending: 8, 7, 6, 5, 4 (30 total reps)
- Ascending: 4, 5, 6, 7, 8 (30 total reps)
- Stage descending: 8, 8, 6, 6, 4, 4 (36 total reps)
- Wave: 8, 6, 4, 8, 6, 4 (36 total reps)
- Broad pyramid: 8, 6, 4, 4, 6, 8 (36 total reps)
- Stage ascending: 4, 4, 6, 6, 8, 8 (36 total reps)
- Drop set: 6/6/6 (18 total reps)
- Drop set: 6/4/4 (14 total reps)

WHEN TO USE: When user goal is functional hypertrophy or
when bridging between hypertrophy and strength goals.
Intermediate to advanced lifters only.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'functional_hypertrophy_intensity',
      goal: 'functional_hypertrophy',
      level: ['intermediate', 'advanced'],
      phase: 'both',
      intensityRange: '78-83',
      topic: 'functional_hypertrophy_rep_schemes'
    }
  },

  {
    id: 'rep_005',
    text: `
TOPIC: Relative Strength rep schemes at 85-100% intensity
GOAL: strength
LEVEL: intermediate, advanced
PHASE: intensification

For relative strength training (85-100% of 1RM), use the
following rep schemes. These develop maximum strength through
improved neuromuscular efficiency. Never assign to beginners.

At 85% intensity:
- Standard range: 3-5 reps per set
- Stage descending: 7, 7, 5, 5, 3, 3 (30 total reps)
- Wave: 7, 5, 3, 7, 5, 3 (30 total reps)
- Broad pyramid: 7, 5, 3, 3, 5, 7 (30 total reps)
- Stage ascending: 3, 3, 5, 5, 7, 7 (30 total reps)
- Drop set: 5/3/3 (11 total reps)
- Cluster: (3/1/1/1) = 6 reps per set with 10 sec intra-rest

At 87% intensity:
- Wave: 5, 3, 5, 3, 5 (21 total reps)

At 88% intensity:
- Standard range: 2-4 reps per set
- Stage descending: 6, 6, 4, 4, 2, 2 (24 total reps)
- Wave: 6, 4, 2, 6, 4, 2 (24 total reps)
- Broad pyramid: 6, 4, 2, 2, 4, 6 (24 total reps)
- Paler: 5, 5, 5, 3, 3, 3 (24 total reps)
- Wave: 5, 4, 3, 5, 4, 3 (24 total reps)
- Stage ascending: 2, 2, 4, 4, 6, 6 (24 total reps)
- Drop set: 4/2/2 (8 total reps)

At 90% intensity:
- Standard range: 2-3 reps per set
- Wave: 5, 3, 2, 5, 3, 2 (20 total reps)
- Cluster: (1/1/1/1/1) = 5 reps with 10 sec intra-rest

At 91% intensity:
- Descending: 5, 4, 3, 2, 1 (15 total reps)
- Ascending: 1, 2, 3, 4, 5 (15 total reps)

At 92% intensity:
- Stage descending: 5, 5, 3, 3, 1, 1 (18 total reps)
- Wave: 5, 3, 1, 5, 3, 1 (18 total reps)
- Wave contrast: 1, 6, 1, 6, 1, 6 (21 total reps)

At 94% intensity:
- Standard range: 1-2 reps per set

At 95% intensity:
- Stage descending: 3, 3, 2, 2, 1, 1 (12 total reps)
- Wave: 3, 2, 1, 3, 2, 1 (12 total reps)

At 100% intensity:
- 1 rep maximum (1RM attempt)

WHEN TO USE: When user goal is strength or relative strength.
Intensification phases only. Never use with beginners.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'relative_strength_intensity',
      goal: 'strength',
      level: ['intermediate', 'advanced'],
      phase: 'intensification',
      intensityRange: '85-100',
      topic: 'relative_strength_rep_schemes'
    }
  },

  {
    id: 'rep_006',
    text: `
TOPIC: Standard Sets — how they work and how to load them
GOAL: all
LEVEL: all
PHASE: both

Standard Sets are the most basic and fundamental rep scheme.
They should represent the majority of the training year,
especially for beginners. Always introduce this first.

INTENSITY TO REP RANGE REFERENCE:
- 94% → 1-2 reps
- 90% → 2-3 reps
- 88% → 2-4 reps
- 85% → 3-5 reps
- 83% → 4-6 reps
- 80% → 5-7 reps
- 78% → 6-8 reps
- 76% → 7-9 reps
- 74% → 8-10 reps
- 72% → 9-11 reps
- 70% → 10-12 reps

TWO LOADING METHODS:

1. Constant Loading (best for beginners):
Same weight used across all sets.
Example 4 x 10:
Set 1: 10 reps at 210 lbs
Set 2: 10 reps at 210 lbs
Set 3: 10 reps at 210 lbs
Set 4: 10 reps at 210 lbs

2. Step Loading (best for intermediate and advanced):
Weight increases slowly set to set.
Example 4 x 10:
Set 1: 10 reps at 210 lbs
Set 2: 10 reps at 215 lbs
Set 3: 10 reps at 220 lbs
Set 4: 10 reps at 225 lbs
Maximum 10% intensity spread between first and last set.

PROGRESSION ACROSS WEEKS:
If all reps completed, start next session at load used
in Set 2 of the previous session.
If reps were missed, repeat same loading and improve
volume before increasing weight.

WHEN TO USE: First rep scheme for any lifter. Beginners use
constant loading. Intermediates and advanced use step loading.
Suited to all goals: Hypertrophy, Strength, Power.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'standard_sets',
      goal: 'all',
      level: 'all',
      phase: 'both',
      topic: 'standard_sets_method'
    }
  },

  {
    id: 'rep_007',
    text: `
TOPIC: Descending Reps — how they work and when to use them
GOAL: all
LEVEL: intermediate, advanced
PHASE: intensification

Descending Reps are the second rep scheme to introduce after
Standard Sets. Reps decrease each set while intensity increases.
Gradual load increase helps the CNS prepare for heavier loads.

EXAMPLE SCHEMES WITH INTENSITY AND VOLUME:
- 68%: 20, 15, 12, 10 (57 total reps)
- 70%: 15, 12, 10 (37 total reps)
- 76%: 12, 10, 8, 6 (36 total reps)
- 78%: 11, 9, 7, 5 (32 total reps)
- 79%: 9, 8, 7, 6 (30 total reps)
- 83%: 8, 7, 6, 5, 4 (30 total reps)
- 91%: 5, 4, 3, 2, 1 (15 total reps)

LOADING EXAMPLE (8,7,6,5,4 at 83%):
Set 1: 8 reps at 240 lbs
Set 2: 7 reps at 245 lbs — increase 2-3%
Set 3: 6 reps at 250 lbs — increase 2-3%
Set 4: 5 reps at 255 lbs — increase 2-3%
Set 5: 4 reps at 260 lbs — increase 2-3%

PROGRESSION ACROSS WEEKS:
If successful, start next session at load used in Set 2.
If unsuccessful, repeat same loading and improve reps first.

WHEN TO USE: Introduce after Standard Sets. Intensification
phases — last CNS signal is high intensity. Suited to all
macrocycle goals. Intermediate to advanced only.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'descending_reps',
      goal: 'all',
      level: ['intermediate', 'advanced'],
      phase: 'intensification',
      topic: 'descending_reps_method'
    }
  },

  {
    id: 'rep_008',
    text: `
TOPIC: Ascending Reps — how they work and when to use them
GOAL: hypertrophy, strength
LEVEL: intermediate, advanced
PHASE: accumulation

Ascending Reps are opposite to Descending Reps. First set is
heaviest, load decreases as reps increase. More advanced than
descending. Requires extensive warm-up for heavy first set.

EXAMPLE SCHEMES WITH INTENSITY AND VOLUME:
- 68%: 10, 12, 15, 20 (57 total reps)
- 76%: 6, 8, 10, 12 (36 total reps)
- 79%: 6, 7, 8, 9 (30 total reps)
- 83%: 4, 5, 6, 7, 8 (30 total reps)
- 91%: 1, 2, 3, 4, 5 (15 total reps)

LOADING EXAMPLE (4,5,6,7,8 at 83%):
Set 1: 4 reps at 260 lbs (heaviest — CNS is fresh)
Set 2: 5 reps at 255 lbs — decrease 2-3%
Set 3: 6 reps at 250 lbs — decrease 2-3%
Set 4: 7 reps at 245 lbs — decrease 2-3%
Set 5: 8 reps at 240 lbs — metabolic finish

WHEN TO USE: Introduce after Descending Reps. Accumulation
phases — last CNS signal is volume and metabolic stress.
Suited to Hypertrophy, Absolute Strength, Relative Strength.
Wait until lifter is intermediate to advanced.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'ascending_reps',
      goal: ['hypertrophy', 'strength'],
      level: ['intermediate', 'advanced'],
      phase: 'accumulation',
      topic: 'ascending_reps_method'
    }
  },

  {
    id: 'rep_009',
    text: `
TOPIC: Back-Off Sets — how they work and when to use them
GOAL: hypertrophy, strength
LEVEL: intermediate, advanced
PHASE: accumulation

In Back-Off Sets, intensity increases and reps decrease like
Descending Reps, but the final set drops intensity 8-18%
and reps increase significantly creating a volume finish.

BACK-OFF DROP BY LEVEL:
- Beginner: 8-12% intensity drop
- Intermediate: 12-15% intensity drop
- Advanced: 15-18% intensity drop

EXAMPLE SCHEMES WITH INTENSITY AND VOLUME:
- 73%: 12, 10, 8, 12 back-off (42 total reps)
- 74%: 12, 10, 8, 6, 15 back-off (51 total reps)
- 80%: 7, 7, 5, 5, 12 back-off (36 total reps)
- 81%: 8, 6, 4, 4, 12 back-off (34 total reps)

LOADING EXAMPLE (12,10,8,6,15 at 74%):
Set 1: 12 reps at 215 lbs
Set 2: 10 reps at 225 lbs
Set 3: 8 reps at 235 lbs
Set 4: 6 reps at 245 lbs
Set 5: 15 reps at 205 lbs (back-off drop ~15%)

WHEN TO USE: Introduce after Ascending Reps. Accumulation
phases — back-off set creates volume response. Best for
Hypertrophy and Absolute Strength goals.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'back_off_sets',
      goal: ['hypertrophy', 'strength'],
      level: ['intermediate', 'advanced'],
      phase: 'accumulation',
      topic: 'back_off_sets_method'
    }
  },

  {
    id: 'rep_010',
    text: `
TOPIC: Broad Pyramid — how it works and when to use it
GOAL: hypertrophy, strength
LEVEL: intermediate, advanced
PHASE: accumulation

The Broad Pyramid combines Descending and Ascending Reps.
Reps decrease to a peak (double exposure at heaviest), then
intensity decreases and reps increase back up. The returning
sets are harder due to cumulative fatigue.

EXAMPLE SCHEMES WITH INTENSITY AND VOLUME:
- 78%: 10, 8, 6, 6, 8, 10 (48 total reps)
- 80%: 9, 7, 5, 5, 7, 9 (42 total reps)
- 83%: 8, 6, 4, 4, 6, 8 (36 total reps)
- 85%: 7, 5, 3, 3, 5, 7 (30 total reps)
- 88%: 6, 4, 2, 2, 4, 6 (24 total reps)
- 92%: 5, 3, 1, 1, 3, 5 (18 total reps)
- 95%: 3, 2, 1, 1, 2, 3 (12 total reps)

LOADING EXAMPLE (8,6,4,4,6,8 at 83%):
Set 1: 8 reps at 240 lbs
Set 2: 6 reps at 255 lbs (~5% increase)
Set 3: 4 reps at 270 lbs (peak)
Set 4: 4 reps at 270 lbs (double peak exposure)
Set 5: 6 reps at 255 lbs (returning — harder than Set 2)
Set 6: 8 reps at 240 lbs (returning — harder than Set 1)

WHEN TO USE: Introduce after Back-Off Sets. Accumulation
phases — returning sets create metabolic stress. Best for
Hypertrophy, Absolute Strength, Relative Strength.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'broad_pyramid',
      goal: ['hypertrophy', 'strength'],
      level: ['intermediate', 'advanced'],
      phase: 'accumulation',
      topic: 'broad_pyramid_method'
    }
  },

  {
    id: 'rep_011',
    text: `
TOPIC: Stage System Descending — how it works and when to use it
GOAL: all
LEVEL: intermediate, advanced
PHASE: intensification

The Stage System uses repeated exposures to the same load
(Law of Repeated Efforts). The CNS becomes more efficient
at recruiting motor units when exposed to the same load
multiple times per session.

Stage System Descending: Two sets at same weight per stage.
Intensity increases between stages. Reps decrease each stage.
5% intensity jump between stages is optimal.

EXAMPLE SCHEMES WITH INTENSITY AND VOLUME:
- 80%: 9, 9, 7, 7, 5, 5 (42 total reps)
- 83%: 8, 8, 6, 6, 4, 4 (36 total reps)
- 85%: 7, 7, 5, 5, 3, 3 (30 total reps)
- 88%: 6, 6, 4, 4, 2, 2 (24 total reps)
- 92%: 5, 5, 3, 3, 1, 1 (18 total reps)
- 95%: 3, 3, 2, 2, 1, 1 (12 total reps)

LOADING EXAMPLE (7,7,5,5,3,3 at 85%):
Set 1: 7 reps at 245 lbs
Set 2: 7 reps at 245 lbs (same — repeated effort)
Set 3: 5 reps at 260 lbs (5% jump)
Set 4: 5 reps at 260 lbs (same — repeated effort)
Set 5: 3 reps at 275 lbs (5% jump)
Set 6: 3 reps at 275 lbs (same — repeated effort)

WHEN TO USE: Sixth rep scheme to introduce. Intensification
phases — last CNS signal is high intensity. Introduce before
Stage System Ascending. Suited to all macrocycle goals.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'stage_system_descending',
      goal: 'all',
      level: ['intermediate', 'advanced'],
      phase: 'intensification',
      topic: 'stage_system_descending_method'
    }
  },

  {
    id: 'rep_012',
    text: `
TOPIC: Stage System Ascending — how it works and when to use it
GOAL: hypertrophy, strength
LEVEL: advanced
PHASE: accumulation

Stage System Ascending is the opposite of Stage Descending.
First two sets are heaviest, load decreases progressively.
More advanced — requires more warm-up sets to prime the CNS.

EXAMPLE SCHEMES WITH INTENSITY AND VOLUME:
- 80%: 5, 5, 7, 7, 9, 9 (42 total reps)
- 83%: 4, 4, 6, 6, 8, 8 (36 total reps)
- 85%: 3, 3, 5, 5, 7, 7 (30 total reps)
- 88%: 2, 2, 4, 4, 6, 6 (24 total reps)
- 92%: 1, 1, 3, 3, 5, 5 (18 total reps)

LOADING EXAMPLE (3,3,5,5,7,7 at 85%):
Set 1: 3 reps at 275 lbs (heaviest — CNS is fresh)
Set 2: 3 reps at 275 lbs (repeated effort at peak)
Set 3: 5 reps at 260 lbs (5% drop)
Set 4: 5 reps at 260 lbs (repeated effort)
Set 5: 7 reps at 245 lbs (5% drop)
Set 6: 7 reps at 245 lbs (metabolic finish)

WHEN TO USE: Introduce after Stage System Descending.
Accumulation phases — later stages create metabolic stress.
Suited to Hypertrophy, Absolute Strength, Relative Strength.
Advanced lifters only.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'stage_system_ascending',
      goal: ['hypertrophy', 'strength'],
      level: ['advanced'],
      phase: 'accumulation',
      topic: 'stage_system_ascending_method'
    }
  },

  {
    id: 'rep_013',
    text: `
TOPIC: Paler System — how it works and when to use it
GOAL: hypertrophy, strength, power
LEVEL: advanced
PHASE: both

The Paler System is a form of Stage System with more repeated
efforts per stage (2-5 exposures per intensity). Weight
selection is critical — must sustain same intensity across
more sets. More demanding than standard Stage System.

PALER SYSTEM DESCENDING (intensity increases per stage):
- 76%: 10, 10, 8, 8, 8 (44 total reps)
- 79%: 10, 10, 6, 6, 6 (38 total reps)
- 80%: 8, 8, 8, 6, 6 (36 total reps)
- 88%: 5, 5, 5, 3, 3, 3 (24 total reps)
- 92%: 3, 3, 3, 2, 2, 2 (15 total reps)

PALER SYSTEM ASCENDING (heaviest sets first):
- 75%: 8, 8, 8, 12, 12 (48 total reps)
- 79%: 6, 6, 6, 10, 10 (38 total reps)
- 81%: 6, 6, 6, 8, 8 (34 total reps)
- 81%: 5, 5, 5, 9, 9 (33 total reps)
- 82%: 4, 4, 8, 8, 8 (32 total reps)

DESCENDING LOADING EXAMPLE (5,5,5,3,3,3 at 88%):
Set 1-3: 5 reps at 260 lbs (three exposures same weight)
Set 4-6: 3 reps at 275 lbs (three exposures heavier weight)

WHEN TO USE: Paler Descending suits intensification phases.
Paler Ascending suits accumulation phases. Introduce after
Stage System. Advanced lifters only. Suited to Hypertrophy,
Strength, and Power goals.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'paler_system',
      goal: ['hypertrophy', 'strength', 'power'],
      level: ['advanced'],
      phase: 'both',
      topic: 'paler_system_method'
    }
  },

  {
    id: 'rep_014',
    text: `
TOPIC: Wave Loading — how it works and when to use it
GOAL: strength, power
LEVEL: advanced
PHASE: intensification

Wave Loading uses Post Activation Potentiation (PAP). Contrast
intensities within waves potentiate the body to lift heavier.
Each second wave starts slightly heavier than the first wave.
Requires very accurate weight selection.

10% intensity spread within each wave stimulates potentiation.
Two waves for most lifters. Three or four for advanced.

EXAMPLE SCHEMES WITH INTENSITY AND VOLUME:
- 78%: 10, 8, 6, 10, 8, 6 (48 total reps)
- 80%: 9, 7, 5, 9, 7, 5 (42 total reps)
- 83%: 8, 6, 4, 8, 6, 4 (36 total reps)
- 85%: 7, 5, 3, 7, 5, 3 (30 total reps)
- 88%: 6, 4, 2, 6, 4, 2 (24 total reps)
- 90%: 5, 3, 2, 5, 3, 2 (20 total reps)
- 92%: 5, 3, 1, 5, 3, 1 (18 total reps)
- 95%: 3, 2, 1, 3, 2, 1 (12 total reps)

LOADING EXAMPLE (5,3,2,5,3,2 at 90%):
Set 1: 5 reps at 260 lbs (Wave 1 start)
Set 2: 3 reps at 275 lbs
Set 3: 2 reps at 290 lbs (Wave 1 peak)
Set 4: 5 reps at 265 lbs (Wave 2 — 2% heavier start)
Set 5: 3 reps at 280 lbs
Set 6: 2 reps at 295 lbs (Wave 2 peak — higher than Wave 1)

5% increase set to set within wave.
2% increase for second wave start vs first wave start.

WHEN TO USE: Introduce after Paler System. Peaking and
intensification phases. Advanced only. Suited to Absolute
Strength, Relative Strength and Power goals.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'wave_loading',
      goal: ['strength', 'power'],
      level: ['advanced'],
      phase: 'intensification',
      topic: 'wave_loading_method'
    }
  },

  {
    id: 'rep_015',
    text: `
TOPIC: Cluster Sets — how they work and when to use them
GOAL: strength
LEVEL: intermediate, advanced
PHASE: accumulation

Cluster Sets use 10-15 second intra-set rests to allow more
reps at a given intensity than a continuous set. Short rest
replenishes ATP-CP for continued high intensity performance.
Use sparingly — higher recovery demands than standard sets.
Best used to break through a strength plateau.

FIRST EXPOSURE — 5 x (3/1/1/1) at 85%:
3 reps, rest 10 seconds
1 rep, rest 10 seconds
1 rep, rest 10 seconds
1 rep, then rest 180 seconds between sets
= 6 reps per set (vs normal 5 at 85%)
Perform for 4-5 sets total.

SECOND EXPOSURE — 5 x (1/1/1/1/1) at 90%:
1 rep, rest 10 seconds (x5)
Then rest 240 seconds between sets
= 5 reps per set (vs normal 3 at 90%)
Perform for 5-6 sets total.

Always use First Exposure before Second Exposure.
For lower body: single station training, full recovery rest.

WHEN TO USE: When a lifter hits a plateau on a specific lift.
Introduce after Paler System. Accumulation phase tool.
Suited to Absolute Strength and Relative Strength goals.
Intermediate to advanced only.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'cluster_sets',
      goal: ['strength'],
      level: ['intermediate', 'advanced'],
      phase: 'accumulation',
      topic: 'cluster_sets_method'
    }
  },

  {
    id: 'rep_016',
    text: `
TOPIC: Drop Sets — how they work and when to use them
GOAL: hypertrophy
LEVEL: all
PHASE: accumulation

Drop Sets are not used for A Series primary exercises.
Use only for B and C series assistance and remedial exercises
to build volume in accumulation phases.

EXAMPLE SCHEMES WITH INTENSITY AND VOLUME:
- 66%: 15/15/15 (45 total reps)
- 70%: 12/10/8 (30 total reps)
- 74%: 10/10/10 (30 total reps)
- 74%: 10/8/8 (26 total reps)
- 74%: 10/8/6 (24 total reps)
- 76%: 9/7/7 (23 total reps)
- 76%: 9/7/5 (21 total reps)
- 78%: 8/6/6 (20 total reps)
- 80%: 7/5/5 (17 total reps)
- 83%: 6/6/6 (18 total reps)
- 83%: 6/4/4 (14 total reps)
- 85%: 5/3/3 (11 total reps)
- 88%: 4/2/2 (8 total reps)

Each slash represents a weight drop between mini-sets.
Start at the first intensity listed, drop weight for each
subsequent set.

WHEN TO USE: B and C series exercises only. Never for A
series primary exercises. Accumulation phases. Primarily
for Hypertrophy goals.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'drop_sets',
      goal: 'hypertrophy',
      level: 'all',
      phase: 'accumulation',
      topic: 'drop_sets_method'
    }
  },

  {
    id: 'rep_017',
    text: `
TOPIC: Order of introducing rep schemes and which suit each goal
GOAL: all
LEVEL: all
PHASE: both

Rep schemes must be introduced in a specific order. More
complex schemes require the CNS and musculature to first be
prepared by simpler schemes. Never skip steps in this order.

CORRECT ORDER OF INTRODUCTION (A Series primary exercises):
1.  Standard Sets — always first, always
2.  Descending Reps
3.  Ascending Reps
4.  Back-Off Sets
5.  Broad Pyramid
6.  Stage System Descending
7.  Stage System Ascending
8.  Paler System Descending
9.  Paler System Ascending
10. Wave Loading
11. Cluster Sets

REP SCHEMES BY MACROCYCLE GOAL:

Hypertrophy: All 11 schemes
Absolute Strength: All 11 schemes
Relative Strength: Standard, Descending, Ascending,
  Broad Pyramid, Stage Descending, Stage Ascending,
  Paler Descending, Wave Loading, Cluster Sets
Power: Standard Sets, Descending Reps,
  Stage System Descending, Paler System Descending only

PHASE MATCHING:
Accumulation: Ascending, Back-Off, Broad Pyramid,
  Stage Ascending, Paler Ascending, Clusters
Intensification: Standard, Descending, Stage Descending,
  Paler Descending, Wave Loading

WHEN TO USE: Master reference for assigning any rep scheme.
Always start beginners with Standard Sets. Never skip the
introduction order. Match the phase to the correct schemes.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'rep_scheme_order',
      goal: 'all',
      level: 'all',
      phase: 'both',
      topic: 'rep_scheme_introduction_order'
    }
  },

  {
    id: 'rep_018',
    text: `
TOPIC: Warm-up protocol for every training session
GOAL: all
LEVEL: all
PHASE: both

Every session needs two parts: a general dynamic warm-up
followed by a specific warm-up for the primary exercise.

PART 1 — DYNAMIC WARM-UP:
8 exercises using full body through multiple ranges of motion.
Activates CNS, improves dynamic range of motion, shifts
lifter from rested to active state. Takes 5-8 minutes.

PART 2 — SPECIFIC WARM-UP:

If performing 7 or more reps on first working set:
Warm-up Set 1: 6 reps at 50% of working set weight
Warm-up Set 2: 4 reps at 75% of working set weight

If performing 6 or fewer reps on first working set:
Warm-up Set 1: 6 reps at 50% of working set weight
Warm-up Set 2: 4 reps at 70% of working set weight
Warm-up Set 3: 2 reps at 90% of working set weight

FOR ADVANCED OR STRONGER LIFTERS (additional sets):
Warm-up Set 1: 6 reps at 40% of working set weight
Warm-up Set 2: 4 reps at 60% of working set weight
Warm-up Set 3: 2 reps at 80% of working set weight
Warm-up Set 4: 1 rep at 90% of working set weight
Warm-up Set 5: 1 rep at 95% of working set weight

FOR ASCENDING, STAGE ASCENDING, PALER ASCENDING SCHEMES:
Add one extra warm-up set above working weight for PAP:
Final warm-up: 1 rep at 105% of first working set weight

UPPER BODY DOUBLE STATION SUPERSETS:
Alternate between agonist and antagonist during warm-up
until all warm-up sets are completed for both exercises.

Total warm-up time: 10-15 minutes.

WHEN TO USE: Include in every plan for every session.
Match warm-up depth to the rep scheme being used.
    `.trim(),
    metadata: {
      source: 'rep_schemes_database',
      section: 'warm_up_protocol',
      goal: 'all',
      level: 'all',
      phase: 'both',
      topic: 'warm_up_protocol'
    }
  },

  // ============================================================
  // PDF 2 — PROGRAM DESIGN RESOURCE
  // ============================================================

  {
    id: 'prog_001',
    text: `
TOPIC: The 8 PRIMEIGHT primary exercises in KILO methodology
GOAL: all
LEVEL: all
PHASE: both

KILO methodology is built around 8 primary exercises called
the PRIMEIGHT. All other exercises exist to support these 8.

THE 8 PRIMEIGHT EXERCISES:
1. Squat — lower body quad dominant
2. Front Squat — lower body quad dominant
3. Deadlift — lower body hip dominant
4. Overhead Press — upper body push vertical
5. Incline Press — upper body push diagonal
6. Bench Press — upper body push horizontal
7. Dip — upper body push decline
8. Chin-Up — upper body pull

STANDARD FORM FOR EACH:
- Overhead Press: Standing - BB - Medium Grip - Pronated
- Incline Press: 35 degree Incline - BB - Medium Grip - Pronated
- Bench Press: Flat - BB - Medium Grip - Pronated
- Dip: V Bar - Medium Grip - Semi-Pronated
- Squat: Back - BB - Medium Stance
- Front Squat: Front - BB - Medium Stance
- Deadlift: Conventional - BB - Medium Grip - Pronated
- Chin-Up: Grip varies by session (see grip selection chunk)

WHEN TO USE: These are the A Series exercises in every
session. Always assign one PRIMEIGHT exercise as the
primary movement for every training session.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'primeight_exercises',
      goal: 'all',
      level: 'all',
      phase: 'both',
      topic: 'primeight_primary_exercises'
    }
  },

  {
    id: 'prog_002',
    text: `
TOPIC: The 90-degree principle for exercise pairing
GOAL: all
LEVEL: all
PHASE: both

The 90-degree principle governs how exercises pair within
a microcycle and within a single session. It ensures the
pressing angle changes between sessions and between the
primary exercise and its assistance exercise.

BETWEEN SESSIONS (within the microcycle):
- Overhead Press pairs with → Bench Press (next session)
- Incline Press pairs with → Dip (next session)

Never pair Overhead Press with Incline Press in the same
microcycle as primary exercises.

WITHIN A SESSION (primary to assistance press):
The assistance press is at 90 degrees to the primary:
- Overhead Press → Flat DB Press
- Incline Press → Decline DB Press
- Bench Press → Seated DB Press
- Dip → Incline DB Press

WHY THIS MATTERS:
Varying the pressing angle ensures balanced shoulder
development, reduces overuse injury, and creates varied
mechanical stress across the training week.

WHEN TO USE: Always apply when assigning upper body primary
exercises to a microcycle and when selecting assistance
pressing exercises within a session.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: '90_degree_principle',
      goal: 'all',
      level: 'all',
      phase: 'both',
      topic: '90_degree_pairing_principle'
    }
  },

  {
    id: 'prog_003',
    text: `
TOPIC: Chin-Up and Rowing grip selection rules
GOAL: all
LEVEL: all
PHASE: both

Grip selection for Chin-Up and Row is determined by which
primary pressing exercise is used in that session.

CHIN-UP GRIP BY SESSION:
- Overhead Press session → Chin-Up Supinated Grip
- Incline Press session → Chin-Up Neutral Grip
- Bench Press session → Chin-Up Neutral Grip
- Dip session → Pull-Up Pronated Grip

ROWING GRIP BY SESSION:
- Overhead Press session → Row Neutral Grip
- Incline Press session → Row Supinated Grip
- Bench Press session → Row Pronated Grip
- Dip session → Row Neutral Grip

GRIP WIDTH VARIATION BETWEEN SESSIONS:
Always vary grip width between Upper Body 1 and Upper Body 2.
The chin-up grip width drives the rowing grip width.

Valid pairing examples:
- UB1: Chin-Up Close / Row Medium
  UB2: Chin-Up Medium / Row Wide
- UB1: Chin-Up Wide / Row Medium
  UB2: Chin-Up Close / Row Medium
- UB1: Chin-Up Medium / Row Wide
  UB2: Chin-Up Close / Row Medium

WHEN TO USE: Every time a Chin-Up or Row is assigned to any
upper body session. Grip must match primary pressing exercise.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'grip_selection',
      goal: 'all',
      level: 'all',
      phase: 'both',
      topic: 'chinup_rowing_grip_selection'
    }
  },

  {
    id: 'prog_004',
    text: `
TOPIC: How to structure any upper body training session
GOAL: all
LEVEL: all
PHASE: both

Every upper body session follows the A, B, C series format.
Format: Exercise — Sets x Reps — Tempo — Rest seconds

OVERHEAD PRESS SESSION:
A1: Overhead Press — 4-6 x 1-12 — 4-0-X-0 — 90-120s
A2: Chin-Up Supinated Grip — 4-6 x 1-12 — 4-0-X-0 — 90-120s
B1: Flat DB Press — 3-4 x 6-10 — 3-0-1-0 — 60-90s
B2: Row Neutral Grip — 3-4 x 6-10 — 3-0-1-0 — 60-90s
C1: Triceps — 2-3 x 10-15 — 3-0-1-0 — 30-60s
C2: Biceps — 2-3 x 10-15 — 3-0-1-0 — 30-60s

INCLINE PRESS SESSION:
A1: Incline Press — 4-6 x 1-12 — 4-0-X-0 — 90-120s
A2: Chin-Up Neutral Grip — 4-6 x 1-12 — 4-0-X-0 — 90-120s
B1: Decline DB Press — 3-4 x 6-10 — 3-0-1-0 — 60-90s
B2: Row Supinated Grip — 3-4 x 6-10 — 3-0-1-0 — 60-90s
C1: Triceps — 2-3 x 10-15 — 3-0-1-0 — 30-60s
C2: Biceps — 2-3 x 10-15 — 3-0-1-0 — 30-60s

BENCH PRESS SESSION:
A1: Bench Press — 4-6 x 1-12 — 4-0-X-0 — 90-120s
A2: Chin-Up Neutral Grip — 4-6 x 1-12 — 4-0-X-0 — 90-120s
B1: Seated DB Press — 3-4 x 6-10 — 3-0-1-0 — 60-90s
B2: Row Pronated Grip — 3-4 x 6-10 — 3-0-1-0 — 60-90s
C1: External Rotator — 2-3 x 10-15 — 3-0-1-0 — 30-60s
C2: Scapular Retractor — 2-3 x 10-15 — 3-0-1-0 — 30-60s

DIP SESSION:
A1: Dip — 4-6 x 1-12 — 4-0-X-0 — 90-120s
A2: Pull-Up Pronated Grip — 4-6 x 1-12 — 4-0-X-0 — 90-120s
B1: Incline DB Press — 3-4 x 6-10 — 3-0-1-0 — 60-90s
B2: Row Neutral Grip — 3-4 x 6-10 — 3-0-1-0 — 60-90s
C1: External Rotator — 2-3 x 10-15 — 3-0-1-0 — 30-60s
C2: Scapular Retractor — 2-3 x 10-15 — 3-0-1-0 — 30-60s

TEMPO FORMAT: 4-0-X-0 means 4 seconds eccentric, no pause
at bottom, explosive concentric, no pause at top.
X means as fast as possible.

WHEN TO USE: Foundation template for every upper body session.
A series uses the periodization rep scheme. B and C series
use moderate sets and reps for assistance and remedial work.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'upper_body_session_structure',
      goal: 'all',
      level: 'all',
      phase: 'both',
      topic: 'upper_body_session_templates'
    }
  },

  {
    id: 'prog_005',
    text: `
TOPIC: How to structure any lower body training session
GOAL: all
LEVEL: all
PHASE: both

Lower body sessions follow A, B, C series format with longer
rest periods. Front Squat and Deadlift are capped at 6 reps.
Use single station training for all lower body primary lifts.

Format: Exercise — Sets x Reps — Tempo — Rest seconds

SQUAT SESSION 1:
A: Squat — 4-6 x 1-12 — 4-0-X-0 — 180-240s
B1: Split Squat or Lunge — 3-4 x 6-12 — 3-0-1-0 — 60-90s
B2: Knee Flexion — 3-4 x 6-12 — 3-0-1-0 — 60-90s
C1: Knee Extension — 2-3 x 10-20 — 3-0-1-0 — 30-60s
C2: Hip Extension — 2-3 x 10-20 — 3-0-1-0 — 30-60s

SQUAT SESSION 2:
A: Squat — 4-6 x 1-12 — 4-0-X-0 — 180-240s
B: Specialty Squat — 4-5 x 6-12 — 3-0-1-0 — 150-180s
C1: Knee Extension — 2-3 x 10-20 — 3-0-1-0 — 30-60s
C2: Hip Extension — 2-3 x 10-20 — 3-0-1-0 — 30-60s

FRONT SQUAT SESSION:
A: Front Squat — 4-6 x 1-6 MAX — 4-0-X-0 — 180-240s
B: Specialty Deadlift — 4-5 x 6-12 — 3-0-1-0 — 150-180s
C1: Knee Extension — 2-3 x 10-20 — 3-0-1-0 — 30-60s
C2: Hip Extension — 2-3 x 10-20 — 3-0-1-0 — 30-60s

DEADLIFT SESSION:
A: Deadlift — 4-6 x 1-6 MAX — 4-1-X-0 — 180-240s
B1: Split Squat or Lunge — 3-4 x 6-12 — 3-0-1-0 — 60-90s
B2: Knee Flexion — 3-4 x 6-12 — 3-0-1-0 — 60-90s
C1: Knee Extension — 2-3 x 10-20 — 3-0-1-0 — 30-60s
C2: Hip Extension — 2-3 x 10-20 — 3-0-1-0 — 30-60s

NOTE: Deadlift uses 4-1-X-0 (1 second pause at bottom).
Longer rest (180-240s) for all lower body primary exercises.

WHEN TO USE: Foundation for every lower body session.
Always cap Front Squat and Deadlift at 6 reps maximum.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'lower_body_session_structure',
      goal: 'all',
      level: 'all',
      phase: 'both',
      topic: 'lower_body_session_templates'
    }
  },

  {
    id: 'prog_006',
    text: `
TOPIC: Microcycle structure for 4 days per week training
GOAL: all
LEVEL: intermediate, advanced
PHASE: both

For 4 sessions per week, two microcycles alternate weekly.

TRAINING SPLIT:
Monday: Upper Body 1
Tuesday: Lower Body 1
Wednesday: OFF
Thursday: Upper Body 2
Friday: Lower Body 2
Saturday: OFF / Sunday: OFF

MICROCYCLE 1:
Monday (UB1): Overhead Press
Tuesday (LB1): Squat 1
Thursday (UB2): Bench Press
Friday (LB2): Front Squat

MICROCYCLE 2:
Monday (UB1): Incline Press
Tuesday (LB1): Squat 2
Thursday (UB2): Dip
Friday (LB2): Deadlift

Microcycle 1 and 2 alternate each week throughout the block.

WHEN TO USE: When user trains 4 days per week. Most effective
and common KILO frequency. Intermediate to advanced lifters.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'microcycle_4x_week',
      goal: 'all',
      level: ['intermediate', 'advanced'],
      phase: 'both',
      frequency: 4,
      topic: 'microcycle_structure_4x'
    }
  },

  {
    id: 'prog_007',
    text: `
TOPIC: Microcycle structure for 3 days per week training
GOAL: all
LEVEL: beginner, intermediate
PHASE: both

For 3 sessions per week, four microcycles rotate. Each
microcycle runs for one full training phase before rotating.

TRAINING SPLIT (alternates week to week):
Option A: Monday Upper / Wednesday Lower / Friday Upper
Option B: Monday Lower / Wednesday Upper / Friday Lower

MICROCYCLE 1:
Upper Body: Overhead Press
Lower Body: Squat 1

MICROCYCLE 2:
Upper Body: Incline Press
Lower Body: Front Squat

MICROCYCLE 3:
Upper Body: Bench Press
Lower Body: Squat 2

MICROCYCLE 4:
Upper Body: Dip
Lower Body: Deadlift

Each microcycle repeats for the full phase (3 sessions each
exercise) before rotating to the next pair. This repeated
exposure builds motor pattern efficiently.

WHEN TO USE: When user trains 3 days per week. Suitable for
beginners and intermediates. Good for building consistency
and motor pattern before moving to 4x per week.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'microcycle_3x_week',
      goal: 'all',
      level: ['beginner', 'intermediate'],
      phase: 'both',
      frequency: 3,
      topic: 'microcycle_structure_3x'
    }
  },

  {
    id: 'prog_008',
    text: `
TOPIC: Microcycle structure for 2 days per week training
GOAL: all
LEVEL: beginner
PHASE: both

For 2 sessions per week, use full body sessions combining
upper and lower primary exercises in one workout.

TRAINING SPLIT:
Monday: Full Body 1
Thursday: Full Body 2
(3 days between sessions for recovery)

MICROCYCLE 1:
Full Body 1 (Monday): Squat 1 and Overhead Press
Full Body 2 (Thursday): Front Squat and Incline Press

MICROCYCLE 2:
Full Body 1 (Monday): Squat 2 and Bench Press
Full Body 2 (Thursday): Deadlift and Dip

FULL BODY SESSION STRUCTURE:
A: Lower body primary — 3-4 x 1-12 — rest 180-240s
B1: Upper body primary press — 3-4 x 1-12 — rest 90-120s
B2: Chin-Up — 3-4 x 1-12 — rest 90-120s
C1: Lower body assistance — 2-3 x 6-12 — rest 60-90s
C2: Lower body assistance — 2-3 x 6-12 — rest 60-90s
D1: Upper body assistance press — 2-3 x 6-10 — rest 60-90s
D2: Upper body assistance pull — 2-3 x 6-10 — rest 60-90s

Fewer sets than 3x or 4x to manage total volume and recovery.

WHEN TO USE: When user can only train 2 days per week.
Best for beginners or very limited schedules.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'microcycle_2x_week',
      goal: 'all',
      level: ['beginner'],
      phase: 'both',
      frequency: 2,
      topic: 'microcycle_structure_2x'
    }
  },

  {
    id: 'prog_009',
    text: `
TOPIC: Chin-Up progression for lifters who cannot yet do Chin-Ups
GOAL: all
LEVEL: beginner
PHASE: accumulation

When a lifter cannot perform a full Chin-Up, run through
these three phases in order before programming standard Chin-Ups.
First build to 12 reps on a 2-0-1-0 tempo, then switch to
normal 4-0-X-0 tempo with a full rep scheme.

PHASE 1 — 10-Second Eccentric:
A1: Primary Press — 4-6 x 1-12 — 4-0-X-0 — 90-120s
A2: Chin-Up Medium Neutral 10-sec eccentric — 4-6 x 2-4 — 10-0-0-0 — 10s
A3: Pulldown Medium Neutral — 4-6 x 8-10 — 4-0-1-0 — 90-120s
Complete until: 15 total 10-second eccentric reps achieved

PHASE 2 — Pause Eccentric:
A1: Primary Press — 4-6 x 1-12 — 4-0-X-0 — 90-120s
A2: Chin-Up Medium Neutral pause eccentric — 4-6 x 2-4 — 3-10-0-0 — 10s
A3: Pulldown Medium Neutral — 4-6 x 6-8 — 4-0-1-0 — 90-120s
Complete until: 12 total pause eccentric reps achieved

PHASE 3 — Ankle Assistance:
A1: Primary Press — 4-6 x 1-12 — 4-0-X-0 — 90-120s
A2: Chin-Up Medium Neutral Ankle Assist — 4-6 x 4-6 — 4-0-1-0 — 90-120s
Complete until: 6 unassisted full reps achieved

WHEN TO USE: When a beginner cannot do a single full Chin-Up.
Complete all three phases in order. Only advance to the next
phase when the completion criteria is met.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'chinup_progression',
      goal: 'all',
      level: ['beginner'],
      phase: 'accumulation',
      topic: 'chinup_beginner_progression'
    }
  },

  {
    id: 'prog_010',
    text: `
TOPIC: Dip progression for lifters who cannot yet do Dips
GOAL: all
LEVEL: beginner
PHASE: accumulation

When a lifter cannot perform a full Dip, run through these
three phases in order before programming standard Dips.

PHASE 1 — 10-Second Eccentric:
A1: Dip 10-sec eccentric — 4-6 x 2-4 — 10-0-0-0 — 10s
A2: Push-Up — 4-6 x 8-10 — 4-0-1-0 — 90-120s
A3: Pull-Up Pronated Grip — 4-6 x 1-12 — 4-0-X-0 — 90-120s
Complete until: 15 total 10-second eccentric reps achieved

PHASE 2 — Pause Eccentric:
A1: Dip pause eccentric — 4-6 x 2-4 — 3-10-0-0 — 10s
A2: Push-Up — 4-6 x 6-8 — 4-0-1-0 — 90-120s
A3: Pull-Up Pronated Grip — 4-6 x 1-12 — 4-0-X-0 — 90-120s
Complete until: 12 total pause eccentric reps achieved

PHASE 3 — Ankle Assistance:
A1: Dip Ankle Assistance — 4-6 x 4-6 — 4-0-1-0 — 90-120s
A2: Pull-Up Pronated Grip — 4-6 x 1-12 — 4-0-X-0 — 90-120s
Complete until: 6 unassisted full reps achieved

WHEN TO USE: When a beginner cannot perform any full Dips.
Complete all three phases in sequence before programming
regular Dips in the plan.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'dip_progression',
      goal: 'all',
      level: ['beginner'],
      phase: 'accumulation',
      topic: 'dip_beginner_progression'
    }
  },

  {
    id: 'prog_011',
    text: `
TOPIC: Specialty Squat and Specialty Deadlift progression order
GOAL: all
LEVEL: intermediate, advanced
PHASE: both

Specialty exercises go in the B series of lower body sessions.
They address weaknesses and add variation to primary lifts.
Follow the progression order — one new specialty per phase.

SPECIALTY SQUAT PROGRESSION ORDER:
1. Squat - Hack - BB
2. Squat - Pin Touch - Top Range
3. Squat - Cyclist Squat - BB
4. Squat - Pin Touch - Mid Range
5. Squat - Quad - BB
6. Squat - Inertia - Top Range
7. Squat - Heel Elevated - BB
8. Squat - Inertia - Mid Range

Used in: Squat Session 2 (B series)

SPECIALTY DEADLIFT PROGRESSION ORDER:
1. Deadlift - Rack - Mid Thigh - BB - Wide Grip
2. Deadlift - Rack - Above Knee - BB - Medium Grip
3. Deadlift - Rack - Below Knee - BB - Wide Grip
4. Deadlift - Trap Bar
5. Deadlift - Rack - Mid Thigh - BB - Medium Grip
6. Deadlift - Rack - Above Knee - BB - Wide Grip
7. Deadlift - Rack - Below Knee - BB - Medium Grip
8. Deadlift - Deficit - BB

Used in: Front Squat Session (B series)

SETS AND REPS:
Specialty Squat: 4-5 sets x 6-12 reps — 3-0-1-0 — 150-180s
Specialty Deadlift: 4-5 sets x 6-12 reps — 3-0-1-0 — 150-180s

WHEN TO USE: Use in B series of lower body sessions only.
Start at position 1 and advance one exercise per phase.
Intermediate to advanced lifters only.
    `.trim(),
    metadata: {
      source: 'program_design_resource',
      section: 'specialty_progressions',
      goal: 'all',
      level: ['intermediate', 'advanced'],
      phase: 'both',
      topic: 'specialty_squat_deadlift_progression'
    }
  }

]

export default chunks;