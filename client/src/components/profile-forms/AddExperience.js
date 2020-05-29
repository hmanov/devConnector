import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addExperience } from '../../reducers/profileActions';

const AddExperience = ({ addExperience, history }) => {
  const [data, setData] = useState({
    company: '',
    title: '',
    location: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });
  const { company, title, location, from, to, current, description } = data;

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    addExperience(data, history);
  };
  return (
    <>
      <h1 className='large text-primary'>Add An Experience</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any developer/programming positions that you have
        had in the past
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Job Title'
            value={title}
            onChange={onChange}
            name='title'
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Company'
            value={company}
            onChange={onChange}
            name='company'
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='Location'
            value={location}
            onChange={onChange}
            name='location'
          />
        </div>
        <div className='form-group'>
          <h4>From Date</h4>
          <input type='date' value={from} onChange={onChange} name='from' />
        </div>
        <div className='form-group'>
          <p>
            <input
              type='checkbox'
              value={current}
              onChange={(e) => {
                setData({ ...data, current: !current });
              }}
              name='current'
            />{' '}
            Current Job
          </p>
        </div>
        <div className='form-group'>
          <h4>To Date</h4>
          <input type='date' value={to} onChange={onChange} name='to' disabled={current} />
        </div>
        <div className='form-group'>
          <textarea
            name='description'
            value={description}
            onChange={onChange}
            cols='30'
            rows='5'
            placeholder='Job Description'
          ></textarea>
        </div>
        <input type='submit' className='btn btn-primary my-1' />
        <Link className='btn btn-light my-1' to='/dashboard'>
          Go Back
        </Link>
      </form>
    </>
  );
};

AddExperience.propTypes = {
  addExperience: PropTypes.func.isRequired,
};

export default connect(null, { addExperience })(AddExperience);
