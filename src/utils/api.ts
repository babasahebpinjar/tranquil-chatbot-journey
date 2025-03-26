
import { toast } from "@/components/ui/use-toast";

const API_BASE_URL = "http://localhost:8000";

export async function sendChatMessage(username: string, message: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/chatbot`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        message,
      }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Failed to send message:", error);
    toast({
      title: "Connection Error",
      description: "Failed to connect to the chatbot server. Please try again later.",
      variant: "destructive",
    });
    
    // Return a fallback response for better UX
    return {
      response: "I'm currently unable to connect to my knowledge base. Please check your connection and try again later."
    };
  }
}

// These are the daily quotes the chatbot can provide
const DAILY_QUOTES = [
  "The best way to find yourself is to lose yourself in the service of others. - Mahatma Gandhi",
  "Peace comes from within. Do not seek it without. - Buddha",
  "The wound is the place where the Light enters you. - Rumi",
  "We are not human beings having a spiritual experience. We are spiritual beings having a human experience. - Pierre Teilhard de Chardin",
  "The soul always knows what to do to heal itself. The challenge is to silence the mind. - Caroline Myss",
  "You are not a drop in the ocean. You are the entire ocean in a drop. - Rumi",
  "Your task is not to seek for love, but merely to seek and find all the barriers within yourself that you have built against it. - Rumi",
  "The privilege of a lifetime is to become who you truly are. - Carl Jung",
  "The spiritual journey is the unlearning of fear and the acceptance of love. - Marianne Williamson",
  "When you realize there is nothing lacking, the whole world belongs to you. - Lao Tzu",
  "Quiet the mind, and the soul will speak. - Ma Jaya Sati Bhagavati",
  "You are never alone. You are eternally connected with everyone. - Amit Ray",
  "Be here now. - Ram Dass",
  "Faith is the bird that feels the light when the dawn is still dark. - Rabindranath Tagore",
  "Within you is a stillness and sanctuary to which you can retreat at any time. - Hermann Hesse",
];

export function getDailyQuote() {
  // Get a consistent quote for the day based on date
  const today = new Date();
  const startOfYear = new Date(today.getFullYear(), 0, 0);
  const diffTime = today.getTime() - startOfYear.getTime();
  const dayOfYear = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  const quoteIndex = dayOfYear % DAILY_QUOTES.length;
  
  return DAILY_QUOTES[quoteIndex];
}

// Common affirmations for the affirmation generator
export const AFFIRMATIONS = {
  peace: [
    "I am at peace with myself and the world around me.",
    "Tranquility flows through me with each breath I take.",
    "I release all tension and embrace inner calm.",
    "Peace is my natural state of being.",
    "I am centered, calm, and at ease."
  ],
  love: [
    "I am worthy of love and compassion.",
    "My heart is open to giving and receiving love.",
    "I attract loving relationships into my life.",
    "I am love in its purest form.",
    "Divine love flows through me and connects me to all beings."
  ],
  strength: [
    "I have the strength to overcome any challenge.",
    "I am resilient and grow stronger each day.",
    "My inner power is limitless.",
    "I face difficulties with courage and wisdom.",
    "I am strong in mind, body, and spirit."
  ],
  growth: [
    "I embrace change as an opportunity for growth.",
    "Every experience is a chance to learn and evolve.",
    "I am constantly evolving into my highest self.",
    "My spiritual growth expands with each passing day.",
    "I welcome new wisdom into my life."
  ],
  gratitude: [
    "I am grateful for all the blessings in my life.",
    "Thankfulness fills my heart and soul.",
    "I see the divine gift in every moment.",
    "Gratitude transforms my perspective and brings me joy.",
    "I appreciate the abundance that surrounds me."
  ]
};

// Get affirmations based on mood
export function getAffirmations(mood: keyof typeof AFFIRMATIONS) {
  return AFFIRMATIONS[mood] || AFFIRMATIONS.peace;
}
