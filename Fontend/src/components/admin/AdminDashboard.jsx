import React, { useState, useEffect } from 'react'
import axiosInstance from '../../config/axiosConfig'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { adminLogout } from '../../redux/AdminSlice'
import { userLogout} from '../../redux/Slice'

function AdminDashboard () {
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [filteredUsers, setFilteredUsers] = useState([])
  // console.log(users)

  // Fetch users from the API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('/admin/getusers')
        console.log(response.data.users)
        setUsers(response.data.users) // Set the users fetched from API
        setFilteredUsers(response.data.users) // Initialize filteredUsers with all users
      } catch (error) {
        console.error('Error fetching users:', error)
      }
    }

    fetchUsers()
  }, [])

  // Handle search input change
  const handleSearchChange = e => {
    const term = e.target.value.toLowerCase()
    setSearchTerm(term)

    if (term === '') {
      setFilteredUsers(users)
    } else {
      setFilteredUsers(
        users.filter(
          user =>
            user.name.toLowerCase().includes(term) ||
            user.email.toLowerCase().includes(term)
        )
      )
    }
  }

  // Handle Create User
  const handleCreateUserClick = () => {
    navigate('/Admin/add')
  }

  // Handle Logout
  const handleLogoutClick = async () => {
    await axiosInstance.post('/admin/logout')
    dispatch(adminLogout())
    console.log('Logged out')
    navigate('/adminLogin')
  }

  // Handle Edit
  const handleEditClick = userId => {
    navigate(`/Admin/edit/${userId}`)
  }

  // Handle Delete
  const handleDeleteClick = async userId => {
    try {
      await axiosInstance.delete(`/admin/users/${userId}`)
      setUsers(users.filter(user => user._id !== userId)) // Remove user from state
      setFilteredUsers(filteredUsers.filter(user => user._id !== userId)) // Update filtered users
      dispatch(userLogout());
    } catch (error) {
      console.error('Error deleting user:', error)
    }
  }

  return (
    <div className='min-h-screen bg-gray-900 text-white'>
      {/* Navbar */}
      <nav className='bg-gray-800 p-4 flex justify-between items-center shadow-md'>
        <h1 className='text-white text-2xl font-bold'>ADMIN DASHBOARD</h1>
        <div className='flex-grow flex justify-center'>
          <input
            type='text'
            placeholder='Search user...'
            value={searchTerm}
            onChange={handleSearchChange}
            className='px-3 py-2 w-64 text-sm text-gray-900 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-gray-700 text-white placeholder-gray-400'
          />
        </div>
        <div className='flex items-center space-x-4'>
          <button
            onClick={handleCreateUserClick}
            className='bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-md'
          >
            Create New User
          </button>
          <button
            onClick={handleLogoutClick}
            className='bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-4 rounded-md'
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Table */}
      <div className='overflow-x-auto shadow-md sm:rounded-lg mt-8 mx-4'>
        <table className='w-full text-sm text-left text-gray-400'>
          <thead className='text-xs uppercase bg-gray-700 text-gray-400'>
            <tr>
              <th scope='col' className='px-6 py-3'>
                Name
              </th>
              <th scope='col' className='px-6 py-3'>
                Email
              </th>
              <th scope='col' className='px-6 py-3'>
                Role
              </th>
              <th scope='col' className='px-6 py-3'>
                Edit
              </th>
              <th scope='col' className='px-6 py-3'>
                Delete
              </th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredUsers) && filteredUsers.length > 0 ? (
              filteredUsers.map(user => (
                <tr
                  key={user.id}
                  className='border-b border-gray-700 bg-gray-800'
                >
                  <th
                    scope='row'
                    className='px-6 py-4 font-medium text-white whitespace-nowrap'
                  >
                    {user.name}
                  </th>
                  <td className='px-6 py-4'>{user.email}</td>
                  <td className='px-6 py-4'>{user.role}</td>
                  <td className='px-6 py-4'>
                    <button
                      className='font-medium text-indigo-500 hover:underline'
                      onClick={() => handleEditClick(user._id)} // Correct function for editing
                    >
                      Edit
                    </button>
                  </td>

                  <td className='px-6 py-4'>
                    <a
                      href='#'
                      className='font-medium text-red-500 hover:underline'
                      onClick={() => handleDeleteClick(user._id)} // Correct function for deleting
                    >
                      Delete
                    </a>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='5' className='text-center text-gray-400 py-4'>
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminDashboard
