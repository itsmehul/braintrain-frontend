import React from 'react'

function BackgroundImage({path}) {
  return (
    <div style={{backgroundImage:`url(${path})`,top:'0px',bottom:'0px', left:'0',right:'0',backgroundPosition:'center', position:'fixed'}}/>
  )
}

export default BackgroundImage
