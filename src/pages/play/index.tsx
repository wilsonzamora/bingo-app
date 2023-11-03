import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import confetti from 'canvas-confetti'
import { useSnackbar } from 'notistack'
import Divider from '@/components/Divider'
import Header from '@/components/Header'
import { card } from '../register'
import { snackbar } from '@/utils/snackbar'

const PlayBingo = () => {
  const [numberInput, setNumberInput] = useState('')
  const [savedCards, setSavedCards] = useState<card[]>([])
  const [savedNumbersPlayed, setSavedNumbersPlayed] = useState<string[]>([])

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  const letters = ['B', 'I', 'N', 'G', 'O']
  const totalNumbersOfCards = savedCards.map(card => card.totalNumbers)

  const getNumbersPlayedLS = () => {
    const numbersPlayedJSON = localStorage.getItem('numbers');
    const numbersPlayedLS = numbersPlayedJSON ? JSON.parse(numbersPlayedJSON) : [];
    setSavedNumbersPlayed(numbersPlayedLS)
  }

  useEffect(() => {
    getNumbersPlayedLS()
    validateMissingCards(totalNumbersOfCards,savedNumbersPlayed)
  }, [])
  
  useEffect(() => {
    const savedCardsJSON = localStorage.getItem('cards');
    const savedCardsLS = savedCardsJSON ? JSON.parse(savedCardsJSON) : [];
    setSavedCards(savedCardsLS)
  }, [])
  
  const validateMissingCards = (cardsArray: any[], numbersPlayedArray: any[]) => {    
    for (let i = 0; i < cardsArray.length; i++) {
      const cardArray = cardsArray[i];
      const cardNumbersPlayed = cardArray?.filter((elem: any) => numbersPlayedArray.includes(elem));
      const missingCardNumbers = cardArray?.length - cardNumbersPlayed.length
      
      if (missingCardNumbers === 0) {
        const message = `Card ${i + 1}º has won! BINGO!`
        snackbar(enqueueSnackbar, message, 'success')
        confetti({
          zIndex: 999,
          particleCount: 200,
          spread: 160,
          angle: -100,
          origin: {
            x: 1,
            y: 0
          }
        })
      } else if (missingCardNumbers <= 5) {
        const message = `${missingCardNumbers} numbers are missing for Card ${i + 1}º to win.`
        snackbar(enqueueSnackbar, message, 'info')
      } else {
        return
      }
    }
  }

  const onChangeNumberPlayed = (e: any) => {
    setNumberInput(e.target.value)
  }

  const handleMarkCard = () => {
    if (savedCards.length === 0) {
      const message = `Register at least one card to start playing!`
      snackbar(enqueueSnackbar, message, 'info')
      setNumberInput('')
      return
    }
    if (!numberInput) {
      const message = `Enter a number`
      snackbar(enqueueSnackbar, message, 'info')
      return
    }
    if (!savedNumbersPlayed.includes(numberInput)) {
      savedNumbersPlayed.push(numberInput)
      setSavedNumbersPlayed([...savedNumbersPlayed])
      localStorage.setItem('numbers', JSON.stringify([...savedNumbersPlayed]));
      getNumbersPlayedLS()
      setNumberInput('')
      validateMissingCards(totalNumbersOfCards,savedNumbersPlayed)
      return
    } else {
      setNumberInput('')
      const message = `This number has already been registered`
      snackbar(enqueueSnackbar, message, 'warning')

      getNumbersPlayedLS()
    }
  }

  const handleRefreshClick = () => {
    localStorage.removeItem('numbers');
    getNumbersPlayedLS()
  }

  const handleDoubleClickNumberPlayed = (number: string) => {
    const updatedNumbersPlayed = savedNumbersPlayed.filter(x => number !== x)
    localStorage.setItem('numbers', JSON.stringify(updatedNumbersPlayed));
    getNumbersPlayedLS()
  }

  const handleRegisterClick = () => router.push('/')
  const handlePlayClick = () => { return }

  return (
    <div className='w-[100%] flex flex-col justify-center items-center pb-[20px]'>
      <Header path={router.pathname} registerClick={handleRegisterClick} playClick={handlePlayClick} />

      <div className='mx-auto w-[360px] mt-[40px] flex flex-col space-y-2 border border-black py-3 px-4 rounded'>
        <div className='font-[500]'>
          Enter the number played
        </div>
        <div className='flex space-x-2'>
          <input
            className='border border-black px-2 rounded placeholder:font-[300]'
            value={numberInput}
            onChange={onChangeNumberPlayed}
          />
          <button onClick={handleMarkCard} className='rounded-[4px] bg-[#0c484e] text-white hover:bg-[#0c484e]/80 text-[14px] px-4'>
            Mark in card
          </button>
        </div>
      </div>

      <div className='flex flex-col mt-[20px] w-[90%] mx-auto border border-black py-2 rounded'>
        <div className={`flex w-[100%] justify-between items-center ${savedNumbersPlayed.length > 0 && 'pb-2 border-b border-black'} px-3`}>
          <div className='font-[500] flex flex-col'>
            <span>Numbers played:</span>
            {savedNumbersPlayed.length > 0 && (
              <span className='font-[300] text-[14px]'>Tap the number twice to delete it</span>
            )}
          </div>
          <div>
            <button
              className='rounded px-[12px] bg-[#0c484e] text-white font-[500] text-[14px] py-[2px] hover:bg-[#0c484e]/80'
              onClick={handleRefreshClick}
            >
              refresh
            </button>
          </div>
        </div>
        <div className='flex mt-[5px] flex-wrap px-3'>
          {savedNumbersPlayed?.map(number => {
            return (
              <div
                key={`number-${number}`}
                className='flex mr-[5px] mt-[5px] items-center justify-center w-[40px] h-[40px] rounded-full bg-[#049be5] text-white font-[600] border border-white text-[14px] cursor-pointer'
                onDoubleClick={() => handleDoubleClickNumberPlayed(number)}
              >
                {number}
              </div>
            )
          })}
        </div>
      </div>

      <Divider/>

      <div className=' w-[90%] mx-auto flex justify-center'>
        <span className='font-[600]'>
          Your cards ({savedCards.length})
        </span>
      </div>

      {savedCards.length === 0 && (
        <div className='text-center w-[100%] px-[10px] mt-[20px] font-[300] text-[14px]'>
          {`You don't have registered cards, register one or more and start playing!`}
        </div>
      )}

      <div className='flex flex-col md:flex-row flex-wrap mt-[10px] justify-center mx-auto'>
        {savedCards.map((row, idx) => {
          return (
            <div key={`card-${idx}`} className='md:mr-6'>
              <div className="w-[300px] h-auto bg-white rounded-lg shadow-lg p-4 mt-[20px] border border-[#0c484e]">
                <div className="text-center font-bold text-2xl mb-4">Card {row.id}</div>
                <table className='w-[100%]'>
                  <thead>
                    <tr>
                      {letters.map(letter => (
                        <th key={letter} className="w-1/5 h-12 text-center border font-[600] text-white bg-[#0c484e]">
                          {letter}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className='w-[100%]'>
                    <tr>
                      {row?.numbers?.map((number, col) => (
                        <td key={`number-${col}`} className='!p-0'>
                          {number.map((numb: any) => (
                            <div
                              key={numb}
                              className={
                                `flex flex-col w-13 h-10 border border-[#0c484e] justify-center items-center
                                ${savedNumbersPlayed?.includes(numb) && 'bg-[#049be5] text-white'}
                                ${numb === 'x' && 'bg-[#0c484e] text-white'}`
                              }
                            >
                              {numb}
                            </div>
                          ))}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
      </div>

    </div>
  )
}

export default PlayBingo