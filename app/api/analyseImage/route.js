import OpenAI from 'openai';
import {OpenAIStream, StreamingTextResponse} from 'ai';

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = 'edge';

export async function POST(request) {
  const {image} = await request.json();

  // Ask OpenAI for a streaming completion given the prompt
  const response = await openai.completions.create({
    model: "gpt-4-vision-preview",
    stream: true,
    max_tokens: 4096,
    messages: [ // GPT-4 with Vision is JUST GPT-4. So you can still talk with it like GPT-4
      // There is no "system" message (THIS MAY CHANGE)
      {
        role: "user",
        //@ts-ignore
        content: [
          {type: "text", text: "What's in this image?"},
          {
            type: "image_url",
            image_url: image // base64 images
          }
        ]
      }
    ]
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}