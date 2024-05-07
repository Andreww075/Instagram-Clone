'use client'

import React, { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { 
  addDoc, 
  getFirestore, 
  serverTimestamp, 
  collection, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';
import { app } from '@/firebase';
import Moment from 'react-moment';

export default function CommentSection({ id }) {
  const { data: session } = useSession();

  const [comment, setComment] = useState('');
  const [comments, setComments] = useState([]);

  const db = getFirestore(app);

  const handleSubmit = async e => {
    e.preventDefault();
    // Add comment to firestore
    const commentToPost = comment;
    setComment('');
    await addDoc(collection(db, 'posts', id, 'comments'), {
      comment: commentToPost,
      username: session?.user?.username,
      userImage: session?.user?.image,
      timestamp: serverTimestamp(),
    });
  }

  useEffect(() => {
    onSnapshot(
      query(
        collection(db, 'posts', id, 'comments'),
        orderBy('timestamp', 'desc')
      ),
      (snapshot) => {
        setComments(snapshot.docs);
      }
    );
  }, [db]);

  return (
    <div>
      {
        comments.length > 0 && (
          <div 
            className="mx-10 overflow-y-scroll max-h-24"
          >
            {
              comments.map((comment, id) => (
                <div 
                  key={id}
                  className="flex my-2 items-center space-x-2 justify-between items-center"
                >
                  <img 
                    src={comment.data().userImage} 
                    alt='userImage' 
                    className='h-7 rounded-full object-cover'
                  />

                  <p 
                    className='text-sm flex-1 truncate'
                  >
                    <span
                      className='font-bold text-gray-700'
                    >{comment.data().username}</span>
                    {comment.data().comment}
                  </p>

                  <Moment
                    fromNow
                    className='text-x5 text-gray-400 pr-1'
                  >
                    {comment.data().timestamp?.toDate()}
                  </Moment>
                </div>
              ))
            }
          </div>
        )
      }

      {
        session && (
          <form
            onSubmit={handleSubmit}
            className='flex items-center p-4 gap-2'>
            <img
              src={session.user.image}
              alt='userimage'
              className='h-10 w-10 rounded-full border p-[4px] object-cover'
            />
            <input
              type='text'
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder='Add a comment...'
              className='border-none flex-1 focus:ring-0 outline-none'
            />
            <button
              disabled={!comment.trim()}
              type='submit'
              className=' text-blue-400 disabled:cursor-not-allowed disabled:text-gray-400'
            >
              Post
            </button>
          </form>
        )
      }
    </div>
  )
}
