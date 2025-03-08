import '@/styles/globals.css';
import Header from '@/components/Header';
import Aside from '@/components/Aside';
import { SessionProvider } from 'next-auth/react';
import { useState } from 'react';
import Loading from '@/components/Loading';
import Aos from '@/components/Aos';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}) {
  const [loading, setLoading] = useState(false);

  const [sidebarOpen, setSidebarOpen] = useState(true)

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }


  return (
    <>
      <SessionProvider session={session}>
        {loading ? (
          <div className='flex flex-col flex-center wh-100'>
            <Loading />
            <h1>Loading...</h1>
          </div>
        ) : (
          <>
            <Header toggleSidebar={toggleSidebar} />
            <Aside isOpen={sidebarOpen} />
            <main>
              <Aos>
                <Component {...pageProps} />
              </Aos>
            </main>
          </>
        )}
      </SessionProvider>
    </>
  );
}
