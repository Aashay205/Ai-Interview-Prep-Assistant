import { Link } from 'react-router'
import './landing.scss'

const features = [
    {
        number: '01',
        title: 'A plan made for your role',
        description: 'Bring a job description and your experience. Get a focused preparation plan built around the opportunity in front of you.',
        icon: (
            <svg viewBox='0 0 24 24' aria-hidden='true'>
                <rect x='4' y='3' width='16' height='18' rx='2' />
                <path d='M8 8h8M8 12h8M8 16h4' />
            </svg>
        )
    },
    {
        number: '02',
        title: 'Practice that feels personal',
        description: 'Step into a mock interview with questions from your plan, then get thoughtful feedback on each answer.',
        icon: (
            <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M12 3a9 9 0 0 0-9 9v5a2 2 0 0 0 2 2h2v-7H4' />
                <path d='M12 3a9 9 0 0 1 9 9v5a2 2 0 0 1-2 2h-2v-7h4M9 21h6' />
            </svg>
        )
    },
    {
        number: '03',
        title: 'Know what to work on next',
        description: 'See what is working, where to improve, and what to prioritize after every practice session.',
        icon: (
            <svg viewBox='0 0 24 24' aria-hidden='true'>
                <path d='M4 19V5M4 19h17' />
                <path d='m7 15 4-4 3 2 6-7' />
                <path d='M16 6h4v4' />
            </svg>
        )
    }
]

