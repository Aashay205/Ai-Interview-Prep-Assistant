const LoadingScreen = ({ message = 'Loading your interview workspace...' }) => (
    <main className='loading-screen' aria-live='polite'>
        <div className='loading-screen__glow' aria-hidden='true' />
        <div className='loading-screen__content'>
            <span className='loading-screen__kicker'>AI INTERVIEW PREP</span>
            <div className='loading-screen__mark' aria-hidden='true'>
                <span />
                <span />
                <span />
            </div>
            <h1>{message}</h1>
            <p>Setting up your next step.</p>
        </div>
    </main>
)

export default LoadingScreen