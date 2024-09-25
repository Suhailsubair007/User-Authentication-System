import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { userLogout } from '../../redux/Slice';
import axiosInstance from '../../config/axiosConfig';

function Home() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state?.user?.userData);
  const { _id, name,  email } = user || {};
  const userId = _id;

  const [profileImage, setProfileImage] = useState('');
  const [newName, setNewName] = useState('');
  const [userData, setUserData] = useState({});
  const firstname = newName ? newName.split(' ')[0] : 'User';

  useEffect(() => {
    const fetchProfileImage = async () => {
      try {
        const response = await axiosInstance.get(`/users/${userId}`);
        console.log(response.data);
        setUserData(response.data);
        const OrginalName = response.data.name;
        setNewName(OrginalName);
        const OrginalImageUrl = response.data.profileImgUrl;
        console.log(response.data.profileImgUrl);
        setProfileImage(OrginalImageUrl);
      } catch (error) {
        console.error('Error fetching profile image:', error);
      }
    };

    fetchProfileImage();
  }, [userId]);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/users/logout');
      dispatch(userLogout());
      navigate('/login');
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  return (
    <div className='flex items-center justify-center min-h-screen bg-gradient-to-r from-gray-900 to-gray-700 py-10'>
      <div className='text-center'>
        <div className='mb-6'>
          <img
            className='w-64 h-64 rounded-full mx-auto object-cover'
            src={`http://localhost:5000${profileImage}`}
            alt='Profile'
          />
        </div>

        <h1 className='text-4xl font-bold text-white mb-2'>
          Welcome, {firstname}
        </h1>
        
        {/* Display the user's email under their name */}
        <p className='text-lg text-gray-400 mb-6'>{userData.email || email}</p>

        <div className='space-x-4'>
          <Link to={`/profile/${userId}`}>
            <button className='px-6 py-3 rounded-md bg-indigo-600 text-white text-lg font-semibold shadow-md hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600'>
              View profile
            </button>
          </Link>

          <button
            onClick={handleLogout}
            className='px-6 py-3 rounded-md bg-red-600 text-white text-lg font-semibold shadow-md hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600'
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
