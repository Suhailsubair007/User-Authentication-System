import React, { useState } from 'react'
import axiosInstance from '../../config/axiosConfig'
import { useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { setUserInfo, userLogout } from '../../redux/Slice'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await axiosInstance.post('/users/login', {
        email,
        password
      })

      if (response.data) {
        console.log(response.data)
        const {_id,name,email} = response.data;
        dispatch(setUserInfo({user: {_id,name,email}}))
        dispatch(setUserInfo(response.data))

        navigate('/home')
      } else {
        setError(response.data.message || 'Login failed. Try again!')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className='flex min-h-screen h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white'>
          Sign in to your account
        </h2>
      </div>

      <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm'>
        <form className='space-y-6' onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium leading-6 text-gray-300'
            >
              Email address
            </label>
            <div className='mt-2'>
              <input
                id='email'
                name='email'
                type='email'
                required
                autoComplete='email'
                value={email}
                onChange={e => setEmail(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200'
              />
            </div>
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium leading-6 text-gray-300'
            >
              Password
            </label>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                required
                autoComplete='current-password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200'
              />
            </div>
          </div>

          {error && <p className='text-red-500'>{error}</p>}

          <div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </div>
        </form>

        <p className='mt-10 text-center text-sm text-gray-400'>
          Not a member?{' '}
          <Link
            to='/register'
            className='font-semibold leading-6 text-indigo-500 hover:text-indigo-400'
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login
