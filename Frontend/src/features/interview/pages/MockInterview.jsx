import React, { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import { getInterviewReportById, evaluateMockAnswer } from '../services/interview.api'
import '../style/mock-interview.scss'
import LoadingScreen from '../../../components/LoadingScreen'

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
    const [sessionId] = useState(() => window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`)
    const [sessionDebrief, setSessionDebrief] = useState(null)
    const startQuestionRef = useRef({ interviewId: null, question: '' })

    useEffect(() => {
        const loadReport = async () => {
            try {
                const data = await getInterviewReportById(interviewId)
                const interviewReport = data.interviewReport
                setReport(interviewReport)

                if (startQuestionRef.current.interviewId !== interviewId) {
                    const plannedQuestions = [
                        ...(interviewReport.technicalQuestions || []),
                        ...(interviewReport.behavioralQuestions || [])
                    ].map(item => item.question).filter(Boolean)
                    let startIndex = 0

                    if (plannedQuestions.length > 0) {
                        const storageKey = `mock-interview-start:${interviewId}`
                        try {
                            const savedIndex = Number.parseInt(window.localStorage.getItem(storageKey) || '0', 10)
                            startIndex = Number.isInteger(savedIndex) && savedIndex >= 0
                                ? savedIndex % plannedQuestions.length
                                : 0
                            window.localStorage.setItem(storageKey, String((startIndex + 1) % plannedQuestions.length))
                        } catch {
                            startIndex = Math.floor(Math.random() * plannedQuestions.length)
                        }
                    }

                    startQuestionRef.current = {
                        interviewId,
                        question: plannedQuestions[startIndex] || ''
                    }
                }

                setQuestion(startQuestionRef.current.question)
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
                history: history.map(({ question, answer, feedback }) => ({
                    question,
                    answer,
                    score: feedback.score,
                    feedback: feedback.feedback,
                    strengths: feedback.strengths,
                    improvements: feedback.improvements
                })),
                sessionId
            })
            setFeedback(data.feedback)
            setHistory(current => [ ...current, { question, answer, feedback: data.feedback } ])
            if (history.length + 1 >= MAX_QUESTIONS) {
                setSessionDebrief({
                    summary: data.feedback.sessionSummary,
                    practicePriorities: data.feedback.practicePriorities || []
                })
            }
            setAnswer('')
        } catch (submitError) {
            setError(submitError.response?.data?.message || 'Could not evaluate your answer.')
        } finally {
            setSubmitting(false)
        }
    }

    const continueInterview = () => {
        setQuestion(feedback.nextQuestion)
        setFeedback(null)
    }

    const finishInterview = () => setFeedback(null)

    if (loading) return <LoadingScreen message='Preparing your mock interview...' />
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
                {feedback ? (
                    <div className='mock-interview__feedback'>
                        <div className='mock-interview__score'>{feedback.score}<small>/100</small></div>
                        <p>{feedback.feedback}</p>
                        <h3>What worked</h3>
                        <ul>{feedback.strengths.map((item, index) => <li key={index}>{item}</li>)}</ul>
                        <h3>Improve next time</h3>
                        <ul>{feedback.improvements.map((item, index) => <li key={index}>{item}</li>)}</ul>
                        <button className='button primary-button' onClick={history.length >= MAX_QUESTIONS ? finishInterview : continueInterview}>
                            {history.length >= MAX_QUESTIONS ? 'View session summary' : 'Continue'}
                        </button>
                    </div>
                ) : finished ? (
                    <div className='mock-interview__summary'>
                        <h2>Session complete</h2>
                        <p className='mock-interview__score'>
                            {Math.round(history.reduce((total, item) => total + item.feedback.score, 0) / history.length)}
                            <small>%</small>
                        </p>
                        <p>Average score</p>
                        {sessionDebrief && (
                            <div className='mock-interview__debrief'>
                                <h3>Session debrief</h3>
                                <p>{sessionDebrief.summary}</p>
                                {sessionDebrief.practicePriorities.length > 0 && (
                                    <>
                                        <h3>Practice next</h3>
                                        <ul>{sessionDebrief.practicePriorities.map((priority, index) => <li key={index}>{priority}</li>)}</ul>
                                    </>
                                )}
                            </div>
                        )}
                        <button className='button primary-button' onClick={() => navigate(`/interview/${interviewId}`)}>Review interview plan</button>
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