import { ArrowRight } from '@mui/icons-material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Form, useForm, useModal } from '../../hooks';
import { getSearchQueryData } from '../../services/sessionStorage.service';
import { createBooking, getBookingCreatedStatus, getBookingsErrors } from '../../store/bookings';
import { useAppDispatch } from '../../store/createStore';
import { addBookingRoom } from '../../store/rooms';
import { getCurrentUserId } from '../../store/users';
import { BookingType } from '../../types/types';
import Button from '../../components/common/Button';
import { DateOfStayField } from '../../components/common/Fields';
import GuestsCounter from '../../components/ui/GuestsCounter';
import { SuccessBookingModal } from '../../components/ui/modals';
import BookingFormPriceInfo from './BookingFormPriceInfo';
import validatorConfig from './validatorConfig';

const oneDayMs = 86_000_000;

const BookingForm = () => {
  const searchQueryData = getSearchQueryData();

  const [totalPrice, setTotalPrice] = useState(0);
  const dispatch = useAppDispatch();
  const { roomId } = useParams<{ roomId: string }>();
  const currentUserId = useSelector(getCurrentUserId());
  const bookingCreateStatusLoading = useSelector(getBookingCreatedStatus());
  const bookingError = useSelector(getBookingsErrors());
  const { isOpen, handleOpenModal, handleCloseModal } = useModal();

  const initialData = {
    arrivalDate: searchQueryData.arrivalDate || Date.now(),
    departureDate: searchQueryData.departureDate || Date.now() + oneDayMs,
    adults: searchQueryData.adults || 1,
    children: searchQueryData.children || 0,
    babies: searchQueryData.babies || 0,
    userId: currentUserId || 'not found',
    roomId: roomId,
    totalPrice: 0,
  };
  const { data, errors, enterError, setEnterError, handleInputChange, handleResetForm, handleKeyDown, validate } =
    useForm(initialData, false, validatorConfig);

  const countDays = Math.max(1, Math.round((data.departureDate - data.arrivalDate) / oneDayMs));

  useEffect(() => {
    if (!currentUserId) {
      setEnterError('??????????????, ?????????? ?????????????????????????? ??????????');
    }
    if (bookingError) {
      if (bookingError === 'BOOKING_EXIST') {
        setEnterError('???? ?????????????????? ???????? ???????? ?????????? ???????????????????????? ');
      }
      if (bookingError === '???? ?????????????? ?????????????????? ????????????. ???????????????????? ??????????') {
        setEnterError('??????, ??????-???? ?????????? ???? ??????, ???????????????????? ??????????');
      }
    }
  }, [currentUserId, bookingError]);

  const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (validate(data)) {
      const payload = {
        ...data,
        totalPrice,
      };
      try {
        dispatch(createBooking(payload)).then((bookingData: BookingType) => {
          if (bookingData) {
            dispatch(addBookingRoom(bookingData)).then(() => handleOpenModal());
            handleResetForm(event);
          }
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <>
      <Form data={data} errors={errors} handleChange={handleInputChange} handleKeyDown={handleKeyDown}>
        <DateOfStayField onChange={handleInputChange} data={data} />
        <GuestsCounter onChange={handleInputChange} data={data} />
        <BookingFormPriceInfo
          roomId={roomId}
          totalPrice={totalPrice}
          countDays={countDays}
          setTotalPrice={setTotalPrice}
        />
        <Button
          endIcon={<ArrowRight />}
          type='submit'
          className='form-btn__submit mt-0'
          onClick={handleSubmit}
          disabled={Object.keys(errors).length > 0 || !!enterError}
          fullWidth
        >
          ??????????????????????????
        </Button>
      </Form>
      {enterError && <p className='form__enter-error'>{enterError}</p>}
      <SuccessBookingModal
        open={isOpen}
        onClose={handleCloseModal}
        isLoading={bookingCreateStatusLoading}
        bookingData={data}
      />
    </>
  );
};

export default BookingForm;


//Commentaires
//La fonction BookingForm returne un template HTML. Ce template HTML est aliment?? par 
// sessionStorage.service (stockage de donn??e sp??cifique sur le disque locale), des fonctions
//issues de users et bookings (essentiellement les gets), la fonction useForm qui est invoquer puis destructur??e
//afin de pouvoir utiliser ses param??tres. Useeffect est param??trer de mani??re ?? g??rer les erreurs 
//lorssque currentUserId ou bookingError sont modifi??s. La fonction handleSubmit  prend pur entr??e
//une ??l??ment HTML form ??l??ment:button et r??cup??re la data (valeur actuelle dans  UseForm) pour constituer
//le payload en associant ?? data, la variable totalPrice usant la fonctionnalit?? useState.
// Ensuite, le reducer booking est appel?? pour utiliser les sc??naris createBooking (avec le param??tre de m??thode payload) et 
//addBookingRoom ( avec pour param??tre le resultat de la fonction pr??c??dente) pour utliser les reducers respectifs booking et room.
//qui eux meme vont appel?? les fonctions roomsservice et bookingservice qui vont g??rer les requetes HTML aupr??s du serveur 
//notemment les requetes (POST). Le contenu du template HTML retourn??e par la fonction BookingForm utilise toutes
//les donn??es principalement cit??es.