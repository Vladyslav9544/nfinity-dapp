import React from 'react';
import Header from './header';
import Footer from './footer';

type Props = {};

const MainLayout = (props: Props) => {
  return (
    <div>
      <Header />
      <main> main </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
