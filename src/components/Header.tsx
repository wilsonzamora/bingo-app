import { useRouter } from 'next/router'
import React from 'react'

interface IHeader {
  path: string
  registerClick: () => void
  playClick: () => void
}

const Header = (props: IHeader) => {
  return (
    <div className='w-[100%]'>
      <button
        className={
          `w-[50%] bg-[#0c484e]/80 text-white border border-white rounded h-[40px] font-[500] hover:bg-[#0c484e]
          ${props.path === '/' && '!bg-[#0c484e] shadow shadow-md shadow-[#0c484e]'}
        `}
        onClick={props.registerClick}
      >
        Register Cards
      </button>
      <button
        className={
          `w-[50%] bg-[#0c484e]/80 text-white border border-white rounded h-[40px] font-[500] hover:bg-[#0c484e]
          ${props.path === '/play' && '!bg-[#0c484e] shadow shadow-md shadow-[#0c484e]'}
        `}
        onClick={props.playClick}
      >
        Play Bingo!
      </button>
    </div>
  )
}

export default Header