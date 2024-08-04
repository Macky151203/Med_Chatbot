"use client"
import React, { useState } from 'react'
import { app } from '@/firebaseconfig'
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai-preview'
import { IoMdSend } from "react-icons/io";
// import { Tool } from 'firebase/vertexai-preview'

function Page() {
  const [messages, setmessages] = useState([])
  const [input, setinput] = useState('')
  const [res, setres] = useState('')
  const vertexAI = getVertexAI(app)
  


  async function makeapireq(Service:any,docname:any){
    console.log(Service+" "+docname)
    return {  
      'availableSlots': ['29-05-2024 9:00 AM', '29-05-2024 10:00 AM'],
    };
  }

  async function confirmation(bookingslot:any,docname:any) {
    console.log("confirming appointment for "+docname+" at "+bookingslot)
    const appointmentDetails={'bookingstatus':true,"bookingid":1}
    return {
      'appointmentDetails': appointmentDetails,
    }; 
  }
  //book slot for service ortho with doctor rohit
  //ok confirm booking slot 9am with rohit

  const slotavailability  = {
    name:"fetchavailableslots",
    description:"Fetches the available time slots for a given doctor based on service opted.",
    parameters:{
      type:"OBJECT",
      //description: "Get the slot avai",
      properties:{
        Service:{
          type:"STRING",
          description:"The purpose of visit.",
        },
        docname:{
          type:"STRING",
          description:"Name of the doctor.",
        },
      },
      required:["Service","docname"],
    }
  }

  const appointmentconfirmation={
    name:"confirmapointment",
    description:"Proceeds with booking the appointment if the user has given confirmation",
    parameters:{
      type:"OBJECT",
      //description: "Get the slot avai",
      properties:{
        bookingslot:{
          type:"STRING",
          description:"A dateTime in DD-MM-YYYY hh:mm format",
        },
        docname:{
          type:"STRING",
          description:"Name of the doctor.",
        },
      },
      required:["bookingslot","docname"],
    }
  }

  const functions={
    fetchavailableslots:({Service,docname}:{Service:string,docname:string})=>{
      return makeapireq(Service,docname);
    },
    confirmapointment:({bookingslot,docname}:{bookingslot:string,docname:string})=>{
      return confirmation(bookingslot,docname);
    },
  }

  const model = getGenerativeModel(vertexAI, {
    model: "gemini-1.5-flash",
    tools: [
      {functionDeclarations:[slotavailability,appointmentconfirmation]}
    ],
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
      // history: [
      //   {
      //     role: "user",
      //     parts: [{ text: "Hello, I have 2 dogs in my house." }],
      //   },
      //   {
      //     role: "model",
      //     parts: [{ text: "Great to meet you. What would you like to know?" }],
      //   },
      // ],
      generationConfig: {
        maxOutputTokens: 100,
      },
    });

    //const msg = "ok thanks";
    const result = await chat.sendMessage(input);
    const call=result.response.functionCalls()[0]
    console.log("call-",call.name)
    let text="";
    if(call){
      //if(call.name){

        const apiresponse=await functions[call.name](call.args)
        const result = await chat.sendMessage([{functionResponse: {
          name: call.name,
          response: apiresponse
        }}]);
        console.log(result.response.text());
        text = result.response.text();
      //}
    
      // Log the text response.
      
    
    }
    // const apires=await functions[call.name](call.args)
    // for await (const chunk of result.stream) {
    //   const chunkText = chunk.text();
    //   //console.log(chunkText);
    //   text += chunkText;
    //   //setres(text)
    // }
    const newobj2 = { role: "Ai", content: text }
    setmessages(p => [...p, newobj2])
    //console.log(messages)
  }
  return (
    <div className='w-screen h-screen overflow-x-hidden'>
      <div className='w-full flex flex-col gap-4 '>
        {messages && messages.map((m, index) => {
          return (
            <div key={index} className={`relative w-full p-2 ${m.role === "User" ? "flex justify-end" : "flex justify-start"}`}>
              <div className={`p-2 w-auto `}>
                <div className={`p-2 w-auto max-w-[700px] rounded-lg  ${m.role === "User" ? "bg-violet-600 text-white rounded-tr-none text-right" : "bg-gray-100 rounded-tl-none text-left"}`}>
                  <div className={`${m.role === "User" ? "text-right" : " text-left text-violet-700"} text-lg`}>
                    {m.role!=="User"&&m.role}
                  </div>
                  <div>
                  {m.content}
                    </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      <div className='bg-gray-100 w-full px-2 absolute bottom-0 py-4 flex justify-center gap-2'>
        <input className='w-full px-2 bg-gray-100 border-2 py-2 border-black rounded-md' value={input} onChange={(e) => setinput(e.target.value)} />
        <button className='p-1 px-4 text-white rounded-md' onClick={run}><IoMdSend className='text-3xl text-violet-600' /></button>
      </div>

    </div>

  )
}

export default Page