'use client'
import React, { useEffect } from 'react'
import { db } from '../../firebaseconfig'
import { doc, getDoc } from 'firebase/firestore'

export default function Mainpage({params}:{params:{"uid":string}}) {
  const uid=params['uid']
  console.log("uid id-",uid)
  useEffect(()=>{
    const getData= async()=>{
      const docRef=doc(db,'orgpapptinfo',uid);
      const docSnap=await getDoc(docRef)
      if(docSnap.exists()){
        console.log("This is the data- ",docSnap.data().appt)
      }
      else{
        console.log("Error fetching data")
      }
    }
    getData();
  },[])
  return (
    <div>Mainpage Forms</div>
  )
}

