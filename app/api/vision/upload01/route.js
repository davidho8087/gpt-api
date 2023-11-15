import { OpenAIStream, StreamingTextResponse } from 'ai'
import { Configuration, OpenAIApi } from 'openai-edge'

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})

const openai = new OpenAIApi(config)

export const runtime = 'edge';

export async function POST(request) {
    const {image} = await request.json();

    console.log('image', image)

    // Ask OpenAI for a streaming completion given the prompt
    const response = await openai.createChatCompletion({
        model: "gpt-4-vision-preview",
        stream: true,
        max_tokens: 4096, // No max tokens: super short / cut off response.
        messages: [ // GPT-4 with Vision is JUST GPT-4. So you can still talk with it like GPT-4
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