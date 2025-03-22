import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Interface for the result from credit calculation
export interface CreditCalculationResult {
  totalCredits: number;
  timeFactor: number;
  difficultyFactor: number;
  qualityFactor: number;
  bonusCredits: number;
  latePenalty: number;
  explanation: string;
}

/**
 * Calculate credits for a task completion using Groq AI
 * 
 * @param taskDifficulty - Difficulty level of task (1-10)
 * @param timeExpected - Expected time to complete (minutes)
 * @param timeActual - Actual time taken (minutes)
 * @param isOverdue - Whether the task was completed after due date
 * @param submissionQuality - Description of submission (used for quality assessment)
 * @param userPastPerformance - User's past performance metrics (optional)
 */
export async function calculateCredits(
  taskDifficulty: number,
  timeExpected: number,
  timeActual: number,
  isOverdue: boolean,
  submissionQuality: string,
  userPastPerformance?: { completedTasks: number; avgCredits: number }
): Promise<CreditCalculationResult> {
  try {
    // Prepare the prompt for Groq
    const prompt = `
      You are an AI tasked with calculating fair credit points for a completed task.
      
      Task Details:
      - Difficulty (1-10 scale): ${taskDifficulty}
      - Expected completion time: ${timeExpected} minutes
      - Actual completion time: ${timeActual} minutes
      - Submission is overdue: ${isOverdue}
      - Submission description: "${submissionQuality}"
      ${userPastPerformance ? `- User history: ${userPastPerformance.completedTasks} tasks completed with average ${userPastPerformance.avgCredits} credits` : ''}
      
      Please calculate credits based on:
      1. Difficulty factor (harder tasks = more credits)
      2. Time efficiency (faster than expected = bonus)
      3. Quality assessment (based on submission description)
      4. Penalties for overdue submissions
      
      Return a JSON object with:
      {
        "totalCredits": number,
        "timeFactor": number,
        "difficultyFactor": number, 
        "qualityFactor": number,
        "bonusCredits": number,
        "latePenalty": number,
        "explanation": "detailed explanation of calculation"
      }
    `;

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are a fair credit calculation system. Analyze task completions and assign credit points based on multiple factors. Only respond with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "mixtral-8x7b-32768",
      temperature: 0.5,
      max_tokens: 1000,
      response_format: { type: "json_object" }
    });

    // Parse the response
    const result = JSON.parse(completion.choices[0]?.message?.content || '{}');
    
    return {
      totalCredits: result.totalCredits || 0,
      timeFactor: result.timeFactor || 0,
      difficultyFactor: result.difficultyFactor || 0,
      qualityFactor: result.qualityFactor || 0,
      bonusCredits: result.bonusCredits || 0,
      latePenalty: result.latePenalty || 0,
      explanation: result.explanation || 'No explanation provided'
    };
  } catch (error) {
    console.error('Error calculating credits with Groq:', error);
    
    // Fallback calculation if Groq API fails
    const baseDifficulty = taskDifficulty * 2;
    const timeRatio = timeActual > 0 ? timeExpected / timeActual : 1;
    const timeFactor = Math.min(Math.max(timeRatio, 0.5), 1.5);
    const penalty = isOverdue ? 0.75 : 1;
    
    return {
      totalCredits: Math.round(baseDifficulty * timeFactor * penalty),
      timeFactor: timeFactor,
      difficultyFactor: baseDifficulty,
      qualityFactor: 1,
      bonusCredits: 0,
      latePenalty: isOverdue ? (baseDifficulty * 0.25) : 0,
      explanation: 'Fallback calculation used due to AI service error'
    };
  }
} 