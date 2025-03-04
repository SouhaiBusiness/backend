import { FaBarsStaggered } from 'react-icons/fa6';
import { GoScreenFull } from 'react-icons/go';
import { MdCloseFullscreen } from 'react-icons/md';
import { useState } from 'react';
import { useSession } from 'next-auth/react';

export default function Header() {

  const { data: session } = useSession();
  
  const [isFullScreen, setIsFullScreen] = useState(false);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullScreen(true);
      });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => {
          setIsFullScreen(false);
        });
      }
    }
  };
  return (
    <>
      <header className='header flex flex-sb'>
        <div className='logo flex gap-2'>
          <h1>Admin</h1>
          <div className='headerham flex justify-center'>
            <FaBarsStaggered />
          </div>
        </div>
        <div className='rightnav flex gap-2'>
          <div onClick={toggleFullScreen}>
            { isFullScreen ? <GoScreenFull /> : <MdCloseFullscreen /> }
          </div>
          <div className='notification'>
            <img src='/img/notification.png' alt='notification' />
          </div>
          <div className='profilenav'>
            {session ? <img src={session.user.image} alt='user' /> : <img src='/img/user.png' alt='user' />}
            
          </div>
        </div>
      </header>
    </>
  );
}
