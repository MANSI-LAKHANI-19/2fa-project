import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function VerifyOtp() {
  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const tempToken = sessionStorage.getItem('tempToken')

  const styles = {
    form: {
      width: '400px',
      margin: '80px auto',
      padding: '35px',
      background: '#1A1A1A',
      borderRadius: '12px',
      border: '1px solid #333',
      boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif'
    },
    container: {
      width: '400px',
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
      color: '#FFFFFF',
      marginBottom: '15px'
    },
    text: {
      color: '#CFCFCF',
      fontSize: '15px',
      marginBottom: '20px',
      lineHeight: '1.5'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #444',
      borderRadius: '8px',
      fontSize: '18px',
      textAlign: 'center',
      letterSpacing: '5px',
      boxSizing: 'border-box',
      outline: 'none',
      background: '#2A2A2A',
      color: '#FFFFFF'
    },
    error: {
      color: '#FF6B6B',
      marginBottom: '10px'
    },
    success: {
      color: '#22C55E',
      marginBottom: '10px'
    },
    button: {
      padding: '12px 20px',
      margin: '8px',
      background: '#008000',
      color: '#FFFFFF',
      border: 'none',
      borderRadius: '8px',
      fontSize: '15px',
      fontWeight: 'bold',
      cursor: 'pointer'
    }
  }

  async function handleVerify(e) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, tempToken })
    })

    const data = await res.json()
    setLoading(false)

    if (!res.ok) return setError(data.error)

    localStorage.setItem('token', data.token)
    sessionStorage.removeItem('tempToken')
    navigate('/dashboard')
  }

  async function handleResend() {
    setInfo('')
    setError('')

    const res = await fetch('/api/auth/resend-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempToken })
    })

    const data = await res.json()

    if (!res.ok) return setError(data.error)

    setInfo(data.message)
  }

  if (!tempToken) {
    return (
      <div style={styles.container}>
        <p style={styles.text}>No verification in progress.</p>

        <button
          style={styles.button}
          onClick={() => navigate('/login')}
        >
          Back to Login
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleVerify} style={styles.form}>
      <h2 style={styles.heading}>Enter the 6-Digit OTP</h2>

      <p style={styles.text}>
        Check your email for the verification code.
      </p>

      <input
        style={styles.input}
        value={otp}
        onChange={e => setOtp(e.target.value)}
        maxLength={6}
        placeholder="123456"
      />

      <br /><br />

      {error && <p style={styles.error}>{error}</p>}
      {info && <p style={styles.success}>{info}</p>}

      <button
        type="submit"
        style={styles.button}
        disabled={loading}
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>

      <button
        type="button"
        style={styles.button}
        onClick={handleResend}
      >
        Resend Code
      </button>
    </form>
  )
}

export default VerifyOtp