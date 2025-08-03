import { useUser } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'
import { useEffect } from 'react'

export default function AuthCallback() {
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    console.log('Effect chạy, user:', user)

    if (user) {
      const email = user.primaryEmailAddress?.emailAddress
      console.log('Đăng nhập thành công, email:', email)

      fetch('http://localhost:8080/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
        .then((res) => res.text())
        .then((data) => {
          console.log('Response từ BE:', data)
          navigate('/board', { state: { userEmail: email } })
        })
        .catch((err) => console.error('Lỗi gọi API:', err))
    } else {
      console.log('user chưa sẵn sàng hoặc null')
    }
  }, [user])

  return <h1>Đang xử lý đăng nhập...</h1>
}
