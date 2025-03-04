import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Loading from '@/components/Loading';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdOutlineAccountCircle } from 'react-icons/md';

export default function Setting() {
  const { data: session, status } = useSession();

  const router = useRouter();
  // check if there is no active session and redirect to login page
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

  async function logout() {
    await signOut();
    await router.push('/login');
  }

  if (session) {
    return (
      <>
        <div className='settingpage'>
          {/* title dashboard / Settings */}
          <div className='titledashboard flex flex-sb'>
            <div data-aos="fade-right">
              <h2>
                {' '}
                Admin <span>Settings</span>
              </h2>
              <h3>Admin Panel</h3>
            </div>
            <div className='breadcrumb' data-aos="fade-left">
              <IoSettingsOutline /> <span>/</span> <span>Settings</span>
            </div>
          </div>

          <div clssName='profilesettings'>
            <div className='leftprofile_details flex' data-aos="fade-up">
                <img src='/img/home.png' alt='blogger' />
                <div className='w-100'>
                  <div className='flex flex-sb flex-left mt-2'>
                    <h2>MyProfile:</h2>
                    <h3>Blogger <br/> Web Developer</h3>
                  </div>
                  <div className='flex flex-sb mt-2'>
                    <h3>Phone:</h3>
                     <input type='text' defaultValue="+212 6 26 25 30 33"/>
                  </div>
                  <div className='mt-2'>
                     <input type='email' defaultValue="souhail@gmail.com"/>
                  </div>
                  <div className='flex flex-center w-100 mt-2'>
                     <button>Save</button>
                  </div>
                </div>
            </div>
            
            <div className='rightlogoutsec' data-aos="fade-up">
               <div className='topaccoutnbox'>
                 <h2 className='flex flex-sb'>My Account <MdOutlineAccountCircle /></h2>
               <hr />
               <div className='flex flex-sb mt-1'>
                   <h3>Active Account <br/> <span>Email</span></h3>
                   <button onClick={logout}>Logout</button>
               </div>
               </div>
            </div>
          </div>
        </div>
      </>
    );
  }
}
