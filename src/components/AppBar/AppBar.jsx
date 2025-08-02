import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import AppsIcon from '@mui/icons-material/Apps'
import { ReactComponent as ReactIcon } from '~/assets/react.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Workspaces from './Menus/Workspaces'
import Recent from './Menus/Recent'
import Starred from './Menus/Starred'
import Templates from './Menus/Templates'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone'
import Badge from '@mui/material/Badge'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import InputAdornment from '@mui/material/InputAdornment'
import SearchIcon from '@mui/icons-material/Search'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'

function AppBar() {
  const [searchValue, setSearchValue] = useState('')

  return (
    <Box
      sx={{
        width: '100%',
        height: (theme) => theme.trello.appBarHeight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        // gap: 2,
        borderBottom: '1px solid',
        borderColor: (theme) => theme.trello.borderColor,
        paddingX: 1.8,
        overflowX: 'auto',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark' ? '#2c3e50' : 'hsl(215,90%,32.7%)'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.3
        }}
      >
        <AppsIcon
          sx={{
            color: 'white'
          }}
          fontSize='small'
        />
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}
        >
          <SvgIcon
            component={ReactIcon}
            fontSize='small'
            inheritViewBox
            sx={{ color: 'white' }}
          />
          <Typography
            variant='span'
            sx={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}
          >
            Todos
          </Typography>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'flex' },
            gap: 1,
            marginLeft: '6px',
            '@media (max-width: 1075px)': {
              display: 'none' // Apply custom breakpoint behavior
            }
          }}
        >
          <Workspaces />
          <Recent />
          <Starred />
          <Templates />
          <Button
            sx={{
              color: 'white',
              backgroundColor: 'rgba(255, 255, 255, 0.20)',
              border: 'none',
              '&:hover': {
                border: 'none',
                backgroundColor: 'rgba(255, 255, 255, 0.36)'
              }
            }}
            variant='outlined'
            startIcon={<LibraryAddIcon />}
          >
            Create
          </Button>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.2
        }}
      >
        <TextField
          id='outlined-search'
          // label='Search...'
          placeholder='Search...'
          type='text'
          size='small'
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: 'white' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position='end'>
                <CloseIcon
                  fontSize='small'
                  sx={{
                    color: searchValue ? 'white' : 'transparent',
                    cursor: 'pointer'
                  }}
                  onClick={() => setSearchValue('')}
                />
              </InputAdornment>
            )
          }}
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            minWidth: '190px',
            maxWidth: '190px',
            // '& label': { color: 'white' },
            '& input': {
              color: 'white',
              '&::placeholder': {
                color: 'white',
                opacity: 1 // Ensure the placeholder is fully visible (no transparency)
              }
            },
            '& label.Mui-focused': { color: 'white' },
            '& .MuiOutlinedInput-root': {
              '& fieldset': { borderColor: 'white' },
              '&:hover fieldset': { borderColor: 'white' },
              '&.Mui-focused fieldset': { borderColor: 'white' }
            }
          }}
        />
        <ModeSelect />

        <Tooltip title='Notification'>
          <Badge color='warning' variant='dot' sx={{ cursor: 'pointer' }}>
            <NotificationsNoneIcon
              sx={{
                color: 'white',
                fontSize: '20px'
              }}
            />
          </Badge>
        </Tooltip>

        <Tooltip title='Help'>
          <HelpOutlineIcon
            sx={{ cursor: 'pointer', color: 'white', fontSize: '20px' }}
          />
        </Tooltip>

        <Profiles />
      </Box>
    </Box>
  )
}

export default AppBar
