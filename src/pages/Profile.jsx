import React from 'react'
import { useSelector } from 'react-redux'

export default function Profile() {
  const {currentUser} = useSelector((state) => state.user)
  return (
    <div className='p-5 mx-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col'>
        <img src={currentUser.avatar} alt="profile photo"
        className='w-24 h-24 rounded-full object-cover self-center mt-2 cursor-pointer' />
        <input type="text" placeholder='username' className='border p-3 rounded-lg mt-4' id='username'/>
        <input type="text" placeholder='email' className='border p-3 rounded-lg mt-4' id='email'/>
        <input type="text" placeholder='password' className='border p-3 rounded-lg mt-4' id='password'/>
        <button className='bg-violet-500 text-white p-3 rounded-lg mt-4 uppercase hover:opacity-85 disabled:opacity-65'>Update</button>

      </form>
      <div className='flex justify-between mt-5'>
        <span className='text-red-500 cursor-pointer'>Delete Account</span>
        <span className='text-red-500 cursor-pointer'>Sign Out</span>
      </div>
    </div>
  )
}
