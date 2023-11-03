import { NextApiRequest, NextApiResponse } from 'next';
import nextConnect from 'next-connect'

let cards: any = []

const getCards = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(200).json({
    success: true,
    data: cards
  })
}

const postCard = (req: NextApiRequest, res: NextApiResponse) => {
  const {id, numbers} = req.body
  const card = {
    id: id,
    numbers: numbers
  }
  cards.push(card) 
  
  res.status(200).json({
    success: true,
    data: cards
  });
}

const updateCard = (req: NextApiRequest, res: NextApiResponse) => {
  const {id, numbers} = req.body
  const cardIndex = cards.findIndex((x: any) => x.id === id)
}

const deleteCard = (req: NextApiRequest, res: NextApiResponse) => {

}

const handler = nextConnect<NextApiRequest, NextApiResponse>({})
  .get(getCards)
  .post(postCard)
  .put(updateCard)
  .delete(deleteCard)

export default handler;