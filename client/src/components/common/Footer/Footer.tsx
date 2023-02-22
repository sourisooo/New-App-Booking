import { Link } from '@mui/material';
import { GitHub } from '@mui/icons-material';
import React from 'react';
import Container from '../Container';
import Divider from '../Divider';
import { InputField } from '../Fields';
import withSubscribe from '../Fields/HOC/withSubscribe';
import Logo from '../Logo';

const Footer = () => {
  const SubscribeInput = withSubscribe(InputField);

  return (
    <footer className='footer'>
      <Container>
        <div className='footer-wrapper'>
          <div className='footer-item footer-item--logo'>
            <div className='footer-logo'>
              <Logo />
              <p className='footer-logo__text'>
                Бронирование номеров в лучшем отеле 2021 года по версии ассоциации «Отельные взгляды»
              </p>
            </div>
          </div>

          <div className='footer-item footer-item--newsletter'>
            <form className='footer-newsletter'>
              <p className='footer-newsletter__title'>Подписка</p>
              <p className='footer-newsletter__title'>Получайте специальные предложения и новости сервиса</p>
              <div className='footer-newsletter__input'>
                <SubscribeInput size='small' placeholder='Email' name='email' type='email' />
              </div>
            </form>
          </div>
        </div>
      </Container>
      <Divider variant='fullWidth' className='footer-divider' />
      <Container>
        <div className='footer-bottom'>
          <p className='footer-copyright'>Copyright © 2021 Sourisooo отель. Все права защищены.</p>
          <Link underline='none' href='https://google.fr' rel='noopener noreferrer' target='_blank'>
            <div className='footer-social'>
              <GitHub />
              <span className='footer-social__link'>Sourisooo</span>
            </div>
          </Link>
        </div>
      </Container>
    </footer>
  );
};

export default React.memo(Footer);
