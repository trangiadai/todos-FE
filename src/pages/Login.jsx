import React, { useState, useEffect } from 'react'
import {
  Avatar,
  Button,
  TextField,
  Box,
  Typography,
  Container,
  Paper,
  Alert
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { useNavigate } from 'react-router-dom'
import { SignInButton } from '@clerk/clerk-react'
import { useUser } from '@clerk/clerk-react'

export default function Login() {
  const { user } = useUser()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [signupSuccess, setSignupSuccess] = useState(false) // ✅ trạng thái thành công khi signup
  const navigate = useNavigate()

  useEffect(() => {
    const autoSignUpAndLogin = async () => {
      if (!user) return

      const email = user.primaryEmailAddress?.emailAddress
      console.log('User email:', email)

      const defaultPassword = '1234'

      try {
        // Gọi API tạo user
        const createRes = await fetch('http://localhost:8080/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })

        if (!createRes.ok) {
          console.error('Lỗi khi tạo user:', await createRes.text())
          return
        }

        console.log('User đã được tạo (hoặc đã tồn tại)')

        // Set form để đăng nhập
        const loginForm = { username: email, password: defaultPassword }

        // Gọi API login
        const loginRes = await fetch('http://localhost:8080/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(loginForm)
        })

        const userId = await loginRes.text()
        if (userId) {
          console.log('Login thành công với userId:', userId)
          navigate('/board', { state: { userId } })
        } else {
          console.error('Login thất bại, không có userId')
        }
      } catch (err) {
        console.error('Lỗi toàn bộ quá trình auto login:', err)
      }
    }

    autoSignUpAndLogin()
  }, [user])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
    setSignupSuccess(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSignupSuccess(false)

    try {
      const res = await fetch('http://localhost:8080/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const userId = await res.text()

      if (userId) {
        navigate('/board', { state: { userId } })
      } else {
        setError('Tài khoản hoặc mật khẩu không đúng')
      }
    } catch (err) {
      console.error('Lỗi API:', err)
      setError('Đã xảy ra lỗi khi kết nối đến server')
    }
  }

  const handleSignup = async () => {
    setError('')
    setSignupSuccess(false)

    try {
      const res = await fetch('http://localhost:8080/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(form)
      })

      const userId = await res.text()

      if (userId) {
        setSignupSuccess(true) // ✅ hiện thông báo thành công
      } else {
        setError('Đăng ký thất bại. Tên người dùng có thể đã tồn tại.')
      }
    } catch (err) {
      console.error('Lỗi API:', err)
      setError('Đã xảy ra lỗi khi kết nối đến server')
    }
  }

  return (
    <Container component='main' maxWidth='xs'>
      <Paper elevation={6} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Box display='flex' flexDirection='column' alignItems='center'>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component='h1' variant='h5'>
            Welcome to <strong>todos</strong>
          </Typography>
          <Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
            Sign in to manage your tasks like Trello
          </Typography>

          {/* Thông báo lỗi */}
          {error && (
            <Alert severity='error' sx={{ width: '100%' }}>
              {error}
            </Alert>
          )}

          {/* Thông báo đăng ký thành công */}
          {signupSuccess && (
            <Alert severity='success' sx={{ width: '100%' }}>
              Đăng ký thành công! Bây giờ bạn có thể đăng nhập.
            </Alert>
          )}

          <Box
            component='form'
            onSubmit={handleSubmit}
            noValidate
            sx={{ width: '100%', mt: 2 }}
          >
            <TextField
              margin='normal'
              required
              fullWidth
              label='Username'
              name='username'
              value={form.username}
              onChange={handleChange}
              autoFocus
            />
            <TextField
              margin='normal'
              required
              fullWidth
              label='Password'
              name='password'
              type='password'
              value={form.password}
              onChange={handleChange}
            />

            <Button
              fullWidth
              variant='outlined'
              onClick={handleSignup}
              sx={{ mt: 2, mb: 1, borderRadius: 2 }}
            >
              Sign Up
            </Button>

            <Button
              type='submit'
              fullWidth
              variant='contained'
              sx={{ mt: 1, mb: 2, borderRadius: 2 }}
            >
              Sign In
            </Button>
            <SignInButton mode='redirect' redirectUrl='/callback'>
              <Button
                fullWidth
                variant='outlined'
                startIcon={
                  <img
                    src='https://developers.google.com/identity/images/g-logo.png'
                    alt='Google logo'
                    style={{ width: 20, height: 20 }}
                  />
                }
                sx={{ mt: 1, borderRadius: 2 }}
              >
                Sign in with Google
              </Button>
            </SignInButton>
          </Box>
        </Box>
      </Paper>
    </Container>
  )
}
