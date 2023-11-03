import Divider from '@/components/Divider'
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import { useRouter } from 'next/router'
import React, { useEffect, useState } from 'react'

export type card = {
  id: number,
  numbers: any[]
  totalNumbers: any
}

const RegisterBingo = () => {
  const [letterSelected, setLetterSelected] = useState(1)
  const [savedCards, setSavedCards] = useState<card[]>([])
  const [card, setCard] = useState<card>({id: savedCards.length + 1, numbers: [], totalNumbers: []})
  const [deleting, setDeleting] = useState(false)
  const [cardToDelete, setCardToDelete] = useState<card>()
  const [number1, setNumber1] = useState('')
  const [number2, setNumber2] = useState('')
  const [number3, setNumber3] = useState('')
  const [number4, setNumber4] = useState('')
  const [number5, setNumber5] = useState('')
  const router = useRouter()
  const letters = ['B', 'I', 'N', 'G', 'O']

  console.log('savedCards:', savedCards);
  console.log('deleting:', deleting);
  
  const getCardsLS = () => {
    const savedCardsJSON = localStorage.getItem('cards');
    const savedCardsLS = savedCardsJSON ? JSON.parse(savedCardsJSON) : [];
    setSavedCards(savedCardsLS)
  }
  
  useEffect(() => {
    getCardsLS()
  }, [])

  useEffect(() => {
    if (letterSelected === 3) setNumber3('x')
  }, [letterSelected])

  const disabled =
  number1 !== '' &&
  number2 !== '' &&
  number3 !== '' &&
  number4 !== '' &&
  number5 !== ''

  const resetInputs = () => {
    setNumber1('')
    setNumber2('')
    setNumber3('')
    setNumber4('')
    setNumber5('')
  }

  const handleNextOrSaveClick = () => {
    if ( letterSelected < 5 && disabled ) {
      card?.numbers.push([`${number1}`, `${number2}`, `${number3}`, `${number4}`, `${number5}`])
      setCard({
        id: savedCards.length + 1,
        numbers: [...card?.numbers],
        totalNumbers: [...card?.totalNumbers]
      })
      setLetterSelected(letterSelected + 1)
      resetInputs()

    } else if ( letterSelected === 5 && disabled ) {
      card.numbers.push([`${number1}`, `${number2}`, `${number3}`, `${number4}`, `${number5}`])
      const totalN = [].concat(...card.numbers)
      const totalNWithoutX = totalN.filter(x => x !== 'x')
      card.totalNumbers.push(totalNWithoutX)

      savedCards.push(card)
      localStorage.setItem('cards', JSON.stringify(savedCards));
      
      getCardsLS()
      
      setCard({id: savedCards.length + 1, numbers: [], totalNumbers: []})
      setLetterSelected(1)
      resetInputs()

    } else {
      console.log('complete the numbers');
    }
  }

  const handleResetCard = () => {
    setLetterSelected(1)
    setCard({id: savedCards.length + 1, numbers: [], totalNumbers: []})
  }

  const clickDeleteCardByID = (cardToDelete: card) => {
    setDeleting(true)
    setCardToDelete(cardToDelete)
  }

  const handleDeleteCardsClick = () => {
    if (savedCards.length === 0) return
    setDeleting(true)
  }

  const handleCloseModal = () => {
    setDeleting(false)
  }

  const handleOkClick = () => {
    if (cardToDelete) {
      const id = cardToDelete?.id
      const updatedCards = savedCards.filter(item => id !== item.id)
      localStorage.setItem('cards', JSON.stringify(updatedCards));
      setCardToDelete(undefined)

    } else {
      localStorage.removeItem('cards');
    }
    setDeleting(false)
    getCardsLS()
  }

  const handleCancelClick = () => {
    setDeleting(false)
  }

  const activeLetter = () => {
    if (letterSelected === 1) return 'B'
    if (letterSelected === 2) return 'I'
    if (letterSelected === 3) return 'N'
    if (letterSelected === 4) return 'G'
    if (letterSelected === 5) return 'O'
  }

  const handleRegisterClick = () => { return }
  const handlePlayClick = () => router.push('/play')

  return (
    <div className='w-[100%] min-h-screen flex flex-col pb-[20px]'>
      <Header path={router.pathname} registerClick={handleRegisterClick} playClick={handlePlayClick} />

      <div className='flex space-x-[20px] items-center mt-[30px] mx-auto mt-[20px] px-[15px]'>
        <div className="md:w-[350px] w-[100%] h-auto bg-white rounded-lg shadow-lg p-3 md:p-4 border">
          <div className="text-center font-bold text-[20px] mb-2">Add your card numbers</div>
          <span className='text-[14px] font-[300] tracking-tighter leading-tight'>
            * Fill with the numbers from column <span className='font-[900]'>{activeLetter()}</span>
          </span>
          <table className="w-full border border-[#0c484e] mt-2">
            <tbody>
              <tr>
                {letterSelected === 1 && (
                  <td className="w-1/6 h-12 text-center border border-[#0c484e] font-[600] bg-[#0c484e] text-white">B</td>
                )}
                {letterSelected === 2 && (
                  <td className="w-1/6 h-12 text-center border border-[#0c484e] font-[600] bg-[#0c484e] text-white">I</td>
                )}
                {letterSelected === 3 && (
                  <td className="w-1/6 h-12 text-center border border-[#0c484e] font-[600] bg-[#0c484e] text-white">N</td>
                )}
                {letterSelected === 4 && (
                  <td className="w-1/6 h-12 text-center border border-[#0c484e] font-[600] bg-[#0c484e] text-white">G</td>
                )}
                {letterSelected === 5 && (
                  <td className="w-1/6 h-12 text-center border border-[#0c484e] font-[600] bg-[#0c484e] text-white">O</td>
                )}
                <td className="w-1/6 h-12 text-center border border-[#0c484e]">
                  <input
                    className='w-full h-full text-center'
                    value={number1}
                    onChange={(e: any) => setNumber1(e.target.value)}
                  />
                </td>
                <td className="w-1/6 h-12 text-center border border-[#0c484e]">
                  <input
                    className='w-full h-full text-center'
                    value={number2}
                    onChange={(e: any) => setNumber2(e.target.value)}
                  />
                </td>
                <td className="w-1/6 h-12 text-center border border-[#0c484e]">
                  <input
                    className={`w-full h-full text-center ${letterSelected === 3 && 'bg-[#0c484e] text-white'}`}
                    value={number3}
                    onChange={(e: any) => setNumber3(e.target.value)}
                    disabled={letterSelected === 3}
                  />
                </td>
                <td className="w-1/6 h-12 text-center border border-[#0c484e]">
                  <input
                    className='w-full h-full text-center'
                    value={number4}
                    onChange={(e: any) => setNumber4(e.target.value)}
                  />
                </td>
                <td className="w-1/6 h-12 text-center border border-[#0c484e]">
                  <input
                    className='w-full h-full text-center'
                    value={number5}
                    onChange={(e: any) => setNumber5(e.target.value)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='flex flex-col space-y-10'>
          <button
            className='px-4 rounded-[4px] hover:bg-gray-200 bg-[red] text-white hover:bg-[red]/90'
            onClick={handleResetCard}
          >
            reset
          </button>
          <button
            className={`px-4 rounded-[4px] bg-[#2C8CFF] hover:bg-[#006CED] text-white ${!disabled && 'cursor-not-allowed !bg-gray-200 !text-gray-400'}`}
            onClick={handleNextOrSaveClick}
            disabled={!disabled}
          >
            {letterSelected === 5 ? 'save' : 'next'}
          </button>
        </div>

      </div>

      <Divider/>

      <div className=' flex justify-between w-[90%] mx-auto'>
        <div className='font-[600]'>Your cards ({savedCards.length})</div>
        <button
          className='rounded px-[12px] bg-[red] text-white font-[500] text-[14px] py-[2px] hover:bg-[#fe5656]'
          onClick={handleDeleteCardsClick}
        >
          Delete cards
        </button>
      </div>

      {/* Card */}
      <div className='flex flex-col md:flex-row flex-wrap mt-[10px] justify-center mx-auto'>
        {savedCards.map((row, idx) => {
          return (
            <div key={`card-${idx}`} className='md:mr-6'>
              <div className="w-[300px] h-auto bg-white rounded-lg shadow-lg p-4 mt-[20px] border border-[#0c484e] relative">
                <span className="close" onClick={() => clickDeleteCardByID(row)}>&times;</span>
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
                          {number?.map((numb: string, index: number) => (
                            <div
                              key={`number-${index}`}
                              className={
                                `flex flex-col w-13 h-10 border border-[#0c484e] justify-center items-center
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

      {deleting && (
        <Modal
          isOpen={deleting}
          onClose={handleCloseModal}
          yesClick={handleOkClick}
          noClick={handleCancelClick}
          deleteAll={cardToDelete ? true : false}
        />
      )}

    </div>
  )
}

export default RegisterBingo