import React,{ Suspense } from 'react';
import Notes from '@/shared/Notes';

const page = () => {
  return (
  <Suspense fallback={<div>Loading...</div>}>
   <Notes />;
  </Suspense>
  );

};

export default page;
