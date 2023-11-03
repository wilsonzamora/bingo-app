import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Divider from '@/components/Divider'
import Header from '@/components/Header'
import Modal from '@/components/Modal'
import { snackbar } from '@/utils/snackbar'
import { useSnackbar } from 'notistack'

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
  const [buttonResetClicked, setButtonResetClicked] = useState(false)
  const input1Ref = useRef(null);
  const input2Ref = useRef(null);
  const input3Ref = useRef(null);
  const input4Ref = useRef(null);
  const input5Ref = useRef(null);
  const [number1, setNumber1] = useState('')
  const [number2, setNumber2] = useState('')
  const [number3, setNumber3] = useState('')
  const [number4, setNumber4] = useState('')
  const [number5, setNumber5] = useState('')
  const inputs = [number1, number2, number3, number4, number5]
  
  const { enqueueSnackbar } = useSnackbar()
  const router = useRouter()
  const letters = ['B', 'I', 'N', 'G', 'O']
  
  const getCardsLS = () => {
    const savedCardsJSON = localStorage.getItem('cards');
    const savedCardsLS = savedCardsJSON ? JSON.parse(savedCardsJSON) : [];
    setSavedCards(savedCardsLS)
  }

  const baseValue = (letterSelected - 1) * 15 + 1;
  const minValue = baseValue;
  const maxValue = baseValue + 14;
  
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
    const repeatedElements = new Set(inputs).size < inputs.length;
    if (repeatedElements) {
      const message = 'You have repeated numbers. Please check them.'
      snackbar(enqueueSnackbar, message, 'info')
      return
    }
    if ( letterSelected < 5 && disabled ) {
      card?.numbers.push(inputs)
      setCard({
        id: savedCards.length + 1,
        numbers: [...card?.numbers],
        totalNumbers: [...card?.totalNumbers].concat(inputs)
      })
      setLetterSelected(letterSelected + 1)
      resetInputs()

    } else if ( letterSelected === 5 && disabled ) {
      card.numbers.push(inputs)
      const totalN = [].concat(...card.numbers)
      const totalNWithoutX = totalN.filter(x => x !== 'x')

      savedCards.push({...card, totalNumbers: totalNWithoutX})
      localStorage.setItem('cards', JSON.stringify(savedCards));
      
      getCardsLS()
      
      setCard({id: savedCards.length + 1, numbers: [], totalNumbers: []})
      setLetterSelected(1)
      resetInputs()

    } else {
      console.log('complete the numbers');
    }
  }

  const handleResetCard = (inputRef: any) => {
    setLetterSelected(1)
    setCard({id: savedCards.length + 1, numbers: [], totalNumbers: []})
    setButtonResetClicked(true)
    inputRef?.current?.focus()
    resetInputs()
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

  const handleInputChange = (e: any, setter: any) => {
    setButtonResetClicked(false)
    const value = e.target.value
    setter(value)
  }

  const handlerInputBlur = (inputValue: string, setter: any, inputRef: any, index: number) => {
    if (buttonResetClicked) {
      setter('')
      return
    }

    if (inputValue === '') return

    const inputsCopy = [...inputs]
    inputsCopy.splice(index - 1, 1)
    if (inputsCopy.includes(inputValue)) {
      const message = `This number is already registered`
      snackbar(enqueueSnackbar, message, 'info')
      setter('')
      inputRef.current.focus()
      return
    }

    if (+inputValue >= minValue && +inputValue <= maxValue) {
      return
    } else {
      const message = `Number is out of range (${minValue}-${maxValue})`
      snackbar(enqueueSnackbar, message, 'info')
      setter('')
      inputRef.current.focus()
    }
  }

  return (
    <div className='w-[100%] min-h-screen flex flex-col pb-[20px]'>
      <Header path={router.pathname} registerClick={handleRegisterClick} playClick={handlePlayClick} />

      <div className='flex flex-col items-center mt-[30px] mx-auto mt-[20px] px-[15px]'>
        <div className="md:w-[350px] w-[95%] h-auto bg-white rounded-lg shadow-lg p-3 md:p-4 border">
          <div className="text-center font-bold text-[20px] mb-2">Add your card numbers</div>
          <span className='text-[14px] font-[300] tracking-tighter leading-tight'>
            * Fill with the numbers from column <span className='font-[900]'>{activeLetter()}</span> <span className='text-[12px] font-[600] ml-[2px]'>({minValue} - {maxValue})</span>
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
                    ref={input1Ref}
                    className='w-full h-full text-center'
                    pattern="[0-9]{1,2}"
                    maxLength={2}
                    onInput={(e: any) => {
                      const inputText = e.target.value;
                      if (!/^\d*$/.test(inputText)) {
                        e.target.value = inputText.replace(/\D/g, '');
                        const message = 'Please enter a number'
                        snackbar(enqueueSnackbar, message, 'info')
                      }
                    }}
                    value={number1}
                    onChange={(e: any) => handleInputChange(e, setNumber1)}
                    onBlur={(e: any) => handlerInputBlur(e.target.value, setNumber1, input1Ref, 1)}
                  />
                </td>
                <td className="w-1/6 h-12 text-center border border-[#0c484e]">
                  <input
                    ref={input2Ref}
                    className='w-full h-full text-center'
                    pattern="[0-9]{1,2}"
                    maxLength={2}
                    onInput={(e: any) => {
                      const inputText = e.target.value;
                      if (!/^\d*$/.test(inputText)) {
                        e.target.value = inputText.replace(/\D/g, '');
                        const message = 'Please enter a number'
                        snackbar(enqueueSnackbar, message, 'info')
                      }
                    }}
                    value={number2}
                    onChange={(e: any) => handleInputChange(e, setNumber2)}
                    onBlur={() => handlerInputBlur(number2, setNumber2, input2Ref, 2)}
                  />
                </td>
                <td className="w-1/6 h-12 text-center border border-[#0c484e]">
                  <input
                    ref={input3Ref}
                    className={`w-full h-full text-center ${letterSelected === 3 && 'bg-[#0c484e] text-white'}`}
                    pattern="[0-9]{1,2}"
                    maxLength={2}
                    onInput={(e: any) => {
                      const inputText = e.target.value;
                      if (!/^\d*$/.test(inputText)) {
                        e.target.value = inputText.replace(/\D/g, '');
                        const message = 'Please enter a number'
                        snackbar(enqueueSnackbar, message, 'info')
                      }
                    }}
                    value={number3}
                    onChange={(e: any) => handleInputChange(e, setNumber3)}
                    onBlur={() => handlerInputBlur(number3, setNumber3, input3Ref, 3)}
                    disabled={letterSelected === 3}
                  />
                </td>
                <td className="w-1/6 h-12 text-center border border-[#0c484e]">
                  <input
                    ref={input4Ref}
                    className='w-full h-full text-center'
                    pattern="[0-9]{1,2}"
                    maxLength={2}
                    onInput={(e: any) => {
                      const inputText = e.target.value;
                      if (!/^\d*$/.test(inputText)) {
                        e.target.value = inputText.replace(/\D/g, '');
                        const message = 'Please enter a number'
                        snackbar(enqueueSnackbar, message, 'info')
                      }
                    }}
                    value={number4}
                    onChange={(e: any) => handleInputChange(e, setNumber4)}
                    onBlur={() => handlerInputBlur(number4, setNumber4, input4Ref, 4)}
                  />
                </td>
                <td className="w-1/6 h-12 text-center border border-[#0c484e]">
                  <input
                    ref={input5Ref}
                    className='w-full h-full text-center'
                    pattern="[0-9]{1,2}"
                    maxLength={2}
                    onInput={(e: any) => {
                      const inputText = e.target.value;
                      if (!/^\d*$/.test(inputText)) {
                        e.target.value = inputText.replace(/\D/g, '');
                        const message = 'Please enter a number'
                        snackbar(enqueueSnackbar, message, 'info')
                      }
                    }}
                    value={number5}
                    onChange={(e: any) => handleInputChange(e, setNumber5)}
                    onBlur={() => handlerInputBlur(number5, setNumber5, input5Ref, 5)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className='flex space-x-10 mt-[20px] w-[93%] justify-between'>
          <button
            className='px-4 rounded-[4px] hover:bg-gray-200 bg-[red] text-white hover:bg-[red]/90'
            onClick={() => handleResetCard(input1Ref)}
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