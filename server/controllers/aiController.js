import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the FAQ dataset
const faqDataPath = path.join(__dirname, '../data/faqData.json');
let faqDataset = [];
try {
  const data = fs.readFileSync(faqDataPath, 'utf8');
  faqDataset = JSON.parse(data);
} catch (error) {
  console.error("Failed to load FAQ dataset:", error);
}

// Mock AI Controller to provide stock responses instead of calling OpenAI API
// This avoids the 500 error due to insufficient API quota

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    // Implement simple keyword matching
    const userMsg = message.toLowerCase();
    let bestMatch = null;
    let maxMatchCount = 0;

    // Filter out common stop words and keep meaningful words
    const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
    const words = userMsg.split(/\W+/).filter(w => w.length > 2 && !stopWords.includes(w));

    for (const qa of faqDataset) {
      const qWords = qa.question.toLowerCase().split(/\W+/);
      let matchCount = 0;
      for (const w of words) {
        if (qWords.includes(w)) matchCount++;
      }
      
      // Bonus points if the category matches the user's words
      if (words.includes(qa.category.toLowerCase())) {
         matchCount += 2;
      }

      if (matchCount > maxMatchCount) {
        maxMatchCount = matchCount;
        bestMatch = qa;
      }
    }

    let reply = "I hear you, and your feelings are completely valid. I'm here to support you through whatever you're experiencing. Take a deep breath, and remember you're not alone.";

    // If we found a reasonable match (at least 1 significant keyword matched)
    if (bestMatch && maxMatchCount >= 1) {
      reply = bestMatch.answer;
    }

    // Mock AI Response
    setTimeout(() => {
      res.json({
        success: true,
        data: {
          reply: reply,
        },
      });
    }, 1000);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate AI response',
    });
  }
};

export const analyzeMood = async (req, res) => {
  try {
    const { recentMoods, recentJournals } = req.body;

    const moodData = recentMoods?.map((m) => m.mood).join(', ') || '';
    const journalData = recentJournals?.map((j) => j.content).join(' ') || '';
    const combinedText = `${moodData} ${journalData}`.toLowerCase();

    const crisisKeywords = [
      'hopeless', 'suicide', 'kill myself', 'self harm', 'depressed', 
      'worthless', 'alone', 'die', 'give up', 'empty', 'hate my life', 
      'panic attack', 'anxiety attack'
    ];

    const isCrisis = crisisKeywords.some((word) => combinedText.includes(word));

    const mockInsight = `
Emotional Summary:
Based on your recent check-ins, you seem to be experiencing a mix of emotions. Acknowledging these feelings is a great first step towards balance.

Detected Emotional Pattern:
There's a natural fluctuation in your mood, which is completely normal. Remember to give yourself grace on the harder days.

Stress Level: 6/10

Happiness Score: 5/10

Emotional Balance: 5/10

Wellness Advice:
Try to incorporate small moments of mindfulness into your day. Even 5 minutes of deep breathing can help reset your nervous system.

Positive Encouragement:
You are doing your best, and that is more than enough. Keep prioritizing your mental wellness—you deserve it!
`;

    setTimeout(() => {
      res.json({
        success: true,
        data: {
          insight: mockInsight.trim(),
          stressScore: 6,
          happinessScore: 5,
          balanceScore: 5,
          isCrisis,
        },
      });
    }, 1500);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to analyze mood',
    });
  }
};

export const getJournalPrompt = async (req, res) => {
  try {
    const { currentMood } = req.body;

    const prompts = [
      "What is one small thing that brought you comfort today?",
      "Describe a feeling you've been avoiding lately. Why do you think it's hard to face?",
      "If your current emotion had a color and a shape, what would it look like?",
      "Write down three things you can forgive yourself for right now.",
      "What would you tell a friend who is feeling exactly the way you are today?"
    ];
    
    // Pick a random prompt
    const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

    setTimeout(() => {
      res.json({
        success: true,
        data: {
          prompt: randomPrompt,
        },
      });
    }, 800);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate prompt',
    });
  }
};