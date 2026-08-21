// Mirrors server/utils/bunkEngine.js so the UI can render instantly
// while the network request settles in the background.
export function computeSubjectStats(present, absent, target = 75) {
  const totalHeld = present + absent;
  const percentage = totalHeld === 0 ? 100 : (present / totalHeld) * 100;
  const targetRatio = target / 100;

  let safeBunks = 0;
  let mustAttend = 0;

  if (targetRatio >= 1) {
    safeBunks = 0;
  } else if (totalHeld === 0) {
    safeBunks = 0;
  } else if (percentage >= target) {
    safeBunks = Math.max(0, Math.floor(present / targetRatio - totalHeld));
  } else {
    const numerator = targetRatio * totalHeld - present;
    const denominator = 1 - targetRatio;
    mustAttend = Math.max(0, Math.ceil(numerator / denominator));
  }

  let status;
  if (percentage < target) {
    status = target - percentage >= 15 ? "critical" : "danger";
  } else {
    status = percentage - target >= 10 ? "safe" : "on-track";
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

export const statusMeta = {
  safe: { label: "Safe zone", color: "present" },
  "on-track": { label: "On track", color: "gold" },
  danger: { label: "At risk", color: "absent" },
  critical: { label: "Critical", color: "absent" },
};

export const todayISO = () => {
  const d = new Date();
  const tzOffset = d.getTimezoneOffset() * 60000;
  return new Date(d - tzOffset).toISOString().slice(0, 10);
};

export const formatDateLabel = (isoDate) => {
  const d = new Date(isoDate + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
};
