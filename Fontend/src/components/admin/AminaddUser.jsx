import React from 'react'
import { useState } from 'react'
import axios from 'axios'
import { useNavigate, Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function AdminAddUser() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [profilePicture, setProfilePicture] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

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
            'Content-Type': 'multipart/form-data',
          },
        }
      )

      if (response.data.success) {
        toast.success('User successfully added!')
        navigate('/admin/dashboard')
      } else {
        setError(response.data.message || 'Signup failed. Try again!')
      }
    } catch (err) {
      console.error('Error during signup:', err)
      setError(
        err.response?.data?.message || 'An error occurred during signup.'
      )
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">
          Add New User
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Full Name Input */}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              autoComplete="name"
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter full name"
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter email"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter password"
            />
          </div>

          {/* Profile Picture Upload */}
          <div className="mb-4">
            <label
              htmlFor="profilePicture"
              className="block text-sm font-medium text-gray-300"
            >
              Profile Picture
            </label>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1 block w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer focus:outline-none"
            />
          </div>

          {error && <p className="text-red-500">{error}</p>}

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add User
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification Container */}
      <ToastContainer />
    </div>
  )
}

export default AdminAddUser
