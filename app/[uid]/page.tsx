'use client'
import React from 'react'

export default function Mainpage({params}:{params:{"uid":string}}) {
  const uid=params['uid']
  console.log("uid id-",uid)
  return (
    <div>Mainpage Forms</div>
  )
}

