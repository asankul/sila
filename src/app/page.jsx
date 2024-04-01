"use client"
import { useEffect } from 'react';

const RedirectPage = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/login';
  }  
};

export default RedirectPage;
