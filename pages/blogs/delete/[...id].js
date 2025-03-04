import { BsPostcard } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';
import axios from 'axios';
import Head from 'next/head';


export default function DeleteBlog() {
  // login first
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status !== 'loading') {
      router.push('/login');
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className='loadingdata flex flex-col flex-center wh_100'>
        <Loading />
        <h1>loading...</h1>
      </div>
    );
  }

  // blog edit 

  const { id } = router.query;

  const [ productInfo, setProductInfo] = useState(null);

  useEffect(() => {
      if (!id) {
         return;
      } else {
        axios.get('/api/blogapi?id=' + id).then(response => {
            setProductInfo(response.data)
        })
      }
  }, [id])

  

  // deleting blog function
  async function deleteOneBlog(){
    await axios.delete('/api/blogapi?id=' + id);
    goback()
  }
  
  //cancel deleting blog function and goback to home 
  function goback(){
      router.push('/')
  }


  if (session) {
    return (
      <>
        <Head>
          <title>Delete Blog</title>
        </Head>

        <div className='blogpage'>
          <div className='titledashboard flex flex-sb'>
            <div>
              <h2>
                Delete <span>{productInfo?.title}</span>
              </h2>
              <h3>Admin Panel</h3>
            </div>
            <div className='breadcrumb'>
              <BsPostcard /> <span>/</span> <span>Delete Blog</span>
            </div>
          </div>

          <div className='deletesec flex flex-center wh-100'>
              <div className='deletecard'>
                 <svg 
                     viewBox="0 0 24 24"
                     fill="red"
                     height="6rem"
                     width="6rem"
                 >
                   <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />  
                 </svg>

                 <p className='cookieHeading'>Are you sure you want to delete this blog</p>
                 <p className='cookieDescription'>if you delete this blog content, it will be permanently removed</p>
                 
                 <div className='buttonContainer'>
                     <button className='acceptButton' onClick={deleteOneBlog}>Delete</button>
                     <button className='declineButton' onClick={goback}>Cancel</button>
                 </div>
              </div>
          </div>
        </div>
      </>
    );
  }
}
