'use client'

import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { useSession, signIn, signOut } from 'next-auth/react'
import { useState } from 'react'
import { IoIosAddCircle } from 'react-icons/io'
import { HiCamera } from 'react-icons/hi'
import { AiOutlineClose } from 'react-icons/ai'
import Modal from 'react-modal'
import { app } from '@/firebase'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);

  const filePickerRef = useRef(null)
  const { data: session } = useSession();

  const addImageToPost = e => {
    const file = e.target.files[0];

    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file))
      console.log(imageFileUrl)
    }
  }

  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile])

  const uploadImageToStorage = async () => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + '-' + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log(`Upload is ${progress}% done`)
      },
      (error) => {
        console.error(error);
        setImageFileUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then(downloadUrl => {
            setImageFileUrl(downloadUrl);
            setImageFileUploading(false);
          });
      }
    );
  }

  return (
    <header
      className='shadow-sm border-b sticky top-0 bg-white z-30 p-3'
    >
      <div
        className='flex justify-between items-center max-w-6xl mx-auto'
      >

        {/* Logo */}

        <Link href='/' className='hidden lg:inline-flex' >
          <Image
            src='/Instagram_logo_black.webp'
            width={96}
            height={96}
            alt='Instagram-logo'
          />
        </Link>

        <Link href='/' className='lg:hidden' >
          <Image
            src='/800px-Instagram_logo_2016.webp'
            width={40}
            height={40}
            alt='Instagram-logo'
          />
        </Link>

        {/* Search Input */}

        <input
          type="text"
          placeholder='Search'
          className='bg-gray-50 border border-gray-200 rounded text-sm w-full py-2 px-4 max-w-[210px]'
        />

        {/* Menu Items */}

        {
          session ? (
            <div className="flex gap-2 items-center">
              <IoIosAddCircle
                className="text-2xl cursor-pointer transform hover:scale-125 transition duration-300 hover:text-red-600"
                onClick={() => setIsOpen(true)}
              />
              <img
                src={session.user.image}
                alt={session.user.name}
                className="w-10 h-10 rounded-full cursor-pointer"
                onClick={signOut}
              />
            </div>
          ) : (
            <button
              onClick={signIn}
              className='text-sm font-semibold text-blue-500'
            >Log in</button>
          )
        }
      </div>

      {
        isOpen && (
          <Modal
            isOpen={isOpen}
            className='max-w-lg w-[90%] p-6 absolute top-56 left-[50%] translate-x-[-50%] bg-white border-2 rounded-sm shadow-md'
            onRequestClose={() => setIsOpen(false)}
            ariaHideApp={false}
          >
            <div
              className='flex flex-col justify-center items-center h-[100%]'
            >
              {
                selectedFile ? (
                  <img
                    onClick={() => setSelectedFile(null)}
                    src={imageFileUrl}
                    alt='selected img'
                    className={`w-full max-h-[250px] object-over cursor-pointer ${imageFileUploading ? 'animate-pulse' : ''}`}
                  />
                ) : (
                  <HiCamera
                    onClick={() => filePickerRef.current.click()}
                    className='text-5xl text-gray-400 cursor-pointer'
                  />
                )
              }

              <input
                type="file"
                accept='image/*'
                onChange={addImageToPost}
                ref={filePickerRef}
                hidden
              />
            </div>

            <input
              type="text"
              maxLength='150'
              placeholder='Please, enter your caption...'
              className='m-4 border-none text-center w-full focus:ring-0 outline-none'
            />

            <button
              className='w-full bg-red-600 text-white p-2 shadow-md rounded-lg hover:brightness-105 disabled:bg-gray-200 disabled:cursor-not-allowed disabled:brightness-100'
            >Upload Post</button>

            <AiOutlineClose
              className='cursor-pointer absolute top-2 right-2 hover:text-red-600 transition duration-300'
              onClick={() => setIsOpen(false)}
            />
          </Modal>
        )
      }
    </header>
  )
}
