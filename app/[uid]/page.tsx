'use client'
import React, { useEffect, useState } from 'react'
import { db } from '../../firebaseconfig'
import { doc, getDoc } from 'firebase/firestore'
import DropdownForm from '../components/userform'

export default function Mainpage({params}:{params:{"uid":string}}) {
  const uid=params['uid']
  console.log("uid id-",uid)
  const [loading,setloading]=useState(true)
  const [doctors,setdoctors]=useState([])
  useEffect(()=>{
    const getData= async()=>{
      const docRef=doc(db,'orgpapptinfo',uid);
      const docSnap=await getDoc(docRef)
      if(docSnap.exists()){
        console.log("This is the data- ",docSnap.data().appt)
        setdoctors(docSnap.data().appt.description.row.items_list)
        setloading(false)
      }
      else{
        console.log("No data available")
      }
    }
    getData();
  },[])
  return (
    <>
    {
      loading ? <div>Loading</div>:
      <div>
        Here is the form
        <DropdownForm options={doctors} />
      </div>
    }
    </>
  )
}

