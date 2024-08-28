import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft  } from '@fortawesome/free-solid-svg-icons';

function Back() {

  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} className='breadcrumbs'>
        <FontAwesomeIcon icon={faChevronLeft} />
        back
    </button>
  );
}

export default Back;
