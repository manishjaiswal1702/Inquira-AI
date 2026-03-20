import { useDispatch } from "react-redux";
import { register, login, getMe, logout } from "../service/auth.api";
import { setUser, setLoading, setError } from "../auth.slice";


export function useAuth() {


    const dispatch = useDispatch()

    async function handleRegister({ email, username, password }) {
        try {
            dispatch(setLoading(true))
            const data = await register({ email, username, password })
            // Don't set user state on registration - user must verify email first
            // User will be set only after they verify email and login
            dispatch(setError(null))
        } catch (error) {
            dispatch(setError(error.response?.data?.message || "Registration failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogin({ email, password }) {
        try {
            dispatch(setLoading(true))
            const data = await login({ email, password })
            dispatch(setUser(data.user))
            dispatch(setError(null))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Login failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleGetMe() {
        try {
            dispatch(setLoading(true))
            const data = await getMe()
            dispatch(setUser(data.user))
        } catch (err) {
            // Silently ignore 401 errors (no token/not authenticated)
            // Only show error for other types of failures
            if (err.response?.status !== 401) {
                dispatch(setError(err.response?.data?.message || "Failed to fetch user data"))
            }
        } finally {
            dispatch(setLoading(false))
        }
    }

    async function handleLogout() {
        try {
            dispatch(setLoading(true))
            await logout()
            dispatch(setUser(null))
            dispatch(setError(null))
        } catch (err) {
            dispatch(setError(err.response?.data?.message || "Logout failed"))
        } finally {
            dispatch(setLoading(false))
        }
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe,
        handleLogout,
    }

}