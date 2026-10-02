import { Link } from 'react-router'
import './prepwise-brand.scss'

const PrepwiseBrand = ({ className = '' }) => (
    <Link className={`prepwise-brand ${className}`.trim()} to='/' aria-label='Prepwise home'>
        <span className='prepwise-brand__mark' aria-hidden='true'>
            <span />
            <span />
            <span />
        </span>
        <span>prep<span className='prepwise-brand__accent'>wise</span></span>
    </Link>
)

export default PrepwiseBrand
