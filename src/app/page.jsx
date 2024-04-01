"use client"
import { useEffect } from 'react';

const RedirectPage = () => {
  if (typeof window !== 'undefined') {
    // Code that relies on window object
    // For example:
    window.location.href = '/login';
  }
};

export default RedirectPage;
