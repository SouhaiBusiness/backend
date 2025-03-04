import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Loading from '@/components/Loading';
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import Blog from "@/components/Blog"

export default function Addblog() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // check if there is no active session and redirect to login page
    if (!session) {
      router.push('/login');
    }
  }, [session, router]);

  if (status === 'loading') {
    // loading state, loader or any other indicator
    return (
      <div className='loadingdata flex flex-col flex-center wh_100'>
        <Loading />
        <h1> loading...</h1>
      </div>
    );
  }

  if (session) {
    return (
      <>
        <div className='addblogspage'>
          <div className='titledashboard flex flex-sb'>
            <div data-aos="fade-right">
              <h2>
                {' '}
                Add <span>Blog</span>
              </h2>
              <h3>Admin Panel</h3>
            </div>
            <div className='breadcrumb' data-aos="fade-left">
              <MdOutlineAddPhotoAlternate /> <span>/</span> <span>Add Blog</span>
            </div>
          </div>

          <div className="blogsadd">
             <Blog />
          </div>
        </div>
      </>
    );
  }
}
