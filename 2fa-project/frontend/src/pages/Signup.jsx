import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Signup() {
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

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })

    const data = await res.json()

    if (!res.ok) return setError(data.error)

    navigate('/login')
  }

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <h2 style={styles.heading}>Sign up</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        style={styles.input}
      />

      <br /><br />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={styles.input}
      />

      <br /><br />

      {error && <p style={styles.error}>{error}</p>}

      <button type="submit" style={styles.button}>
        Create Account
      </button>

      <p style={{ color: '#BBBBBB', marginTop: '20px' }}>
        <Link to="/login" style={styles.link}>
          Already have an account? Log in
        </Link>
      </p>
    </form>
  )
}

export default Signup