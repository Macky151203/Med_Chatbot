"use client"
import React, { useState } from 'react'
import { app } from '@/firebaseconfig'
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview'

function Page() {
  const [messages, setmessages] = useState([])
  const [input, setinput] = useState('')
  const [res, setres] = useState('')
  const vertexAI = getVertexAI(app)
  const model = getGenerativeModel(vertexAI, {
    model: "gemini-1.5-flash",
    tools: [],
    systemInstruction: ""
  })
  const run = async () => {
    // const prompt="Where is delhi?"
    // const result=await model.generateContent(prompt)
    // const response=result.response
    // const text=response.text()
    // setres(text)
    // console.log(text)
    const newobj = { role: "User", content: input }
    setmessages(p => [...p, newobj])
    setinput('')
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: "Hello, I have 2 dogs in my house." }],
        },
        {
          role: "model",
          parts: [{ text: "Great to meet you. What would you like to know?" }],
        },
      ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    //const msg = "ok thanks";
    const result = await chat.sendMessageStream(input);

    let text = '';
    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      console.log(chunkText);
      text += chunkText;
      //setres(text)
    }
    const newobj2 = { role: "Ai", content: text }
    setmessages(p => [...p, newobj2])
    console.log(messages)
  }
  return (
    <div className='w-screen h-screen overflow-x-hidden'>
      <div className='w-full flex flex-col gap-4 '>
        {messages && messages.map((m,index) => {
          return (
            <div key={index} className={`relative w-full p-2 ${m.role === "User" ? "flex justify-end" : "flex justify-start"}`}>
              <div className={`p-2 w-auto    `}>
                
                <div className={`p-2 w-auto max-w-[700px] rounded-lg ${m.role === "User" ? "bg-violet-600 text-white text-right" : "bg-gray-200 text-left"}`}>
                <div className={`${m.role === "User" ? "text-right" : " text-left text-violet-700"} text-lg`}>
                  {m.role}
                </div>
                  {m.content}
                </div>
              </div>
            </div>

          )
        })}
      </div>
      <div className='bg-gray-200 w-full px-2 absolute bottom-0 py-4 flex justify-center gap-2'>
        <input className='w-full px-2 bg-gray-200 border-2 py-2 border-black rounded-md' value={input} onChange={(e) => setinput(e.target.value)} />
        <button className='bg-violet-600 p-1 px-4 text-white rounded-md hover:bg-violet-400' onClick={run}>Send</button>
      </div>

    </div>

  )
}

export default Page