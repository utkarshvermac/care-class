/**
 * The Bunk-O-Meter Engine
 * ------------------------
 * Pure math functions that turn a raw attendance log into the numbers
 * a student actually cares about: current %, how many classes they can
 * still skip, and how many they must attend in a row to recover.
 *
 * "cancelled" classes are excluded from the denominator entirely —
 * they never happened, so they shouldn't help or hurt the percentage.
 */

/**
 * @param {number} present   Classes attended
 * @param {number} absent    Classes missed
 * @param {number} target    Target percentage (e.g. 75)
 * @returns {object} computed metrics for a single subject
 */
export function computeSubjectStats(present, absent, target = 75) {
  const totalHeld = present + absent;
  const percentage = totalHeld === 0 ? 100 : (present / totalHeld) * 100;
  const targetRatio = target / 100;

  let safeBunks = 0;
  let mustAttend = 0;
  let status = "on-track"; // on-track | safe | danger | critical

  if (targetRatio <= 0) {
    safeBunks = Infinity;
  } else if (targetRatio >= 1) {
    // 100% target: any absence breaks it
    safeBunks = 0;
  } else if (totalHeld === 0) {
    safeBunks = 0;
  } else if (percentage >= target) {
    // Solve for max n such that present / (totalHeld + n) >= targetRatio
    // n <= present/targetRatio - totalHeld
    safeBunks = Math.floor(present / targetRatio - totalHeld);
    safeBunks = Math.max(0, safeBunks);
  } else {
    // Solve for min n such that (present + n) / (totalHeld + n) >= targetRatio
    // n >= (target*totalHeld - present) / (1 - targetRatio)
    const numerator = targetRatio * totalHeld - present;
    const denominator = 1 - targetRatio;
    mustAttend = Math.ceil(numerator / denominator);
    mustAttend = Math.max(0, mustAttend);
  }

  if (percentage < target) {
    // How far below? Used purely to flag severity in the UI.
    const deficit = target - percentage;
    status = deficit >= 15 ? "critical" : "danger";
  } else {
    const cushion = percentage - target;
    status = cushion >= 10 ? "safe" : "on-track";
  }

  return {
    present,
    absent,
    totalHeld,
    percentage: Math.round(percentage * 100) / 100,
    target,
    safeBunks,
    mustAttend,
    status,
  };
}

/**
 * Aggregate stats across a full list of subjects, each already annotated
 * with { present, absent, targetPercentage }.
 */
export function computeOverallStats(subjects) {
  const totals = subjects.reduce(
    (acc, s) => {
      acc.present += s.present;
      acc.absent += s.absent;
      return acc;
    },
    { present: 0, absent: 0 }
  );

  const avgTarget =
    subjects.length === 0
      ? 75
      : subjects.reduce((a, s) => a + s.targetPercentage, 0) / subjects.length;

  const overall = computeSubjectStats(totals.present, totals.absent, avgTarget);

  const atRiskCount = subjects.filter(
    (s) => computeSubjectStats(s.present, s.absent, s.targetPercentage).percentage < s.targetPercentage
  ).length;

  return { ...overall, subjectCount: subjects.length, atRiskCount };
}
