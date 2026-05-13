import axios from 'axios';

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        success: false,
        message: 'Message is required',
      });
    }

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are MindCare AI, a compassionate mental wellness assistant. Give short supportive responses.',
          },
          {
            role: 'user',
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      success: true,
      data: {
        reply: response.data.choices[0].message.content,
      },
    });

  } catch (error) {
    console.error(
      error.response?.data || error.message
    );

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

    const journalData =
      recentJournals?.map((j) => j.content).join(' ') || '';
      const combinedText = `${moodData} ${journalData}`.toLowerCase();

      const crisisKeywords = [
        'hopeless',
        'suicide',
        'kill myself',
        'self harm',
        'depressed',
        'worthless',
        'alone',
        'die',
        'give up',
        'empty',
        'hate my life',
        'panic attack',
        'anxiety attack',
      ];

      const isCrisis = crisisKeywords.some((word) =>
        combinedText.includes(word)
      );

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',

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
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const insight =
      response.data.choices[0].message.content;

    const stressMatch = insight.match(/Stress Level:\s*(\d+)/i);
    const happinessMatch = insight.match(/Happiness Score:\s*(\d+)/i);
    const balanceMatch = insight.match(/Emotional Balance:\s*(\d+)/i);

    const stressScore = stressMatch ? Number(stressMatch[1]) : 5;
    const happinessScore = happinessMatch ? Number(happinessMatch[1]) : 5;
    const balanceScore = balanceMatch ? Number(balanceMatch[1]) : 5;

    res.json({
      success: true,
      data: {
        insight,
        stressScore,
        happinessScore,
        balanceScore,
        isCrisis,
      },
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to analyze mood',
    });
  }
};

export const getJournalPrompt = async (req, res) => {
  try {
    const { currentMood } = req.body;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You generate thoughtful and emotional journaling prompts for mental wellness.',
          },
          {
            role: 'user',
            content: `Generate a short journaling prompt for someone feeling ${currentMood}.`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.json({
      success: true,
      data: {
        prompt:
          response.data.choices[0].message.content,
      },
    });

  } catch (error) {
    console.error(error.response?.data || error.message);

    res.status(500).json({
      success: false,
      message: 'Failed to generate prompt',
    });
  }
};