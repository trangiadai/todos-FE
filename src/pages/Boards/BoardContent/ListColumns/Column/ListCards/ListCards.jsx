import Box from '@mui/material/Box'
import Card from './Card/Card'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useState, useEffect } from 'react'

function ListCards({ cards }) {
  const [cardList, setCardList] = useState(cards || [])

  // Nếu props cards thay đổi từ bên ngoài (ví dụ do gọi API lại), cập nhật cardList
  useEffect(() => {
    setCardList(cards || [])
  }, [cards])

  const handleCardDeleted = (deletedCardId) => {
    setCardList((prevCards) => prevCards.filter((card) => card._id !== deletedCardId))
  }

  return (
    <SortableContext
      items={cardList?.map((c) => c._id)}
      strategy={verticalListSortingStrategy}
    >
      <Box
        sx={{
          p: '0 5px 5px 5px',
          m: '0 5px',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          overflowX: 'hidden',
          overflowY: 'auto',
          maxHeight: (theme) => `calc(
            ${theme.trello.boardContentHeight} -
            ${theme.spacing(5)} -
            ${theme.trello.columnHeaderHeight} -
            ${theme.trello.columnFooterHeight}
          )`,
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#ced0da' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#dfc2cf' }
        }}
      >
        {cardList?.map((card) => (
          <Card key={card._id} card={card} onCardDeleted={handleCardDeleted} />
        ))}
      </Box>
    </SortableContext>
  )
}

export default ListCards