const Landing = () => (
    <main className='landing-page'>
        <header className='landing-nav'>
            <Link className='landing-brand' to='/' aria-label='Prepwise home'>
                <span className='landing-brand__mark' aria-hidden='true'>
                    <span />
                    <span />
                    <span />
                </span>
                <span>prep<span className='landing-brand__accent'>wise</span></span>
            </Link>
            <nav className='landing-nav__links' aria-label='Main navigation'>
                <a href='#features'>Why Prepwise</a>
                <a href='#how-it-works'>How it works</a>
            </nav>
            <div className='landing-nav__actions'>
                <Link className='landing-nav__login' to='/login'>Log in</Link>
                <Link className='landing-button landing-button--small' to='/register'>
                    Get started <span aria-hidden='true'>↗</span>
                </Link>
            </div>
        </header>

        <section className='landing-hero'>
            <div className='landing-hero__content'>
                <p className='landing-eyebrow'><span /> PREPWISE · YOUR NEXT CHAPTER STARTS HERE</p>
                <h1>Show up ready<br />for <span>what’s next.</span></h1>
                <p className='landing-hero__copy'>
                    Turn the job you want into a plan you can act on. Prepare with focused questions,
                    practice out loud, and get clearer with every answer.
                </p>
                <div className='landing-hero__actions'>
                    <Link className='landing-button' to='/register'>
                        Build my interview plan <span aria-hidden='true'>↗</span>
                    </Link>
                    <a className='landing-text-link' href='#how-it-works'>
                        See how it works <span aria-hidden='true'>↓</span>
                    </a>
                </div>
                <div className='landing-hero__note'>
                    <span className='landing-hero__note-icon' aria-hidden='true'>✦</span>
                    Made for your role. Built around your experience.
                </div>
            </div>

            <div className='landing-visual' role='img' aria-label='Animated preview of the interview plan and mock interview'>
                <div className='landing-visual__glow' aria-hidden='true' />
                <div className='product-demo' aria-hidden='true'>
                    <div className='product-demo__topbar'>
                        <div className='product-demo__brand'><span /> PREPWISE <i>/</i> INTERVIEW PLAN</div>
                        <span className='product-demo__status'><span /> SAMPLE PREVIEW</span>
                    </div>
                    <div className='product-demo__workspace'>
                        <aside className='product-demo__sidebar'>
                            <span className='product-demo__sidebar-label'>YOUR PLAN</span>
                            <span className='product-demo__nav-item product-demo__nav-item--active'><i>⌘</i> Technical Questions</span>
                            <span className='product-demo__nav-item'><i>◌</i> Behavioral Questions</span>
                            <span className='product-demo__nav-item'><i>↗</i> Road Map</span>
                            <span className='product-demo__sidebar-divider' />
                            <span className='product-demo__nav-item'><i>◷</i> Past Sessions</span>
                        </aside>
                        <div className='product-demo__content'>
                            <section className='product-scene product-scene--plan'>
                                <div className='product-scene__heading'>
                                    <span className='product-scene__eyebrow'>YOUR INTERVIEW PLAN</span>
                                    <span className='product-scene__count'>8 questions</span>
                                </div>
                                <h2>Technical Questions</h2>
                                <div className='product-question'>
                                    <div className='product-question__prompt'>
                                        <span>Q1</span>
                                        <strong>How would you approach designing a component system that can scale?</strong>
                                        <i aria-hidden='true'>⌄</i>
                                    </div>
                                    <div className='product-question__detail'>
                                        <span className='product-tag product-tag--intent'>INTENTION</span>
                                        <p>Show how you balance consistency, accessibility, and flexibility.</p>
                                        <span className='product-tag product-tag--answer'>MODEL ANSWER</span>
                                        <p>Start with shared principles, then validate patterns with real use cases.</p>
                                    </div>
                                </div>
                                <div className='product-question product-question--next'>
                                    <span className='product-question__next-index'>Q2</span>
                                    <span>How do you use research to guide a design decision?</span>
                                    <i aria-hidden='true'>⌄</i>
                                </div>
                                <div className='product-scene__hint'><span>✦</span> Questions tailored to your role</div>
                            </section>

                            <section className='product-scene product-scene--mock'>
                                <div className='product-scene__mock-head'>
                                    <div>
                                        <span className='product-scene__eyebrow'>LIVE MOCK INTERVIEW</span>
                                        <h2>Product designer</h2>
                                    </div>
                                    <span className='product-scene__counter'>02 <i>/ 05</i></span>
                                </div>
                                <div className='product-mock-progress'><span /></div>
                                <span className='product-scene__label'>INTERVIEWER ASKS</span>
                                <div className='product-mock-question'>Tell me about a design decision you made using user feedback.</div>
                                <span className='product-scene__label'>YOUR RESPONSE</span>
                                <div className='product-mock-answer'>
                                    <span>I brought the research findings into our next design review...</span>
                                    <i aria-hidden='true' />
                                </div>
                                <div className='product-mock-submit'>Submit answer <span aria-hidden='true'>→</span></div>
                            </section>

                            <section className='product-scene product-scene--feedback'>
                                <div className='product-feedback__heading'>
                                    <span className='product-feedback__spark' aria-hidden='true'>✳</span>
                                    <div>
                                        <span className='product-scene__eyebrow'>ANSWER FEEDBACK</span>
                                        <h2>A strong start.</h2>
                                    </div>
                                    <span className='product-feedback__score'>86<small>/100</small></span>
                                </div>
                                <p className='product-feedback__summary'>Your example connected research to a clear design decision.</p>
                                <div className='product-feedback__item'>
                                    <span className='product-feedback__check'>✓</span>
                                    <span><strong>What worked</strong><small>Clear context and a user-focused result</small></span>
                                </div>
                                <div className='product-feedback__item product-feedback__item--next'>
                                    <span className='product-feedback__arrow'>↗</span>
                                    <span><strong>Improve next time</strong><small>Add a specific outcome or metric</small></span>
                                </div>
                                <div className='product-feedback__continue'>Continue to next question <span aria-hidden='true'>→</span></div>
                            </section>
                        </div>
                    </div>
                    <div className='product-demo__footer'>
                        <span>YOUR PREP, ONE ANSWER AT A TIME</span>
                        <span className='product-demo__footer-bars'><i /><i /><i /><i /><i /></span>
                    </div>
                </div>
                <div className='floating-note floating-note--top'>
                    <span className='floating-note__icon' aria-hidden='true'>✦</span>
                    <span><strong>Built around you</strong><small>Your role. Your experience.</small></span>
                </div>
                <div className='floating-note floating-note--bottom'>
                    <span className='floating-note__check' aria-hidden='true'>✓</span>
                    <span><strong>Practice with purpose</strong><small>Feedback for your next answer</small></span>
                </div>
            </div>
            <span className='landing-hero__orb landing-hero__orb--one' aria-hidden='true' />
            <span className='landing-hero__orb landing-hero__orb--two' aria-hidden='true' />
        </section>

        <section className='landing-features' id='features'>
            <div className='landing-section-heading'>
                <p className='landing-eyebrow'><span /> PREPARATION, WITH A PLAN</p>
                <h2>Not just more practice.<br /><span>More useful practice.</span></h2>
                <p>Bring the details that make this interview yours. We’ll help you turn them into a clear next step.</p>
            </div>
            <div className='feature-grid'>
                {features.map(feature => (
                    <article className='feature-card' key={feature.number}>
                        <div className='feature-card__top'>
                            <span className='feature-card__icon'>{feature.icon}</span>
                            <span className='feature-card__number'>{feature.number}</span>
                        </div>
                        <h3>{feature.title}</h3>
                        <p>{feature.description}</p>
                        <span className='feature-card__rule' />
                    </article>
                ))}
            </div>
        </section>

        <section className='landing-how' id='how-it-works'>
            <div className='landing-how__intro'>
                <p className='landing-eyebrow'><span /> YOUR PREP, IN THREE STEPS</p>
                <h2>From “where do I start?”<br /><span>to “I’ve got this.”</span></h2>
                <p>A little structure makes the whole process feel more manageable.</p>
                <Link className='landing-text-link' to='/register'>Start preparing <span aria-hidden='true'>↗</span></Link>
            </div>
            <ol className='steps-list'>
                <li className='step-item'>
                    <span className='step-item__number'>01</span>
                    <div><h3>Bring the opportunity</h3><p>Share a job description and your resume, or tell us about your experience.</p></div>
                    <span className='step-item__symbol' aria-hidden='true'>↗</span>
                </li>
                <li className='step-item'>
                    <span className='step-item__number'>02</span>
                    <div><h3>Get a focused plan</h3><p>Explore interview questions and guidance shaped around the role you’re pursuing.</p></div>
                    <span className='step-item__symbol' aria-hidden='true'>✳</span>
                </li>
                <li className='step-item'>
                    <span className='step-item__number'>03</span>
                    <div><h3>Practice. Learn. Repeat.</h3><p>Try a mock interview, get feedback, and leave knowing what to work on next.</p></div>
                    <span className='step-item__symbol' aria-hidden='true'>✓</span>
                </li>
            </ol>
        </section>

        <section className='landing-cta'>
            <div className='landing-cta__glow' aria-hidden='true' />
            <p className='landing-eyebrow'><span /> YOUR NEXT CHAPTER IS CLOSER</p>
            <h2>Feel ready for the<br /><span>conversation ahead.</span></h2>
            <p>Start with the role. We’ll help you figure out the rest.</p>
            <Link className='landing-button landing-button--light' to='/register'>
                Create your free account <span aria-hidden='true'>↗</span>
            </Link>
        </section>

        <footer className='landing-footer'>
            <Link className='landing-brand' to='/' aria-label='Prepwise home'>
                <span className='landing-brand__mark' aria-hidden='true'><span /><span /><span /></span>
                <span>prep<span className='landing-brand__accent'>wise</span></span>
            </Link>
            <p>A little more ready, every day.</p>
            <span className='landing-footer__copyright'>© {new Date().getFullYear()} Prepwise</span>
        </footer>
    </main>
)

export default Landing
