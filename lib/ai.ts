import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

interface AIResponse {
  message: string;
  error?: string;
  errorType?: 'rate_limit' | 'api_key' | 'network' | 'model' | 'unknown';
}

// Global state for AI service
let apiKey: string | null = null;
const baseUrl = 'https://api.openai.com/v1';

// Initialize AI service
const initialize = async (): Promise<void> => {
  try {
    // Load API key from storage
    apiKey = await AsyncStorage.getItem('ai_api_key');
    console.log('AI Service initialized, API key loaded:', apiKey ? 'Yes' : 'No');
  } catch (error) {
    console.error('Failed to initialize AI service:', error);
  }
};

// Save API key
const setApiKey = async (key: string): Promise<void> => {
  apiKey = key;
  await AsyncStorage.setItem('ai_api_key', key);
  console.log('API key saved and loaded in AI service');
};

// Get axios instance with current API key
const getApiClient = () => {
  return axios.create({
    baseURL: baseUrl,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
  });
};

// Build system prompt for AI
const buildSystemPrompt = (petContext?: any): string => {
  let systemPrompt = "You are a helpful pet care assistant. Provide friendly, accurate advice for pet owners.";

  // Add pet context if available
  if (petContext) {
    const { name, species, breed, age } = petContext;
    systemPrompt += `\n\nThe user has a ${species || 'pet'}${breed ? ` (${breed})` : ''} named ${name || 'their pet'}${age ? ` who is ${age} years old` : ''}.`;
  }

  return systemPrompt;
};

// Send message to AI
const sendMessage = async (message: string, petContext?: any): Promise<AIResponse> => {
  if (!apiKey) {
    return {
      message: "I'm here to help with pet care advice! To use the AI assistant, please add your OpenAI API key in the settings.",
      error: 'No API key configured',
      errorType: 'api_key'
    };
  }

  try {
    const systemPrompt = buildSystemPrompt(petContext);
    const openAI = getApiClient();
    
    const response = await openAI.post('/chat/completions', {
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    return {
      message: response.data.choices[0]?.message?.content || 'Sorry, I could not generate a response.',
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    
    // Handle different error types with user-friendly messages
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with non-2xx status
        const status = error.response.status;
        
        if (status === 401) {
          return {
            message: 'Your API key appears to be invalid or has expired. Please check your OpenAI API key in the settings.',
            error: 'Invalid API key',
            errorType: 'api_key'
          };
        } else if (status === 429) {
          return {
            message: 'You\'ve reached the rate limit for AI requests. This could be because you\'ve made too many requests or exceeded your quota. Please try again later or check your OpenAI account for quota information.',
            error: 'Rate limit exceeded',
            errorType: 'rate_limit'
          };
        } else if (status === 404) {
          return {
            message: 'The AI model requested is not available. This might be a temporary issue or the model might have been deprecated.',
            error: 'Model not found',
            errorType: 'model'
          };
        } else {
          return {
            message: `The AI service encountered an error (${status}). Please try again later.`,
            error: `API returned status ${status}`,
            errorType: 'unknown'
          };
        }
      } else if (error.request) {
        // Request made but no response received (network error)
        return {
          message: 'Unable to reach the AI service. Please check your internet connection and try again.',
          error: 'Network error',
          errorType: 'network'
        };
      }
    }
    
    // Default error case for non-axios errors
    return {
      message: 'Sorry, I encountered an error while processing your request. Please try again later.',
      error: error instanceof Error ? error.message : 'Unknown error',
      errorType: 'unknown'
    };
  }
};

// Get a mock response for offline/demo use
const getMockResponse = (message: string): AIResponse => {
  return {
    message: "This is a mock response. To get real AI responses, please add your OpenAI API key in settings.",
  };
};

// Initialize the service when imported
initialize().catch(console.error);

// Export all functions
export const aiService = {
  initialize,
  setApiKey,
  sendMessage,
  getMockResponse
};

// Chat history management
export const saveChatHistory = async (messages: AIMessage[]): Promise<void> => {
  try {
    await AsyncStorage.setItem('ai_chat_history', JSON.stringify(messages));
  } catch (error) {
    console.error('Failed to save chat history:', error);
  }
};

export const loadChatHistory = async (): Promise<AIMessage[]> => {
  try {
    const history = await AsyncStorage.getItem('ai_chat_history');
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Failed to load chat history:', error);
    return [];
  }
};

export const clearChatHistory = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem('ai_chat_history');
  } catch (error) {
    console.error('Failed to clear chat history:', error);
  }
};