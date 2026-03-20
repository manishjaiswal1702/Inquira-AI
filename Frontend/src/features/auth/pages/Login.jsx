import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { useAuth } from '../hook/useAuth'
import { useSelector } from 'react-redux'
import { Navigate } from 'react-router'


const Login = () => {
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')

    const user = useSelector(state => state.auth.user)
    const loading = useSelector(state => state.auth.loading)

    const { handleLogin } = useAuth()

    const navigate = useNavigate()

    const submitForm = async (event) => {
        event.preventDefault()

        const payload = {
            email,
            password,
        }

        await handleLogin(payload)
        navigate("/")

    }

    if(!loading && user){
        return <Navigate to="/" replace />
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
                    <p className="mt-2 text-white/60">Sign in to your account</p>
                </div>

                {/* Login Card */}
                <div className="rounded-2xl border border-white/10 bg-[#1a1a2e] p-8 backdrop-blur">
                    <h2 className="text-2xl font-bold text-white mb-6">Welcome Back</h2>

                    <form onSubmit={submitForm} className="space-y-5">
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
                                placeholder="Enter your password"
                                required
                                className="w-full rounded-lg border border-white/20 bg-[#0f0f1e] px-4 py-3 text-white outline-none transition placeholder:text-white/40 focus:border-orange-500/50 focus:bg-[#242438]"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 transition disabled:bg-orange-500/50 disabled:cursor-not-allowed"
                        >
                            Sign In
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/60">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-semibold text-orange-400 hover:text-orange-300 transition">
                            Create one
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default Login