import { Paper } from '@mui/material';
import React from 'react';
import Container from '../../components/common/Container';
import { SearchRoomsForm } from '../../components/ui/forms';

const HomePage: React.FC = () => {
  return (
    <main className='main-home__page'>
      <Container>
        <div className='main-home__wrapper'>
          <h1 className='visually-hidden'>TEST</h1>
          <Paper elevation={3} className='form-card searchRooms-form'>
            <h2>Votre prochaine expérience vous attends</h2>
            <SearchRoomsForm />
          </Paper>
          <p className='main__text-wishes'>Prenez un bol d'air</p>
        </div>
      </Container>
    </main>
  );
};

export default HomePage;
