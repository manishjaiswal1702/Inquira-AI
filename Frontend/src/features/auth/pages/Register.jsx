import React, { useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'
import { CheckCircle, Mail } from 'lucide-react'


const Register = () => {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [registrationSuccess, setRegistrationSuccess] = useState(false)

  const { handleRegister } = useAuth()
  const navigate = useNavigate()

  const loading = useSelector(state => state.auth.loading)
  const error = useSelector(state => state.auth.error)
  
  if (loading && !registrationSuccess) {
    return <div className="min-h-screen bg-[#0f0f1e] text-white flex items-center justify-center">Loading...</div>
  }

  const submitForm = async (event) => {
    event.preventDefault()

    const payload = {
      username,
      email,
      password,
    }
    await handleRegister(payload)
    setRegistrationSuccess(true)
  }

  // Show verification pending screen
  if (registrationSuccess) {
    return (
      <section className="min-h-screen bg-[#0f0f1e] px-4 py-10 text-white sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="w-full max-w-md">
          <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-8 backdrop-blur text-center">
            <div className='w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-3xl mx-auto mb-6'>
              <CheckCircle size={32} />
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">Registration Successful!</h2>
            <p className="text-white/70 mb-4">
              We've sent a verification email to <strong>{email}</strong>
            </p>

            <div className="bg-orange-500/10 border border-orange-500/30 rounded-lg p-4 mb-6">
              <div className='flex items-start gap-3'>
                <Mail size={20} className='text-orange-400 flex-shrink-0 mt-1' />
                <div className='text-left'>
                  <p className="text-sm text-white/90 font-medium">Check your email</p>
                  <p className="text-xs text-white/60 mt-1">
                    Click the verification link to activate your account. The link expires in 24 hours.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-white/60 text-sm mb-6">
              Once verified, you can log in with your credentials.
            </p>

            <Link 
              to="/login"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg transition inline-block"
            >
              Go to Login
            </Link>

            <p className="text-white/60 text-sm mt-4">
              Didn't receive the email? Check your spam folder.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="min-h-screen bg-[#0f0f1e] px-4 py-10 text-white sm:px-6 lg:px-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="mb-8 text-center">
          <div className='w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-2xl mx-auto'>
            ◉
          </div>
          <h1 className="mt-4 text-4xl font-bold">Inquira AI</h1>
          <p className="mt-2 text-white/60">Create your account</p>
        </div>

        {/* Register Card */}
        <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-8 backdrop-blur">
          <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={submitForm} className="space-y-5">
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-white/90">
                Username
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Choose a username"
                required
                className="w-full rounded-lg border border-white/20 bg-[#0f0f1e] px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-orange-500/50 focus:bg-[#242438]"
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-white/90">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-lg border border-white/20 bg-[#0f0f1e] px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-orange-500/50 focus:bg-[#242438]"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-white/90">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Create a strong password"
                required
                className="w-full rounded-lg border border-white/20 bg-[#0f0f1e] px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-orange-500/50 focus:bg-[#242438]"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 transition disabled:bg-orange-500/50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-white/60">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-orange-400 hover:text-orange-300 transition">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Register