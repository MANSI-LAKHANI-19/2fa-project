import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const styles = {
    form: {
      width: '380px',
      margin: '80px auto',
      padding: '35px',
      background: '#1A1A1A',
      borderRadius: '12px',
      border: '1px solid #333',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    },
    heading: {
      marginBottom: '25px',
      color: '#FFFFFF'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #444',
      borderRadius: '8px',
      fontSize: '15px',
      outline: 'none',
      boxSizing: 'border-box',
      background: '#2A2A2A',
      color: '#FFFFFF'
    },
    button: {
      width: '100%',
      padding: '12px',
      marginTop: '10px',
      background: '#008000',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: 'pointer'
    },
    error: {
      color: '#FF6B6B',
      marginTop: '10px'
    },
    link: {
      color: '#008000',
      textDecoration: 'none',
      fontWeight: 'bold'
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) return setError(data.error)

    if (data.requiresOTP) {
      sessionStorage.setItem('tempToken', data.tempToken)
      navigate('/verify-otp')
    } else {
      localStorage.setItem('token', data.token)
      navigate('/dashboard')
    }
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Log in</h2>

      <input
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={styles.input}
      />

      <br /><br />

      <input
        placeholder="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />

      <br /><br />

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" style={styles.button}>
        Log in
      </button>

      <p style={{ color: '#BBBBBB', marginTop: '20px' }}>
        <Link to="/signup" style={styles.link}>
          Need an account? Sign up
        </Link>
      </p>
    </form>
  )
}

export default Login