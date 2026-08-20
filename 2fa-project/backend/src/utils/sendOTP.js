const { Resend } = require('resend')
const resend = new Resend(process.env.RESEND_API_KEY)

// destination = email for now. Swap in Twilio here later for SMS (see README Part 9).
async function sendOTP(destination, otp) {
  if (!process.env.RESEND_API_KEY) {
    // Fallback for local dev if no API key is set yet — logs the code instead of emailing it.
    console.log(`[DEV MODE] OTP for ${destination}: ${otp}`)
    return
  }

  await resend.emails.send({
    from: process.env.RESEND_FROM || 'onboarding@resend.dev',
    to: destination,
    subject: 'Your login verification code',
    html: `<p>Your one-time code is:</p>
           <h2 style="letter-spacing:4px;">${otp}</h2>
           <p>This code expires in 10 minutes. If you didn't request this, you can ignore this email.</p>`
  })
}

module.exports = sendOTP
