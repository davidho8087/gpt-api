'use client'

import {useState} from "react";
import Link from "next/link";

export default function Home() {

  const [image, setImage] = useState("");
  const [openAIResponse, setOpenAIResponse] = useState("");


  function handleFileChange(event) {
    if (event.target.files === null) {
      window.alert("No file selected. Choose a file.")
      return;
    }
    const file = event.target.files[0];

    // Convert the users file (locally on their computer) to a base64 string
    // FileReader
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => {
      // reader.result -> base64 string ("" -> :))
      if (typeof reader.result === "string") {
        console.log(reader.result);
        setImage(reader.result);
      }
    }

    reader.onerror = (error) => {
      console.log("error: " + error);
    }

  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (image === "") {
      alert("Upload an image.")
      return;
    }

    // POST api/analyzeImage
    await fetch("api/vision/upload01", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        image: image // base64 image
      })
    })
      .then(async (response) => {
        // Because we are getting a streaming text response
        // we have to make some logic to handle the streaming text
        const reader = response.body?.getReader();
        setOpenAIResponse("");
        // reader allows us to read a new piece of info on each "read"
        // "Hello" + "I am" + "Cooper Codes"  reader.read();
        while (true) {
          const {done, value} = await reader?.read();
          // done is true once the response is done
          if (done) {
            break;
          }

          // value : uint8array -> a string.
          let currentChunk = new TextDecoder().decode(value);
          setOpenAIResponse((prev) => prev + currentChunk);
        }
      });

  }

  return (
    <div className="min-h-screen flex items-center justify-center text-md">
      <div
        className='fixed bottom-0 w-full max-w-2xl '>
        {openAIResponse !== "" ?
          <div className="border-t border-gray-300 pt-4">
            <h2 className="text-xl font-bold mb-2 ">AI Response</h2>
            <p>{openAIResponse}</p>
          </div>
          :
          null
        }


        {image !== "" ?
          <div className="mb-4 overflow-hidden">
            <Link
              src={image}
              className="w-full object-contain max-h-72"
              alt={image} href={''}/>
          </div>
          :
          <div className="mb-4 p-8  text-center">
            <p>Upload Image</p>
          </div>
        }


        <form onSubmit={(e) => handleSubmit(e)}>
          <div className='flex flex-col mb-6'>

            <input
              type="file"
              className="text-sm border rounded-lg cursor-pointer"
              onChange={(e) => handleFileChange(e)}
            />
          </div>

          <div className='flex justify-center'>
            <button type="submit"
                    className='p-2 border-2 border-amber-700 rounded-md mb-4'>
              Analyze Image
            </button>
          </div>

        </form>



      </div>
    </div>
  )
}