import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setErrors] = useState({}) // Initialize error as an empty object
  const [userExist, setUserExists] = useState('')
  const navigate = useNavigate()

  const nameRegex = /^[A-Za-z\s'-]+$/
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[cC][oO][mM]$/
  const passwordRegex =
    /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/

  const validate = () => {
    const newError = {}
    if (!name.trim()) {
      newError.name = 'Name is required'
    } else if (!nameRegex.test(name)) {
      newError.name = 'Name should contain only alphabets'
    }

    if (!email.trim()) {
      newError.email = 'Email is required'
    } else if (!emailRegex.test(email.trim())) {
      newError.email = 'Email is not valid'
    }

    if (!password) {
      newError.password = 'Password is required'
    } else if (!passwordRegex.test(password)) {
      newError.password =
        'Password must be at least 8 characters long, include one digit, one special character, and one capital letter'
    }

    if (!profilePicture) {
      newError.profilePicture = 'Profile image is required'
    }

    setErrors(newError)

    return Object.keys(newError).length === 0
  }

  const handleFileChange = e => {
    setProfilePicture(e.target.files[0])
  }

  const handleSubmit = async e => {
    e.preventDefault() // Moved outside of the validate block
    if (validate()) {
      setIsSubmitting(true)
      setErrors({}) // Reset errors to an empty object

      try {
        const formData = new FormData()
        formData.append('name', name)
        formData.append('email', email)
        formData.append('password', password)
        if (profilePicture) {
          formData.append('profilePicture', profilePicture)
        }

        const apiBaseUrl = import.meta.env.VITE_BASE_URL
        const response = await axios.post(
          `${apiBaseUrl}/users/signup`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        )

        console.log(response.data)
        navigate('/login')
      } catch (error) {
        setErrors({}) // Reset errors to an empty object
        if (error.response && error.response.status === 400) {
          setUserExists(error.response.data.message) // Corrected to use error.response
        } else {
          setUserExists('An unexpected error occurred.') // Fallback error message
        }
      } finally {
        setIsSubmitting(false)
      }
    }
  }

  return (
    <div className='flex min-h-screen h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-gray-900'>
      <div className='sm:mx-auto sm:w-full sm:max-w-sm'>
        <img
          alt='Your Company'
          src='https://seeklogo.com/images/A/authenticator-app-logo-8A6943A509-seeklogo.com.png'
          className='mx-auto h-10 w-auto'
        />
        <h2 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white'>
          Create a new account
        </h2>
      </div>

      <div className='mt-9 sm:mx-auto sm:w-full sm:max-w-sm'>
        {userExist && (
          <div className='mt-1 text-base text-center text-red-600'>
            {userExist}
          </div>
        )}
        <form onSubmit={handleSubmit} className='space-y-6'>
          <div>
            <label
              htmlFor='name'
              className='block text-sm font-medium leading-5 text-gray-300'
            >
              Full Name
            </label>
            <div className='mt-2'>
              <input
                id='name'
                name='name'
                type='text'
                required
                autoComplete='name'
                value={name}
                onChange={e => setName(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200'
              />
            </div>
            {error.name && (
              <div className='mt-1 text-sm text-red-600'>{error.name}</div>
            )}
          </div>

          <div>
            <label
              htmlFor='email'
              className='block text-sm font-medium leading-5 text-gray-300'
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
            {error.email && (
              <div className='mt-1 text-sm text-red-600'>{error.email}</div>
            )}
          </div>

          <div>
            <label
              htmlFor='password'
              className='block text-sm font-medium leading-5 text-gray-300'
            >
              Password
            </label>
            <div className='mt-2'>
              <input
                id='password'
                name='password'
                type='password'
                required
                autoComplete='new-password'
                value={password}
                onChange={e => setPassword(e.target.value)}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200'
              />
            </div>
            {error.password && (
              <div className='mt-1 text-sm text-red-600'>{error.password}</div>
            )}
          </div>

          <div>
            <label
              htmlFor='profilePicture'
              className='block text-sm font-medium leading-5 text-gray-300'
            >
              Profile Picture
            </label>
            <div className='mt-2'>
              <input
                id='profilePicture'
                name='profilePicture'
                type='file'
                accept='image/*'
                onChange={handleFileChange}
                className='block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-500 dark:bg-gray-700 dark:text-gray-200'
              />
            </div>
            {error.profilePicture && (
              <div className='mt-1 text-sm text-red-600'>
                {error.profilePicture}
              </div>
            )}
          </div>

          {error.general && <p className='text-red-500'>{error.general}</p>}

          <div>
            <button
              type='submit'
              className='flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Signing up...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <p className='mt-10 text-center text-sm text-gray-400'>
          Already a member?{' '}
          <Link
            to='/login'
            className='font-semibold leading-6 text-indigo-500 hover:text-indigo-400'
          >
            Already have an account?
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
