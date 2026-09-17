import React,{useState} from 'react'
import { useNavigate, Link } from 'react-router'
import "../auth.form.scss"
import { useAuth } from '../hooks/useAuth'

const Register = () => {

    const navigate = useNavigate()
    const [ username, setUsername ] = useState("")
    const [ email, setEmail ] = useState("")
    const [ password, setPassword ] = useState("")

    const {loading,handleRegister} = useAuth()
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        await handleRegister({username,email,password})
        navigate("/")
    }

    if(loading){
        return (<main><h1>Loading.......</h1></main>)
    }

    return (
        <main className="auth-page">
            <div className="auth-shell">
                <section className="auth-intro">
                    <span className="auth-kicker">AI INTERVIEW PREP</span>
                    <h1>Make your next answer your <span>strongest.</span></h1>
                    <p>Practice with a plan that understands the role, your background, and where you want to go.</p>
                    <div className="auth-stat"><strong>Your preparation, elevated</strong><span>Feedback that gets sharper with every session.</span></div>
                </section>

                <div className="form-container">
                    <div className="form-heading">
                        <span className="form-eyebrow">GET STARTED</span>
                        <h2>Create account</h2>
                        <p>Set up your personal interview workspace.</p>
                    </div>

                <form onSubmit={handleSubmit}>

                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input
                            onChange={(e) => { setUsername(e.target.value) }}
                            type="text" id="username" name='username' placeholder='Enter username' />
                    </div>
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

                    <button className='button primary-button' >Register</button>

                </form>

                <p>Already have an account? <Link to={"/login"} >Login</Link> </p>
                </div>
            </div>
        </main>
    )
}

export default Register