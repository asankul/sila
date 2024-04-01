"use client"
import { useEffect } from 'react';

const RedirectPage = () => {
  useEffect(() => {
    const redirectTimer = setTimeout(() => {
      // Redirect to a different URL after 3 seconds
      window.location.href = '/login'; // Replace '/new-url' with the URL you want to redirect to
    }, 0); // 3000 milliseconds = 3 seconds

    return () => clearTimeout(redirectTimer); // Clear the timer on unmount
  }, []);

  return (
    <div>
      <img src="/logo.png" alt="Logo" class="logo"/>
    </div>
  );
};

export default RedirectPage;
