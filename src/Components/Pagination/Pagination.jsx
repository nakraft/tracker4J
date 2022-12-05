// support of pagination found here: https://levelup.gitconnected.com/a-simple-guide-to-pagination-in-react-facd6f785bd0

import React from 'react'

const Pagination = ({ nPages, currentPage, makeCurrentPage}) => {

    const pageNumbers = [...Array(nPages + 1).keys()].slice(1)

    const setPage = (values) => {
        makeCurrentPage(values)
	};

    return (
        <nav>
            <ul className='pagination justify-content-center'>
                {pageNumbers.map(pgNumber => (
                    <li key={pgNumber} 
                        className= {`page-item ${currentPage == pgNumber ? 'active' : ''} `} >

                        <a onClick={() => setPage(pgNumber)}  
                            className='page-link' 
                            href='#'>
                            
                            {pgNumber}
                        </a>
                    </li>
                ))}
            </ul>
        </nav>
    )
}

export default Pagination