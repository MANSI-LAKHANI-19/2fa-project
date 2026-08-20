import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

function Settings() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false)
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const styles = {
    container: {
      width: '450px',
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
      marginBottom: '25px'
    },
    label: {
      fontSize: '16px',
      color: '#CFCFCF'
    },
    checkbox: {
      transform: 'scale(1.2)',
      marginRight: '8px',
      cursor: 'pointer',
      accentColor: '#008000'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #444',
      borderRadius: '8px',
      fontSize: '15px',
      boxSizing: 'border-box',
      outline: 'none',
      background: '#2A2A2A',
      color: '#FFFFFF'
    },
    message: {
      color: '#22C55E',
      marginBottom: '15px'
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

  useEffect(() => {
    if (!token) return

    fetch('/api/user/profile', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        setTwoFactorEnabled(!!data.twoFactorEnabled)
        setPhone(data.phone || '')
      })
  }, [token])

  async function saveSettings() {
    setMessage('')

    const res = await fetch('/api/user/profile', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        twoFactorEnabled,
        phone
      })
    })

    if (res.ok) {
      setMessage('Settings saved successfully.')
    } else {
      setMessage('Failed to save settings.')
    }
  }

  if (!token) {
    return (
      <div style={styles.container}>
        <p style={{ color: '#CFCFCF' }}>You're not logged in.</p>

        <button
          style={styles.button}
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Security Settings</h2>

      <label style={styles.label}>
        <input
          type="checkbox"
          style={styles.checkbox}
          checked={twoFactorEnabled}
          onChange={e => setTwoFactorEnabled(e.target.checked)}
        />
        {' '}Enable Two-Factor Authentication
      </label>

      <br /><br />

      <input
        style={styles.input}
        placeholder="Phone (optional, for future SMS OTP)"
        value={phone}
        onChange={e => setPhone(e.target.value)}
      />

      <br /><br />

      {message && <p style={styles.message}>{message}</p>}

      <button
        style={styles.button}
        onClick={saveSettings}
      >
        Save
      </button>

      <button
        style={styles.button}
        onClick={() => navigate('/dashboard')}
      >
        Back
      </button>
    </div>
  )
}

export default Settings