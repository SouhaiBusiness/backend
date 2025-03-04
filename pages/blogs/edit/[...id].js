import { BsPostcard } from 'react-icons/bs';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Loading from '@/components/Loading';
import Blog from '@/components/Blog';
import axios from 'axios';
import Head from 'next/head';


export default function EditBlog() {
  // login first
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session && status !== 'loading') {
      router.push('/login');
    }
  }, [session, router]);

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

  if (session) {
    return (
      <>
        <Head>
          <title>Update Blog</title>
        </Head>

        <div className='blogpage'>
          <div className='titledashboard flex flex-sb'>
            <div>
              <h2>
                Edit <span>{productInfo?.title}</span>
              </h2>
              <h3>Admin Panel</h3>
            </div>
            <div className='breadcrumb'>
              <BsPostcard /> <span>/</span> <span>Edit Blog</span>
            </div>
          </div>

          <div className='mt-3'>
             {
                productInfo && (
                    <Blog {...productInfo}/>
                )
             }
          </div>
        </div>
      </>
    );
  }
}
