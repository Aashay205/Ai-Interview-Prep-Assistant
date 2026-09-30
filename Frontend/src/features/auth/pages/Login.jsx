import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'
import LoadingScreen from '../../../components/LoadingScreen'

const Login = () => {

    const { loading, handleLogin } = useAuth()
    const navigate = useNavigate()

    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")
    const [ error, setError ] = useState("")

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError("")
        try {
            await handleLogin({ email, password })
            navigate('/')
        } catch (loginError) {
            setError(loginError.response?.data?.message || "Unable to log in. Check your connection and try again.")
        }
    }

    if(loading){
        return <LoadingScreen message='Preparing your login...' />
    }


    return (
        <main className="auth-page">
            <div className="auth-shell">
                <section className="auth-intro">
                    <span className="auth-kicker">AI INTERVIEW PREP</span>
                    <h1>Walk into your next interview <span>prepared.</span></h1>
                    <p>Build a focused interview plan, practice with AI, and turn every answer into progress.</p>
                    <div className="auth-stat"><strong>Personalized practice</strong><span>Built around your goals and experience.</span></div>
                </section>

                <div className="form-container">
                    <div className="form-heading">
                        <span className="form-eyebrow">WELCOME BACK</span>
                        <h2>Login</h2>
                        <p>Continue your interview preparation.</p>
                    </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="email">Email</label>
                        <input
                            onChange={(e) => { setEmail(e.target.value) }}
                            type="email" id="email" name='email' placeholder='Enter email address' />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            onChange={(e) => { setPassword(e.target.value) }}
                            type="password" id="password" name='password' placeholder='Enter password' />
                    </div>
                    <button className='button primary-button' >Login</button>
                </form>
                {error && <p className='auth-error' role='alert'>{error}</p>}
                <p>Don't have an account? <Link to={"/register"} >Register</Link> </p>
                </div>
            </div>
        </main>
    )
}

export default Login