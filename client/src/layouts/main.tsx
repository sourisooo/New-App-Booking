import React from 'react';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';
import HomePage from '../Homepage/HomePage';

const Main: React.FC = () => {
  return (
    <>
      <Header />
      <HomePage />
      <Footer />
    </>
  );
};

export default Main;
