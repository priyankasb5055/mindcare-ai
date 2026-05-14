const fs = require('fs');

const topics = [
  {
    category: "Anxiety",
    questions: [
      "How can I calm down when I feel anxious?",
      "What are the symptoms of an anxiety attack?",
      "Why do I overthink everything at night?",
      "How do I stop feeling nervous about the future?",
      "Is it normal to feel anxious for no reason?"
    ],
    answers: [
      "Taking deep, slow breaths can help signal to your body that you are safe. Try the 4-7-8 breathing technique.",
      "Symptoms can include a rapid heart rate, sweating, trembling, feeling short of breath, and a sense of impending doom.",
      "At night, there are fewer distractions, so our minds tend to focus on unresolved worries. Writing them down before bed can help.",
      "Focusing on the present moment through mindfulness can reduce anxiety about the future. Take it one day at a time.",
      "Yes, generalized anxiety can sometimes occur without a clear trigger. Grounding techniques can help bring you back to the present."
    ]
  },
  {
    category: "Depression",
    questions: [
      "Why do I feel so tired all the time?",
      "How can I find motivation when I feel empty?",
      "Is it okay that I don't want to get out of bed?",
      "What should I do when I feel hopeless?",
      "How do I explain my depression to my friends?"
    ],
    answers: [
      "Depression can be physically exhausting. It's important to rest, but also try to maintain a gentle daily routine.",
      "Start with very small, achievable goals. Celebrate tiny victories, like drinking a glass of water or opening the curtains.",
      "It's okay to have low energy days. Be gentle with yourself, but try to slowly introduce small activities when you can.",
      "When hopelessness sets in, it's crucial to reach out. Talk to someone you trust or a professional. You don't have to carry this alone.",
      "You can be honest and say, 'I'm going through a tough time with my mental health and my energy is low, but I still care about you.'"
    ]
  },
  {
    category: "Stress",
    questions: [
      "How can I manage stress at work?",
      "Why does stress make my body ache?",
      "What are quick ways to relieve stress?",
      "How do I balance my personal life and work?",
      "Can stress affect my sleep?"
    ],
    answers: [
      "Take regular short breaks, prioritize tasks, and practice setting healthy boundaries with your workload.",
      "Stress causes muscles to tense up as part of the 'fight or flight' response, which can lead to aches and tension over time.",
      "Quick walks, stretching, listening to calming music, and deep breathing are effective ways to immediately lower stress.",
      "Establish a clear routine where work ends at a specific time, and dedicate your evenings to unwinding and hobbies.",
      "Absolutely. Stress increases cortisol, which makes it hard for your brain to wind down. A relaxing bedtime routine can help."
    ]
  },
  {
    category: "Self-Esteem",
    questions: [
      "How can I stop comparing myself to others?",
      "What are ways to build self-confidence?",
      "Why do I hate how I look?",
      "How do I deal with feelings of worthlessness?",
      "How can I learn to love myself?"
    ],
    answers: [
      "Remember that social media is a highlight reel. Focus on your own growth and celebrate your unique journey.",
      "Acknowledge your strengths, set small goals and achieve them, and practice self-compassion when you make mistakes.",
      "Body image issues are common. Try focusing on what your body can do rather than just how it looks, and limit exposure to unrealistic beauty standards.",
      "Remind yourself that your worth is inherent and not tied to productivity or external validation. You matter just as you are.",
      "Self-love is a practice. Start by treating yourself with the same kindness and understanding you would offer a good friend."
    ]
  },
  {
    category: "Relationships",
    questions: [
      "How do I set boundaries with toxic family members?",
      "What should I do if I feel lonely?",
      "How do I communicate my feelings to my partner?",
      "Is it normal to lose friends as you get older?",
      "How do I get over a breakup?"
    ],
    answers: [
      "Be clear and firm about what behaviors you will not accept, and limit contact if your boundaries are repeatedly disrespected.",
      "Loneliness is tough. Try joining clubs, volunteering, or exploring hobbies where you can meet like-minded people.",
      "Use 'I feel' statements to express your emotions without blaming them, such as 'I feel overwhelmed when...'",
      "Yes, it is very normal. As we grow, our priorities and paths change, and it's natural for some friendships to fade.",
      "Allow yourself to grieve, lean on your support system, and focus on rediscovering your own identity outside the relationship."
    ]
  }
];

const modifiers = [
  "Can you tell me ", "I was wondering, ", "Do you know ", 
  "Please explain ", "Help me understand ", "I need advice on this: ", 
  "What are your thoughts on this: ", "How should I handle this: ", 
  "I'm struggling with this: ", "", "Could you assist me with: ", 
  "I have a question: ", "Can you advise me on: ", 
  "I am curious about: ", "What is the best way to deal with: ", 
  "Is there a solution for: ", "Tell me more about: ", 
  "I really want to know: ", "Quick question: ", "How do you approach: "
];

const generatedQA = [];
let idCounter = 1;

for (const topic of topics) {
  for (let i = 0; i < topic.questions.length; i++) {
    for (const modifier of modifiers) {
      const baseQ = topic.questions[i];
      const answer = topic.answers[i];
      let finalQ = modifier + (modifier === "" ? baseQ : baseQ.charAt(0).toLowerCase() + baseQ.slice(1));
      
      generatedQA.push({
        id: idCounter++,
        category: topic.category,
        question: finalQ,
        answer: answer
      });

      if (generatedQA.length >= 500) break;
    }
    if (generatedQA.length >= 500) break;
  }
  if (generatedQA.length >= 500) break;
}

fs.writeFileSync('faq_dataset.json', JSON.stringify(generatedQA, null, 2));
console.log(`Successfully generated ${generatedQA.length} Q&A pairs in faq_dataset.json`);
