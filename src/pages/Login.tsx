import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useUserData } from "../context/UserContext"

const Login = () => {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const navigate = useNavigate()
    const {btnLoading,loginUser} = useUserData()

    async function submitHandler(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        loginUser(email, password, navigate)
    }

  return (
    <div className="flex items-center justify-center h-screen max-h-screen">
        <div className="bg-black text-white p-8 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-3xl font-semiboldtext-center mb-8">
                Login To Spotify
            </h2>
            <form className="mt-8" onSubmit={submitHandler}>
                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Email
                    </label>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      className="auth-input" 
                      required 
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setEmail(e.target.value)}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium mb-1">
                        Password
                    </label>
                    <input 
                      type="password" 
                      placeholder="Enter your password" 
                      className="auth-input" 
                      required 
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>)=> setPassword(e.target.value)}
                    />
                </div>
                
                <button disabled={btnLoading} className="auth-btn">
                    {btnLoading ? "Logging in..." : "Login"}
                </button>
            </form>

            <div className="text-center mt-6">
                <Link to="/register" className="text-sm text-gray-400 hover:text-gray-200">
                    Don't have an account? Register
                </Link>
            </div>
        </div>
    </div>
  )
}

export default Login
