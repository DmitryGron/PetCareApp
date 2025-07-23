export const REMINDER_TYPES = [
  { value: "feeding", label: "Feeding", icon: "🍽️" },
  { value: "walking", label: "Walking", icon: "🚶" },
  { value: "watering", label: "Watering", icon: "💧" },
  { value: "vet", label: "Vet Visit", icon: "🏥" },
  { value: "grooming", label: "Grooming", icon: "✂️" },
  { value: "medication", label: "Medication", icon: "💊" },
  { value: "other", label: "Other", icon: "📝" },
];

export const RECURRENCE_OPTIONS = [
  { value: undefined, label: "No Repeat" },
  { value: "daily" as "daily", label: "Daily" },
  { value: "weekly" as "weekly", label: "Weekly" },
  { value: "monthly" as "monthly", label: "Monthly" },
  { value: "yearly" as "yearly", label: "Yearly" },
];
