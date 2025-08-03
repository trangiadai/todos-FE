import CommentIcon from '@mui/icons-material/Comment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import GroupIcon from '@mui/icons-material/Group'
import CardActions from '@mui/material/CardActions'
import CardMedia from '@mui/material/CardMedia'
import { Card as MuiCard } from '@mui/material'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import Snackbar from '@mui/material/Snackbar'
import MuiAlert from '@mui/material/Alert'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogActions from '@mui/material/DialogActions'

import { useState } from 'react'
import axios from 'axios'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function Card({ card, onCardDeleted }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: card._id,
    data: { ...card }
  })

  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState(card?.title)
  const [hovering, setHovering] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  })

  const handleUpdateTitle = async () => {
    try {
      const res = await axios.post(
        `http://localhost:8080/v1/cards/edit`,
        null,
        {
          params: {
            cardId: card._id,
            colunmId: '',
            cardTitle: editedTitle,
            colunmTitle: ''
          }
        }
      )
      setIsEditing(false)
      setEditedTitle(res.data.title)
    } catch (error) {
      console.error('Update title failed:', error)
    }
  }

  const handleDeleteCard = async () => {
    try {
      await axios.delete(`http://localhost:8080/v1/cards/${card._id}`)
      if (typeof onCardDeleted === 'function') {
        onCardDeleted(card._id)
      }
      setSnackbar({
        open: true,
        message: 'Đã xoá thành công',
        severity: 'success'
      })
    } catch (error) {
      console.error('Delete card failed:', error)
      setSnackbar({
        open: true,
        message: 'Xoá thất bại',
        severity: 'error'
      })
    } finally {
      setOpenDialog(false)
    }
  }

  const dndKitCardStyles = {
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '1px solid #2ecc71' : undefined
  }

  const shouldShowCardAction = () => {
    return (
      !!card?.memberIds?.length ||
      !!card?.comments?.length ||
      !!card?.attachments?.length
    )
  }

  return (
    <>
      <MuiCard
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',
          border: '1px solid transparent',
          '&:hover': { borderColor: (theme) => theme.palette.primary.main }
        }}
      >
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}

        <CardContent
          sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          {isEditing ? (
            <TextField
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              onBlur={handleUpdateTitle}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleUpdateTitle()
              }}
              size="small"
              autoFocus
              fullWidth
            />
          ) : (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <Typography variant="body2" sx={{ flexGrow: 1 }}>
                {editedTitle}
              </Typography>
              {hovering && (
                <div style={{ display: 'flex', gap: 4 }}>
                  <IconButton size="small" onClick={() => setIsEditing(true)}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton size="small" onClick={() => setOpenDialog(true)}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </div>
              )}
            </div>
          )}
        </CardContent>

        {shouldShowCardAction() && (
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.memberIds?.length && (
              <Button size="small" startIcon={<GroupIcon />}>
                {card?.memberIds?.length}
              </Button>
            )}
            {!!card?.comments?.length && (
              <Button size="small" startIcon={<CommentIcon />}>
                {card?.comments?.length}
              </Button>
            )}
            {!!card?.attachments?.length && (
              <Button size="small" startIcon={<AttachmentIcon />}>
                {card?.attachments?.length}
              </Button>
            )}
          </CardActions>
        )}
      </MuiCard>

      {/* Dialog xác nhận xoá */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Xác nhận xoá</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xoá thẻ này không? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Huỷ</Button>
          <Button color="error" onClick={handleDeleteCard}>
            Xoá
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar thông báo */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </>
  )
}

export default Card
