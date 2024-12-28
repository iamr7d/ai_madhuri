import { Groq } from 'groq-sdk';
import { getWeatherData, generateWeatherPrompt } from './weatherService';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export async function generateText(type: string, prompt?: string): Promise<string> {
  try {
    let finalPrompt = '';

    switch (type) {
      case 'Weather':
        const weatherData = await getWeatherData();
        finalPrompt = generateWeatherPrompt(weatherData);
        break;
      case 'TTS':
        finalPrompt = `Create a radio script about ${prompt || 'technology and innovation'}. Make it sound natural and engaging, as if an RJ is speaking live.`;
        break;
      case 'News':
        finalPrompt = `Create a news update about ${prompt || 'technology and current events'}.`;
        break;
      default:
        throw new Error('Invalid content type');
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a professional radio content writer. Create engaging, clear, and concise content suitable for radio broadcast.'
        },
        {
          role: 'user',
          content: finalPrompt
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1,
      stream: false,
    });

    return completion.choices[0]?.message?.content || 'Failed to generate content';
  } catch (error) {
    console.error('Error generating text:', error);
    throw new Error('Failed to generate content');
  }
}

export async function verifyContent(text: string): Promise<{ isValid: boolean; feedback: string }> {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a content moderator for a family-friendly radio station. 
            Verify if the content is appropriate and provide feedback.
            Respond with either "VALID" or "INVALID" followed by a brief explanation.`
        },
        {
          role: 'user',
          content: `Please verify this radio script: "${text}"`
        }
      ],
      model: 'mixtral-8x7b-32768',
      temperature: 0.3,
      max_tokens: 100,
      top_p: 1,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content || '';
    const isValid = response.toUpperCase().includes('VALID');
    const feedback = response.replace(/(VALID|INVALID)/i, '').trim();

    return {
      isValid,
      feedback
    };
  } catch (error) {
    console.error('Error verifying content:', error);
    throw new Error('Failed to verify content');
  }
}

export async function generateTTSAudio(text: string): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    try {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; // Slightly slower for better clarity
      utterance.pitch = 1;
      utterance.volume = 1;
      utterance.voice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'en-US') || null;
      
      // Create audio context and nodes
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const mediaStreamDestination = audioContext.createMediaStreamDestination();
      
      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(mediaStreamDestination.stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        try {
          const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
          const arrayBuffer = await audioBlob.arrayBuffer();
          resolve(arrayBuffer);
        } catch (error) {
          reject(error);
        }
      };

      // Start recording
      mediaRecorder.start();

      // Speak the text
      window.speechSynthesis.speak(utterance);

      utterance.onend = () => {
        try {
          oscillator.disconnect();
          mediaRecorder.stop();
          audioContext.close();
        } catch (error) {
          console.error('Error stopping TTS:', error);
          reject(error);
        }
      };

      utterance.onerror = (event) => {
        console.error('TTS Error:', event);
        reject(new Error('TTS failed'));
      };

      // Connect oscillator to prevent silent output
      oscillator.connect(mediaStreamDestination);
      oscillator.start();
    } catch (error) {
      console.error('Error setting up TTS:', error);
      reject(error);
    }
  });
}
