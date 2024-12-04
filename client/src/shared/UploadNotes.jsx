import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import jsCookie from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCircleUser } from 'react-icons/fa6';
import { IoLogOut } from 'react-icons/io5';
import { MdHome, MdFileUpload, MdDelete, MdMenu } from 'react-icons/md';
import { ThreeDot } from 'react-loading-indicators';
import UploadPYQ from '@/components/UploadPYQ';

import Footer from '@/components/Footer';
import Upload from '@/components/Upload';
import UserProfile from '@/components/UserProfile';
import { BASE_URL } from '@/constants/data';

const UploadNotes = () => {
  const [showRequests, setShowRequests] = useState(false);
  const [isToggled, setIsToggled] = useState(false);
  const [showUpload, setShowUpload] = useState(true);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleAdminClick = () => {
    setShowRequests(true);
    setShowUpload(false);
    setMobileMenuOpen(false);
  };

  const handleUploadClick = () => {
    setShowUpload(true);
    setShowRequests(false);
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    fetchNotes();
  }, [isToggled]);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const token = jsCookie.get('token');
      const response = await axios.get(
        isToggled
          ? `${BASE_URL}api/v1/pyq/userfiles`
          : `${BASE_URL}api/v1/file/userfiles`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      toast.error('Failed to fetch notes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    jsCookie.remove('token');
    window.location.href = '/';
  };

  const handleDelete = async (noteId) => {
    try {
      const token = jsCookie.get('token');
      await axios.delete(
        isToggled
          ? `${BASE_URL}api/v1/pyq/delete/${noteId}`
          : `${BASE_URL}api/v1/file/delete/${noteId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Note deleted successfully');
      fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
      toast.error('Failed to delete note. Please try again.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-primary text-tertiary p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notebin</h1>
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <MdMenu size={24} />
        </button>
      </header>

      <div className="flex flex-1">
        {/* Sidebar */}
        <nav
          className={`
          ${mobileMenuOpen ? 'block' : 'hidden'} 
          md:block 
          bg-primary text-tertiary
          w-full md:w-20 
          fixed md:relative 
          inset-0 md:inset-auto 
          z-20 md:z-auto
          overflow-y-auto
        `}
        >
          <div className="flex flex-col items-center py-4 space-y-6 ">
            <div className="w-10 h-10 overflow-hidden rounded-full hidden md:block">
              <img
                src="https://static.vecteezy.com/system/resources/thumbnails/005/129/844/small_2x/profile-user-icon-isolated-on-white-background-eps10-free-vector.jpg"
                alt=""
                className="w-full h-full"
              />
            </div>
            <Link
              href="/"
              className="flex gap-1 p-2 hover:bg-secondary/30 rounded"
            >
              <MdHome size={25} /> <span className="block lg:hidden">HOME</span>
            </Link>
            <button
              onClick={handleUploadClick}
              className=" flex gap-1 p-2 hover:bg-secondary/30 rounded"
            >
              <MdFileUpload size={25} />{' '}
              <span className="block lg:hidden">UPLOAD</span>
            </button>
            <button
              onClick={handleAdminClick}
              className="flex gap-1 p-2 hover:bg-secondary/30 rounded"
            >
              <FaCircleUser size={24} />{' '}
              <span className="block lg:hidden">PROFILE</span>
            </button>
            <button
              onClick={handleLogout}
              className="flex gap-1 p-2 hover:bg-secondary/30 rounded"
            >
              <IoLogOut size={25} />{' '}
              <span className="block lg:hidden">LOGOUT</span>
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 p-4 md:flex">
          {/* Notes List */}
          <div className="w-full lg:w-1/3 xl:w-1/4 mb-4 lg:mb-0 lg:mr-4">
            <h2 className="text-xl sm:text-2xl text-primary font-semibold mb-4">
              {isToggled ? 'All PYQs' : 'All Notes'}
            </h2>
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="max-h-[60vh] sm:max-h-[70vh] overflow-y-auto p-2 sm:p-4">
                {loading ? (
                  <div className="flex justify-center items-center">
                    <ThreeDot
                      variant="pulsate"
                      color="#18181C"
                      size="small"
                      text=""
                      textColor=""
                    />
                  </div>
                ) : notes.length === 0 ? (
                  <p className="text-center">
                    {isToggled ? 'No pyq found.' : 'No notes found.'}
                  </p>
                ) : (
                  notes.map((note) => (
                    <div
                      key={note.id}
                      className="flex flex-col sm:flex-row  justify-between bg-primary text-tertiary px-2 py-1 md:py-2 rounded mb-2 md:items-start sm:items-center"
                    >
                      <span className="truncate w-full text-sm sm:w-auto sm:flex-1 mr-2 mb-0 md:mb-2 sm:mb-0">
                        {note.title}
                      </span>
                      <div className="flex items-center w-full sm:w-auto justify-between sm:justify-end">
                        <Link
                          href={note.fileUrl}
                          className="mr-2 hover:underline text-green-400"
                        >
                          <small>Download</small>
                        </Link>
                        <button
                          onClick={() => handleDelete(note._id)}
                          className="text-red-400 hover:underline"
                        >
                          <small>Delete</small>
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Upload or User Profile */}
          <div className="flex-1 bg-white rounded-lg shadow p-4">
            <div className="flex items-center gap-1 justify-end">
              <span className="text-sm">For PYQ</span>
              <button
                onClick={() => setIsToggled(!isToggled)}
                className={`w-9 h-5 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  isToggled ? 'bg-secondary' : 'bg-gray-300'
                }`}
              >
                <div
                  className={`h-3 w-3 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
                    isToggled ? 'translate-x-4' : ''
                  }`}
                ></div>
              </button>
            </div>
            {showRequests ? (
              <UserProfile />
            ) : showUpload ? (
              isToggled ? (
                <UploadPYQ />
              ) : (
                <Upload onUploadSuccess={fetchNotes} />
              )
            ) : null}
          </div>
        </main>
      </div>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default UploadNotes;
