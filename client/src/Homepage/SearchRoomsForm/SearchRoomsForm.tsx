import { ArrowRight } from '@mui/icons-material';
import React from 'react';
import { Form, useForm } from '../../hooks';
import Button from '../../components/common/Button/Button';
import { DateOfStayField } from '../../components/common/Fields';
import GuestsCounter from '../../components/ui/GuestsCounter';
import validatorConfig from './validatorConfig';
import queryString from 'query-string';
import { setSessionStorageData } from '../../services/sessionStorage.service';
import history from '../../utils/history';

const oneDayMs = 86000000;

const initialState = {
  arrivalDate: Date.now(),
  departureDate: Date.now() + oneDayMs,
  adults: 1,
  children: 0,
  babies: 0,
};

const SearchRoomsForm = () => {
  const { data, errors, handleInputChange, handleKeyDown, validate, handleResetForm } = useForm(
    initialState,
    true,
    validatorConfig
  );

  const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (validate(data)) {
      const queryParams = queryString.stringify(data);
      setSessionStorageData(queryParams);
      history.push(`/rooms?${queryParams}`);
    }
  };

  return (
    <Form data={data} errors={errors} handleChange={handleInputChange} handleKeyDown={handleKeyDown}>
      <DateOfStayField data={data} onChange={handleInputChange} errors={errors} />
      <GuestsCounter data={data} onChange={handleInputChange} />
      <Button
        variant='outlined'
        type='button'
        size='small'
        onClick={handleResetForm}
        className='form-btn__reset'
        fullWidth
      >
        ANNULER
      </Button>
      <Button
        endIcon={<ArrowRight />}
        type='submit'
        className='form-btn__submit'
        onClick={handleSubmit}
        disabled={Object.keys(errors).length > 0}
        fullWidth
      >
        RESERVER
      </Button>
    </Form>
  );
};

export default SearchRoomsForm;

//Commentaires
//La fonction SearchRoomsForm invoque et destructure la fonction useForm pour pouvoir utiliser ses paramètres dans la
//feuille de code. La fonction handleSubmit prend pour entrée un formEvent<HTMLButtonElement> , récupère la data issus
//de la destructuration de la fonction form et l'insère dans le localstorage.
//La fonction va retourner un template HTML utilisant les fonctions, objets et variables précédemment cités.