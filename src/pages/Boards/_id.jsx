import Container from '@mui/material/Container'
import AppBar from '~/components/AppBar/AppBar'
import BoardBar from './BoardBar/BoardBar'
import BoardContent from './BoardContent/BoardContent'
import { useLocation } from 'react-router-dom'
// import { mockData } from '~/apis/mock-data'
import { useEffect, useState } from 'react'
import {
  createNewCardAPI,
  createNewColumnAPI,
  deleteColumnDetailsAPI,
  fetchBoardDetailsAPI,
  moveCardToDifferentColumnAPI,
  updateBoardDetailsAPI,
  updateColumnDetailsAPI
} from '~/apis'
import { isEmpty } from 'lodash'
import { generatePlaceholderCard } from '~/utils/formatters'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { toast } from 'react-toastify'

function Board() {
  const location = useLocation()
  const userId = location.state?.userId
  const [board, setBoard] = useState(null)

  const [boardId, setBoardId] = useState(null)

  useEffect(() => {
    const fetchBoardId = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/v1/boards/getBoard/${userId}`
        )
        const boardData = await response.json()
        console.log('Board Data:', boardData)
        if (!boardData || !boardData._id) {
          throw new Error('Board data is invalid or missing _id')
        }
        console.log('Board ID fetched:', boardData._id)
        setBoardId(boardData._id)
      } catch (error) {
        console.error('Error fetching board ID:', error)
      }
    }

    if (userId) {
      fetchBoardId()
    }
  }, [userId])

  useEffect(() => {
    if (!boardId) return // Nếu chưa có boardId thì không gọi API

    fetchBoardDetailsAPI(boardId)
      .then((board) => {
        console.log('Board Data before response:', board)
        console.log('Columns Data before response:', board.columns)
        console.log('Column Order Ids:', board.columnOrderIds)
        console.log('Before sorting columns:', board.columns)

        board.columns.forEach((column) => {
          if (isEmpty(column.cards)) {
            const placeholder = generatePlaceholderCard(column)
            column.cards = [placeholder]
            column.cardOrderIds = [placeholder._id]
          }
        })

        console.log('Full board:', board)
        console.log('board ID:', board._id)
        setBoard(board)
      })
      .catch((error) => console.error('API Fetch Error:', error))
  }, [boardId])

  // useEffect(() => {
  //   // const boardId = '67c5723c9c398522fc439c36'
  //   fetchBoardDetailsAPI(boardId)
  //     .then((board) => {
  //      // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con 71
  //      // MINH KHONG BI CAI LOI NGO NGAN NAY
  //       console.log('Board Data before response:', board)
  //       console.log('Columns Data before response:', board.columns)
  //       // if (!board || !board.columns) {
  //       //   console.log('Board data is invalid:', board)
  //       //   return
  //       // }
  //       // if (board.columns.length === 0) {
  //       //   console.log('Board has no columns')
  //       // }
  //       console.log('Column Order Ids:', board.columnOrderIds)
  //       console.log('Before sorting columns:', board.columns)
  //       // board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
  //       console.log('After sorting columns:', board.columns)

  //       board.columns.forEach((column) => {
  //         // Khi F5 trang web thì cần xử lý vấn đề kéo thả vào một column rỗng
  //         if (isEmpty(column.cards)) {
  //           column.cards = [generatePlaceholderCard(column)]
  //           column.cardOrderIds = [generatePlaceholderCard(column)._id]
  //         }
  //         // else {
  //         // MINH KHONG BI CAI LOI NGO NGAN NAY
  //         // Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con 71
  //         //   column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
  //         // }
  //       })
  //       console.log('Full board:', board)
  //       console.log('board ID:', board._id)
  //       setBoard(board)
  //     })
  //     .catch((error) => console.error('API Fetch Error:', error))
  // }, [])

  // Func này có nhiệm vụ gọi API tạo mới Column và làm lại dữ liệu State Board
  // const createNewColumn = async (newColumnData) => {
  //   const createdColumn = await createNewColumnAPI({
  //     ...newColumnData,
  //     boardId: '67c5723c9c398522fc439c36'
  //     // boardId: board._id
  //   })
  //   console.log('createdColumn:', createdColumn)

  //   // Khi tạo column mới thì nó sẽ chưa có card, cần xử lý vấn đề kéo thả vào một column rỗng (Nhó lại video 37.2, code hiện tại là video 69)
  //   createdColumn.cards = [generatePlaceholderCard(createdColumn)]
  //   createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

  //   // Cập nhật state board
  //   /**
  //    * - Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailsAPI)
  //    * - Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì Back-end sẽ hỗ trợ trả về luôn toàn bộ Board dù đây có là api tạo Column hay Card đi chăng nữa. => Lúc này Front-end sẽ nhàn hơn
  //    */
  //   const newBoard = { ...board }
  //   newBoard.columns.push(createdColumn)
  //   newBoard.columnOrderIds.push(createdColumn._id)
  //   setBoard(newBoard)
  // }
  const createNewColumn = async (newColumnData) => {
    if (!board) {
      console.error('Board data is not available yet.')
      return
    }

    const createdColumn = await createNewColumnAPI({
      ...newColumnData,
      boardId: board._id
    })

    console.log('createdColumn:', createdColumn)

    createdColumn.cards = [generatePlaceholderCard(createdColumn)]
    createdColumn.cardOrderIds = [generatePlaceholderCard(createdColumn)._id]

    const newBoard = { ...board }

    // Kiểm tra xem `columns` có phải là một mảng không
    if (!Array.isArray(newBoard.columns)) newBoard.columns = []
    if (!Array.isArray(newBoard.columnOrderIds)) newBoard.columnOrderIds = []

    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    setBoard(newBoard)
  }
  // // Func này có nhiệm vụ gọi API tạo mới Card và làm lại dữ liệu State Board
  // const createNewCard = async (newCardData) => {
  //   const createdCard = await createNewCardAPI({
  //     ...newCardData,
  //     boardId: '67c5723c9c398522fc439c36'
  //   })
  //   console.log('createdCard:', createdCard)
  //   // Cập nhật state board
  //   /**
  //    * - Phía Front-end chúng ta phải tự làm đúng lại state data board (thay vì phải gọi lại api fetchBoardDetailsAPI)
  //    * - Lưu ý: cách làm này phụ thuộc vào tùy lựa chọn và đặc thù dự án, có nơi thì Back-end sẽ hỗ trợ trả về luôn toàn bộ Board dù đây có là api tạo Column hay Card đi chăng nữa. => Lúc này Front-end sẽ nhàn hơn
  //    */
  //   const newBoard = { ...board }
  //   const columnToUpdate = newBoard.columns.find(
  //     (column) => column._id === createdCard.columnId
  //   )

  //   if (columnToUpdate) {
  //     // Nếu column rỗng: bản chất là đang chứa một cái Placeholder card
  //     if (columnToUpdate.cards.some((card) => card.FE_PlaceholderCard)) {
  //       console.log('👉 In Condition If:', columnToUpdate)
  //       columnToUpdate.cards = [createdCard]
  //       columnToUpdate.cardOrderIds = [createdCard._id]
  //     } else {
  //       // Ngược lại Column đã có data thì push vào cuối mảng
  //       console.log('👉 In Condition Else:', columnToUpdate)
  //       columnToUpdate.cards.push(createdCard)
  //       columnToUpdate.cardOrderIds.push(createdCard._id)
  //     }
  //   }
  //   console.log('👉 ~ createNewCard ~ columnToUpdate:', columnToUpdate)
  //   setBoard(newBoard)
  // }
  const createNewCard = async (newCardData) => {
    try {
      console.log('Dữ liệu gửi lên API:', JSON.stringify(newCardData, null, 2))
      const createdCard = await createNewCardAPI({
        ...newCardData,
        boardId: board._id
      })

      console.log('createdCard:', createdCard)

      // Kiểm tra nếu không có createdCard hoặc columnId không hợp lệ
      if (!createdCard || !createdCard.columnId) {
        console.error('Lỗi: Card mới không hợp lệ hoặc thiếu columnId!')
        return
      }

      // Tạo bản sao mới của board để cập nhật state
      const newBoard = { ...board }

      newBoard.columns.forEach((column) => {
        console.log('Column ID in _id.jsx:', column._id)
        console.log('Type of Column ID in _id.jsx:', typeof column._id)
      })

      console.log('Created Card Column ID:', createdCard.columnId)
      console.log(
        'Type of Created Card Column ID:',
        typeof createdCard.columnId
      )

      // Tìm column chứa card mới
      const columnIndex = newBoard.columns.findIndex(
        (column) => column._id === createdCard.columnId
      )

      if (columnIndex === -1) {
        console.error('Lỗi: Không tìm thấy column tương ứng với card mới!')
        return
      }

      // Clone column cần update
      const updatedColumn = { ...newBoard.columns[columnIndex] }

      // Nếu column rỗng: bản chất đang chứa Placeholder card
      if (updatedColumn.cards.some((card) => card.FE_PlaceholderCard)) {
        console.log('👉 Placeholder card detected, replacing with new card')
        updatedColumn.cards = [createdCard]
        updatedColumn.cardOrderIds = [createdCard._id]
      } else {
        console.log('👉 Adding new card to existing column')
        // Kiểm tra nếu cardOrderIds không phải là một mảng thì khởi tạo nó
        if (!Array.isArray(updatedColumn.cardOrderIds)) {
          updatedColumn.cardOrderIds = []
        }
        // Thêm dữ liệu cards mới vào trong column
        updatedColumn.cards = [...updatedColumn.cards, createdCard]
        updatedColumn.cardOrderIds = [
          ...updatedColumn.cardOrderIds,
          createdCard._id
        ]
      }

      // Cập nhật mảng columns trong board
      newBoard.columns[columnIndex] = updatedColumn

      console.log('👉 Updated column:', updatedColumn)

      // Cập nhật state
      setBoard(newBoard)
    } catch (error) {
      console.error('Lỗi khi tạo Card:', error.response?.data || error.message)
      console.error('Lỗi khi tạo Card:', error)
    }
  }

  /**
   * - Func này có nhiệm vụ gọi API và xử lý khi kéo thả Column xong xuôi
   * - Chỉ cần gọi API để cập nhật mảng columnOrderIds của Board chứa nó (thay đổi vị trí trong mảng)
   */
  const moveColumns = (dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API update Board
    updateBoardDetailsAPI(newBoard._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  /**
   * - Khi di chuyển card trong cùng Column:
   * - Chỉ cần gọi API để cập nhật mảng cardOrderIds của Column chứa nó (thay đổi vị trí trong mảng)
   */
  const moveCardInTheSameColumn = (
    dndOrderedCards,
    dndOrderedCardIds,
    columnId
  ) => {
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(
      (column) => column._id === columnId
    )
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardIds
    }
    setBoard(newBoard)

    // Gọi API update Column
    updateColumnDetailsAPI(columnId, { cardOrderIds: dndOrderedCardIds })
  }

  /**
   * Khi di chuyển card sang Column khác:
   * B1: Cập nhật mảng cardOrderIds của Board ban đầu chứa nó (Hiểu bản chất là xóa cái _id của Card ra khỏi mảng)
   * B2: Cập nhật mảng cardOrderIds của Column tiếp theo (Hiểu bản chất là thêm _id của Card vào mảng)
   * B3: Cập nhật lại trường columnId mới của cái Card đã kéo
   * => Làm một API support riêng
   */
  const moveCardToDifferentColumn = (
    currentCardId,
    prevColumnId,
    nextColumnId,
    dndOrderedColumns
  ) => {
    console.log(
      '🚀 ~ moveCardBetweenDifferentColumns ~ dndOrderedColumns:',
      dndOrderedColumns
    )
    console.log(
      '🚀 ~ moveCardBetweenDifferentColumns ~ nextColumnId:',
      nextColumnId
    )
    console.log(
      '🚀 ~ moveCardBetweenDifferentColumns ~ prevColumnId:',
      prevColumnId
    )
    console.log(
      '🚀 ~ moveCardBetweenDifferentColumns ~ currentCardId:',
      currentCardId
    )

    // Update cho chuẩn dữ liệu state Board
    const dndOrderedColumnsIds = dndOrderedColumns.map((c) => c._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API xử lý phía BE
    let prevCardOrderIds = dndOrderedColumns.find(
      (c) => c._id === prevColumnId
    )?.cardOrderIds

    console.log(
      '✅ moveCardBetweenDifferentColumns ~ prevCardOrderIds:',
      prevCardOrderIds
    )

    // Xử lý vấn đề khi kéo Card cuối cùng ra khỏi Column, Column rỗng sẽ có placeholder-card, cần xóa nó đi trước khi gửi dữ liệu lên cho phía BE.
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []

    console.log(
      '✅ moveCardBetweenDifferentColumns ~ prevCardOrderIds:',
      prevCardOrderIds
    )

    moveCardToDifferentColumnAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find((c) => c._id === nextColumnId)
        ?.cardOrderIds
    })
  }

  // Xử lý xóa một Column và Cards bên trong nó
  const deleteColumnDetails = (columnId) => {
    console.log('🚀 ~ deleteColumnDetails ~ columnId:', columnId)
    console.log('Board before cloning:', board)
    console.log('board.columnOrderIds:', board.columnOrderIds)
    //NOTE: board KHÔNG CÓ CHƯA columnOrderIds, nó chỉ chưa columns, vì vậy mình cận tạo columnOrderIds
    // đây là do back end mình đã sửa lí chỉ trả về dữa liệu detail chứ k còn trả về columOrderIds
    // Update cho chuẩn dữ liệu state Board
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter((c) => c._id !== columnId)
    console.log('Before filtering:', newBoard.columnOrderIds)
    console.log('columnId type:', typeof columnId, 'value:', columnId)
    if (!Array.isArray(newBoard.columnOrderIds)) {
      console.warn(
        'Warning: columnOrderIds was not an array. Initializing as an empty array.'
      )
      newBoard.columnOrderIds = [] // Khởi tạo nếu bị undefined
    }

    if (!Array.isArray(newBoard.columnOrderIds)) {
      console.error(
        'Error: newBoard.columnOrderIds is not an array!',
        newBoard.columnOrderIds
      )
      return
    }
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(
      (_id) => _id !== columnId
    )
    console.log('After filtering:', newBoard.columnOrderIds)
    console.log('New board before setting state:', newBoard)
    setBoard(newBoard)
    console.log('Board after set:', newBoard)

    // Gọi API xử lý phía BE
    // console.log('test 4')
    // deleteColumnDetailsAPI(columnId).then((res) => {
    //   console.log('test 5')
    //   toast.success(res?.deleteResult)
    //   console.log('🚀 ~ deleteColumnDetails ~ res:', res)
    // })
    console.log('test 4 - about to call API with columnId:', columnId)
    deleteColumnDetailsAPI(columnId)
      .then((res) => {
        toast.success(res?.deleteResult)
        console.log('🚀 ~ deleteColumnDetails ~ res:', res)
      })
      .catch((error) => {
        console.error('API call failed:', error)
      })
  }

  if (!board) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          gap: 2,
          width: '100vw',
          height: '100vh'
        }}
      >
        <CircularProgress />
        <Typography>Loading Board...</Typography>
      </Box>
    )
  }

  return (
    <Container
      //cập đôi đi chung giúp full width khung hình
      //không bị dính padding
      disableGutters
      maxWidth={false}
      sx={{
        height: '100vh'
        // backgroundImage: 'url("../../../assets/background.svg")', // Replace with the URL of your background image
        // backgroundSize: 'cover', // Ensures the image covers the entire container
        // backgroundPosition: 'center', // Centers the image
        // backgroundRepeat: 'no-repeat' // Prevents the image from repeating
      }}
    >
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        moveColumns={moveColumns}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardToDifferentColumn={moveCardToDifferentColumn}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
