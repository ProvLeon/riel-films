"use client"; // Ensure this component is client-side only

import React, { forwardRef } from 'react';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import LoadingSpinner from '@/components/UI/LoadingSpinner';

// Type the props expected by ReactQuill
import { ReactQuillProps } from 'react-quill'; // Import props type

// Keep dynamic import within the client component
const ReactQuill = dynamic(() => import('react-quill').then(mod => mod.default), {
  ssr: false,
  loading: () => <div className="h-[350px] flex items-center justify-center bg-gray-100 dark:bg-film-black-800 rounded-b-lg"><LoadingSpinner /></div>
});

// Define props for the wrapper, including ReactQuill props
interface QuillEditorWrapperProps extends ReactQuillProps {
  // Add any custom props if needed
}

// Use forwardRef to potentially help with ref handling if Quill needs it internally
const QuillEditorWrapper = forwardRef<any, QuillEditorWrapperProps>((props, ref) => {
  // Only render Quill if it's loaded (it should be because of dynamic import)
  if (!ReactQuill) {
    // This shouldn't typically be reached if dynamic import is set up correctly
    return <div className="h-[350px] flex items-center justify-center">Initializing Editor...</div>;
  }

  return <ReactQuill ref={ref} {...props} />;
});

QuillEditorWrapper.displayName = 'QuillEditorWrapper'; // Good practice for dev tools

export default QuillEditorWrapper;
