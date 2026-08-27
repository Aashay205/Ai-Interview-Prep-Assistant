import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getInterviewReportById, evaluateMockAnswer } from '../services/interview.api'
import '../style/mock-interview.scss'

const MAX_QUESTIONS = 5

const MockInterview = () => {
    const { interviewId } = useParams()
    const navigate = useNavigate()
    const [report, setReport] = useState(null)
    const [question, setQuestion] = useState('')
    const [answer, setAnswer] = useState('')
    const [feedback, setFeedback] = useState(null)
    const [history, setHistory] = useState([])
    const [loading, setLoading] = useState(true)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        const loadReport = async () => {
            try {
                const data = await getInterviewReportById(interviewId)
                const interviewReport = data.interviewReport
                setReport(interviewReport)
                setQuestion(interviewReport.technicalQuestions?.[0]?.question || interviewReport.behavioralQuestions?.[0]?.question || '')
            } catch {
                setError('Unable to load this interview.')
            } finally {
                setLoading(false)
            }
        }

        loadReport()
    }, [ interviewId ])

    const submitAnswer = async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setError('')

        try {
            const data = await evaluateMockAnswer({
                interviewId,
                question,
                answer,
                history: history.map(item => `${item.question}: ${item.answer}`).join('\n')
            })
            setFeedback(data.feedback)
            setHistory(current => [ ...current, { question, answer, feedback: data.feedback } ])
            setAnswer('')
        } catch (submitError) {
            setError(submitError.response?.data?.message || 'Could not evaluate your answer.')
        } finally {
            setSubmitting(false)
        }
    }

    const continueInterview = () => {
        setQuestion(feedback.followUpQuestion)
        setFeedback(null)
    }

    if (loading) return <main className='loading-screen'><h1>Preparing your mock interview...</h1></main>
    if (!report) return <main className='mock-interview'><p>{error}</p></main>

    const finished = history.length >= MAX_QUESTIONS

    return (
        <main className='mock-interview'>
            <div className='mock-interview__shell'>
                <header className='mock-interview__header'>
                    <button className='mock-interview__back' onClick={() => navigate(`/interview/${interviewId}`)}>
                        <span aria-hidden='true'>&larr;</span> Back to plan
                    </button>
                    <div className='mock-interview__status'>
                        <span className='mock-interview__status-dot' /> Live session
                    </div>
                </header>

                <div className='mock-interview__progress-row'>
                    <div>
                        <p className='mock-interview__eyebrow'>Live mock interview</p>
                        <h1>{report.title}</h1>
                    </div>
                    <span className='mock-interview__counter'>Question {Math.min(history.length + 1, MAX_QUESTIONS)} <small>/ {MAX_QUESTIONS}</small></span>
                </div>
                <div className='mock-interview__progress' aria-label='Interview progress'>
                    <span style={{ width: `${(Math.min(history.length, MAX_QUESTIONS) / MAX_QUESTIONS) * 100}%` }} />
                </div>

                <section className='mock-interview__panel'>
                {finished ? (
                    <div className='mock-interview__summary'>
                        <h2>Session complete</h2>
                        <p>Your average score was {Math.round(history.reduce((total, item) => total + item.feedback.score, 0) / history.length)}%.</p>
                        <button className='button primary-button' onClick={() => navigate(`/interview/${interviewId}`)}>Review interview plan</button>
                    </div>
                ) : feedback ? (
                    <div className='mock-interview__feedback'>
                        <div className='mock-interview__score'>{feedback.score}<small>/100</small></div>
                        <p>{feedback.feedback}</p>
                        <h3>What worked</h3>
                        <ul>{feedback.strengths.map((item, index) => <li key={index}>{item}</li>)}</ul>
                        <h3>Improve next time</h3>
                        <ul>{feedback.improvements.map((item, index) => <li key={index}>{item}</li>)}</ul>
                        <button className='button primary-button' onClick={continueInterview}>Continue</button>
                    </div>
                ) : (
                    <form onSubmit={submitAnswer}>
                        <div className='mock-interview__question'>
                            <span className='mock-interview__label'>Interviewer asks</span>
                            <p>{question}</p>
                        </div>
                        <label className='mock-interview__label' htmlFor='answer'>Your response</label>
                        <textarea id='answer' value={answer} onChange={event => setAnswer(event.target.value)} placeholder='Write your answer as if you were speaking to the interviewer...' rows='9' required />
                        <div className='mock-interview__form-footer'>
                            <span>Take your time. Specific examples make stronger answers.</span>
                        {error && <p className='mock-interview__error'>{error}</p>}
                            <button className='button primary-button' disabled={submitting}>{submitting ? 'Evaluating...' : 'Submit answer'} <span aria-hidden='true'>&rarr;</span></button>
                        </div>
                    </form>
                )}
                </section>
            </div>
        </main>
    )
}

export default MockInterview