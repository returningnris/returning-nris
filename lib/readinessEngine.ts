// /lib/readinessEngine.ts
export type Answers = {
  incomeSecured: boolean
  savingsMonths: number
  taxAwareness: "low" | "medium" | "high"
  housingReady: boolean
  insuranceReady: boolean
  familyReady: boolean
}

export function calculateReadiness(answers: Answers) {
  let score = 0

  if (answers.incomeSecured) score += 25
  if (answers.savingsMonths >= 12) score += 20
  if (answers.taxAwareness === "high") score += 15
  if (answers.housingReady) score += 15
  if (answers.insuranceReady) score += 15
  if (answers.familyReady) score += 10

  let status = "Not Ready"
  if (score >= 70) status = "Ready"
  else if (score >= 40) status = "Moderately Ready"

  let recommendation = ""
  if (score < 40) {
    recommendation = "Delay your move and strengthen financial and income stability."
  } else if (score < 70) {
    recommendation = "You are close, but improving key areas will ensure a smoother transition."
  } else {
    recommendation = "You are in a strong position to move to India."
  }

  return {
    score,
    status,
    recommendation,
    breakdown: {
      income: answers.incomeSecured,
      savings: answers.savingsMonths,
      tax: answers.taxAwareness,
      housing: answers.housingReady,
      insurance: answers.insuranceReady,
      family: answers.familyReady
    }
  }
}