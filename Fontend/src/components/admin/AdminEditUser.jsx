import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axiosInstance from '../../config/axiosConfig'

function AdminEditUser () {
  const navigate = useNavigate()
  const { userId } = useParams()
  console.log(userId)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: null,
    profileImgUrl: ''
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/admin/${userId}`)
        const userDetails = response.data
        console.log(userDetails)

        setFormData(prev => ({
          ...prev,
          id: userDetails.user._id || '',
          name: userDetails.user.name || '',
          email: userDetails.user.email || '',
          profileImgUrl: null
        }))
      } catch (error) {
        console.error('Failed to fetch user details:', error)
      }
    }

    fetchUserDetails()
  }, [userId])

  const handleChange = e => {
    const { name, value, files } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await axiosInstance.put(
        '/admin/updateUsers',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      )

      alert('Profile updated successfully!')
      navigate('/admin/dashboard')
    } catch (error) {
      setIsSubmitting(false)
      if (error?.response?.status === 400) {
        setError(error.response.data.message)
        toast.error(error.response.data.message)
      } else {
        console.error(error)
      }
    }
  }

  // const handleBack = () => {
  //   navigate(-1)
  // }

  return (
    <div className='min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center py-10'>
      <div className='bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-lg text-white'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Edit User</h2>

        {/* User Details Form */}
        <form className='space-y-6 '
        onSubmit={handleSubmit}>
          {/* Full Name */}
          <div>
            <label htmlFor='name' className='block text-lg font-semibold mb-1'>
              Full Name
            </label>
            <input
              type='text'
              id='name'
              name='name'
              value={formData.name}
              onChange={handleChange}
              className='w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Enter full name'
            />
          </div>

          {/* Email */}
          <div>
            <label htmlFor='email' className='block text-lg font-semibold mb-1'>
              Email
            </label>
            <input
              type='email'
              id='email'
              name='email'
              value={formData.email}
              onChange={handleChange}
              className='w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500'
              placeholder='Enter email'
            />
          </div>

          {/* Profile Image Update Button */}
          <div>
            <label className='block text-lg font-semibold mb-1'>
              Update Profile Picture
            </label>
            <input
              type='file'
              id='profile-pic-upload'
              accept='image/*'
              name='image'
              onChange={handleChange}
              className='w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />
          </div>

          {/* Update Button */}
          <div className='mt-8 text-center'>
            <button
              type='submit'
              className='w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-300'
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>
          {error && <p className='text-red-500 text-center'>{error}</p>}
        </form>
      </div>
    </div>
  )
}

export default AdminEditUser
