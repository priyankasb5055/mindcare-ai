import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the FAQ dataset for fallback
const faqDataPath = path.join(__dirname, '../data/faqData.json');
let faqDataset = [];
try {
  const data = fs.readFileSync(faqDataPath, 'utf8');
  faqDataset = JSON.parse(data);
} catch (error) {
  console.error("Failed to load FAQ dataset:", error.message);
}

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const userMsg = message.toLowerCase().trim();

    // 1. Emergency Detection Logic
    const emergencyKeywords = [
      'i want to die', 'end my life', 'nobody needs me', 'i am suicidal', 'suicide', 'hurt myself',
      'cut myself', 'overdosed', 'cannot continue anymore', 'i am unsafe', 'feel trapped',
      'panic attack', 'want everything to stop', 'disappear forever', 'life is meaningless',
      'want to jump', 'being abused', 'hurting me', 'cannot breathe', 'extreme panic', 'hallucinating'
    ];

    if (emergencyKeywords.some(keyword => userMsg.includes(keyword))) {
      return res.json({
        success: true,
        data: {
          reply: "I’m really sorry you’re feeling this way. You do not have to go through this alone. Please contact a trusted person or mental health professional immediately. If you are in immediate danger, call your local emergency services or a crisis helpline now.",
          isCrisis: true
        }
      });
    }

    // 2. Greeting Logic
    const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'good evening', 'how are you', 'how are you doing'];
    if (greetings.includes(userMsg)) {
      return res.json({
        success: true,
        data: {
          reply: "Hello! I'm MindCare AI, your personal wellness companion. How are you feeling today?"
        }
      });
    }

    // 3. Normal Conversation via OpenAI
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You are MindCare AI, a compassionate mental wellness assistant. Give short, supportive, and empathetic responses. Draw inspiration from therapeutic communication.'
            },
            {
              role: 'user',
              content: message,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.json({
        success: true,
        data: {
          reply: response.data.choices[0].message.content,
        },
      });

    } catch (openaiError) {
      console.error("OpenAI API failed, falling back to stock answers:", openaiError.response?.data || openaiError.message);

      // FALLBACK: Implement simple keyword matching if OpenAI fails
      let bestMatch = null;
      let maxMatchCount = 0;

      const stopWords = ['i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours', 'yourself', 'yourselves', 'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself', 'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom', 'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an', 'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at', 'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now'];
      const words = userMsg.split(/\W+/).filter(w => w.length > 2 && !stopWords.includes(w));

      for (const qa of faqDataset) {
        const qWords = qa.question.toLowerCase().split(/\W+/);
        let matchCount = 0;
        for (const w of words) {
          if (qWords.includes(w)) matchCount++;
        }
        
        if (words.includes(qa.category.toLowerCase())) {
           matchCount += 2;
        }

        if (matchCount > maxMatchCount) {
          maxMatchCount = matchCount;
          bestMatch = qa;
        }
      }

      let reply = "I hear you, and your feelings are completely valid. I'm here to support you through whatever you're experiencing. Take a deep breath, and remember you're not alone.";

      if (bestMatch && maxMatchCount >= 1) {
        reply = bestMatch.answer;
      }

      return res.json({
        success: true,
        data: {
          reply: reply,
        },
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to process AI response',
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
      'panic attack', 'anxiety attack',
    ];

    const isCrisis = crisisKeywords.some((word) => combinedText.includes(word));

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: `
You are an advanced emotional wellness AI assistant.

Analyze the user's emotions carefully.

Your response MUST follow this exact format:

Emotional Summary:
...

Detected Emotional Pattern:
...

Stress Level: X/10

Happiness Score: X/10

Emotional Balance: X/10

Wellness Advice:
...

Positive Encouragement:
...

Keep response supportive, empathetic, and under 180 words.
`,
            },
            {
              role: 'user',
              content: `
Recent moods:
${moodData}

Recent journals:
${journalData}
`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const insight = response.data.choices[0].message.content;

      const stressMatch = insight.match(/Stress Level:\s*(\d+)/i);
      const happinessMatch = insight.match(/Happiness Score:\s*(\d+)/i);
      const balanceMatch = insight.match(/Emotional Balance:\s*(\d+)/i);

      const stressScore = stressMatch ? Number(stressMatch[1]) : 5;
      const happinessScore = happinessMatch ? Number(happinessMatch[1]) : 5;
      const balanceScore = balanceMatch ? Number(balanceMatch[1]) : 5;

      return res.json({
        success: true,
        data: {
          insight,
          stressScore,
          happinessScore,
          balanceScore,
          isCrisis,
        },
      });
      
    } catch (openaiError) {
      console.error("OpenAI API failed, falling back to mock mood analysis:", openaiError.response?.data || openaiError.message);
      
      // FALLBACK: Mock Insight
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

      return res.json({
        success: true,
        data: {
          insight: mockInsight.trim(),
          stressScore: 6,
          happinessScore: 5,
          balanceScore: 5,
          isCrisis,
        },
      });
    }

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

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'You generate thoughtful and emotional journaling prompts for mental wellness.',
            },
            {
              role: 'user',
              content: `Generate a short journaling prompt for someone feeling ${currentMood}.`,
            },
          ],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return res.json({
        success: true,
        data: {
          prompt: response.data.choices[0].message.content,
        },
      });
      
    } catch (openaiError) {
      console.error("OpenAI API failed, falling back to stock prompt:", openaiError.response?.data || openaiError.message);
      
      // FALLBACK: Random stock prompt
      const prompts = [
        "What is one small thing that brought you comfort today?",
        "Describe a feeling you've been avoiding lately. Why do you think it's hard to face?",
        "If your current emotion had a color and a shape, what would it look like?",
        "Write down three things you can forgive yourself for right now.",
        "What would you tell a friend who is feeling exactly the way you are today?"
      ];
      
      const randomPrompt = prompts[Math.floor(Math.random() * prompts.length)];

      return res.json({
        success: true,
        data: {
          prompt: randomPrompt,
        },
      });
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate prompt',
    });
  }
};