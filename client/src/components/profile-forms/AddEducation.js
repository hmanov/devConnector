import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addEducation } from '../../reducers/profileActions';

const AddEducation = ({ addEducation, history }) => {
  const [data, setData] = useState({
    school: '',
    degree: '',
    fieldofstudy: '',
    from: '',
    to: '',
    current: false,
    description: '',
  });
  const { school, degree, fieldofstudy, from, to, current, description } = data;

  const onChange = (e) => setData({ ...data, [e.target.name]: e.target.value });
  const onSubmit = (e) => {
    e.preventDefault();
    addEducation(data, history);
  };
  return (
    <>
      <h1 className='large text-primary'>Add Your Education</h1>
      <p className='lead'>
        <i className='fas fa-code-branch'></i> Add any school or bootcamp that you have attended
      </p>
      <small>* = required field</small>
      <form className='form' onSubmit={onSubmit}>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* School or Bootcamp'
            value={school}
            onChange={onChange}
            name='school'
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Degree or Certificate'
            value={degree}
            onChange={onChange}
            name='degree'
            required
          />
        </div>
        <div className='form-group'>
          <input
            type='text'
            placeholder='* Field of Study '
            value={fieldofstudy}
            onChange={onChange}
            name='fieldofstudy'
            required
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
            Current Education
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
            placeholder='Program Description'
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

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
};

export default connect(null, { addEducation })(AddEducation);
