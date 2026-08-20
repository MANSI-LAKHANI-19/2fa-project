import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const styles = {
    container: {
      width: '500px',
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
      marginBottom: '20px'
    },
    text: {
      color: '#CFCFCF',
      fontSize: '16px',
      marginBottom: '25px',
      lineHeight: '1.6'
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

  if (!token) {
    return (
      <div style={styles.container}>
        <p style={styles.text}>You're not logged in.</p>

        <button
          style={styles.button}
          onClick={() => navigate('/login')}
        >
          Go to Login
        </button>
      </div>
    )
  }

  function logout() {
    localStorage.removeItem('token')
    navigate('/login')
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Dashboard</h2>

      <p style={styles.text}>
        You're logged in. This page only loads after OTP verification (if 2FA is enabled).
      </p>

      <button
        style={styles.button}
        onClick={() => navigate('/settings')}
      >
        Go to Settings
      </button>

      <button
        style={styles.button}
        onClick={logout}
      >
        Log Out
      </button>
    </div>
  )
}

export default Dashboard