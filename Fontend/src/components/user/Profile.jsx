import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import axiosInstance from '../../config/axiosConfig';
import Toast from '../Toast';

function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    profileImage: null,
    profileImgUrl: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        const userDetails = response.data;

        setFormData(prev => ({
          ...prev,
          id: userDetails._id || '',
          name: userDetails.name || '',
          email: userDetails.email || '',
          profileImgUrl: null
        }));
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value
    }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axiosInstance.put(
        '/users/update_profile',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' }
        }
      );

      alert('Profile updated successfully!');
      navigate('/home');
    } catch (error) {
      setIsSubmitting(false);
      if (error?.response?.status === 400) {
        setError(error.response.data.message);
        toast.error(error.response.data.message);
      } else {
        console.error(error);
      }
    }
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className='min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 flex items-center justify-center py-10'>
      <Toast />
      <div className='bg-gray-900 p-8 rounded-lg shadow-2xl w-full max-w-lg text-white'>
        <button
          onClick={handleBack}
          className='text-gray-300 hover:text-gray-100 focus:outline-none mb-4'
          aria-label='Go back'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth='2'
            stroke='currentColor'
            className='w-6 h-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M15 19l-7-7 7-7'
            />
          </svg>
        </button>

        <form onSubmit={handleSubmit} className='space-y-6'>
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
              required
            />
          </div>

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
              required
            />
          </div>

          <div>
            <label className='block text-lg font-semibold mb-1'>
              Update Profile Picture
            </label>
            <input
              type='file'
              id='profileImage'
              accept='image/*'
              name='image'
              className='w-full p-3 rounded-lg bg-gray-800 text-gray-200 border border-gray-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500'
              onChange={handleChange}
            />
          </div>

          <div className='mt-8 text-center'>
            <button
              type='submit'
              className='w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 px-6 rounded-lg font-semibold shadow-lg transition duration-300'
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Update Profile'}
            </button>
          </div>

          {error && <p className='text-red-500 text-center'>{error}</p>}
        </form>

        {/* Custom ToastContainer for displaying notifications */}
        
      </div>
    </div>
  );
}

export default Profile;
