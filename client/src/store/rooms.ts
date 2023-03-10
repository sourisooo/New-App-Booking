import { AppThunk, RootState } from './createStore';
import { RoomType, BookingType } from './../types/types';
import { createAction, createSlice } from '@reduxjs/toolkit';
import roomsService from '../services/rooms.service';

const roomsSlice = createSlice({
  name: 'rooms',
  initialState: {
    entities: [] as Array<RoomType>,
    filteredEntities: [] as Array<RoomType>,
    isLoading: true as boolean,
    error: null as string | null,
  },
  reducers: {
    roomsRequested: state => {
      state.isLoading = true;
    },
    roomsReceived: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    filteredRoomsReceived: (state, action) => {
      state.filteredEntities = action.payload;
      state.isLoading = false;
    },
    roomsRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    roomUpdated: (state, action) => {
      const roomIndex = state.entities.findIndex(room => room._id === action.payload._id);
      state.entities[roomIndex] = action.payload;
    },
  },
});

const { actions, reducer: roomsReducer } = roomsSlice;

const { roomsRequested, roomsReceived, roomsRequestFailed, roomUpdated, filteredRoomsReceived } = actions;

const addBookingRoomRequested = createAction('rooms/addBookingRoomRequested');
const addBookingRoomRequestedSuccess = createAction('rooms/addBookingRoomRequestedSuccess');
const addBookingRoomRequestedFailed = createAction('rooms/addBookingRoomRequestedFailed');

const removeBookingRoomRequested = createAction('rooms/removeBookingRoomRequested');
const removeBookingRoomRequestedSuccess = createAction('rooms/removeBookingRoomRequestedSuccess');
const removeBookingRoomRequestedFailed = createAction('rooms/removeBookingRoomRequestedFailed');

const roomUpdateRequested = createAction('rooms/roomUpdateRequested');
const roomUpdateRequestedFailed = createAction('rooms/roomUpdateRequestedFailed');

export const loadRoomsList = (): AppThunk => async dispatch => {
  dispatch(roomsRequested());
  try {
    const { content } = await roomsService.getAll();
    dispatch(roomsReceived(content || []));
  } catch (error) {
    dispatch(roomsRequestFailed(error.message));
  }
};

export const loadFilteredRoomsList =
  (queryParams?: any): AppThunk =>
  async dispatch => {
    dispatch(roomsRequested());
    try {
      const { content } = await roomsService.getAll(queryParams);
      dispatch(filteredRoomsReceived(content || []));
    } catch (error) {
      dispatch(roomsRequestFailed(error.message));
    }
  };

export const addBookingRoom =
  (payload: BookingType): AppThunk =>
  async dispatch => {
    dispatch(addBookingRoomRequested());
    try {
      roomsService.setBooking(payload);
      dispatch(addBookingRoomRequestedSuccess());
    } catch (error) {
      dispatch(addBookingRoomRequestedFailed());
    }
  };

export const removeBookingRoom =
  (payload: { roomId: string; _id: string }): AppThunk =>
  async dispatch => {
    dispatch(removeBookingRoomRequested());
    try {
      roomsService.deleteBooking(payload);
      dispatch(removeBookingRoomRequestedSuccess());
    } catch (error) {
      dispatch(removeBookingRoomRequestedFailed());
    }
  };

export const updateRoomData =
  (payload: RoomType): AppThunk =>
  async dispatch => {
    dispatch(roomUpdateRequested());
    try {
      const { content } = await roomsService.update(payload);
      dispatch(roomUpdated(content));
    } catch (error) {
      console.log(error);
      dispatch(roomUpdateRequestedFailed());
    }
  };

export const getRooms = () => (state: RootState) => state.rooms.entities;
export const getFilteredRooms = () => (state: RootState) => state.rooms.filteredEntities;
export const getRoomsLoadingStatus = () => (state: RootState) => state.rooms.isLoading;
export const getRoomById = (roomId: string) => (state: RootState) => {
  if (state.rooms.entities) {
    return state.rooms.entities.find(room => room._id === roomId);
  }
};

export const getRoomsByIds = (roomsIds: string[]) => (state: RootState) => {
  if (state.rooms.entities) {
    return state.rooms.entities.filter(room => (roomsIds.length > 0 ? roomsIds.includes(room._id || '') : false));
  }
  return [];
};

export default roomsReducer;


//Commentaires
//La fonction roomsSlice initialise le reducer "rooms" en lui definissant plusieurs param??tres principalement 
//entities et filteredEntities, eux meme d??finis comme des objets disposant du type room (param??tres/variables d??finis 
// la feuille de code types). Le reducer se d??compose en 5 sc??naris: roomsRequested, roomsReceived, filteredRoomsReceived, 
// roomsRequestFailed, roomUpdated; ces sc??naris d??terminent la fa??on dont les valeurs des param??tres vont etre 
//incr??ment??. Chaque sc??nari prend pour entr??e de fonction un param??tre du reducer (principalement un objet) et une variable
// "action" qui repr??sente le payload. Succintement:
// - roomsReceived: l'array d'objet entities est incr??ment?? par le payload. Le contenu du payload est d??termin?? lors de l'appel
// du reducer et de son scenarii.
// - filteredRoomsReceived: meme chose que roomsReceived mais cette fois l'array d'objet filteredEntities est incr??ment??
// - roomUpdated: Selectionne l'objet entitie issu de l'array entities compte tenu de l'id du payload puis incr??mente
// l'objet entitie de l'array entities. Le payload va d??finir le contenu de la modification de l'objet entitie.
//Les variables roomsSlice et actions sont d??finis pour destructurer les param??tres et sc??n??ris du reducers pour etre en mesure
// d'appeler ces param??tres et sc??naris ?? l'ext??rieure de la feuille de code.
// Les methodes impl??ment??es redux createAction permettent de d??finir un type d'objet(ex: rooms/addBookingRoomRequested)
//puis de retourner un un objet contenant cet objet et un payload dans le cas ou un payload est utilis?? en param??tre de
//la variable (ex: addBookingRoomRequested) affect??e ?? createAction.
//La fonction loadRoomsList est fonction de type AppThunk (doit respecter la forme AppThunk), fonction qui invoque une autre
//fonction prenant comme entr??e une promesse de type "dispatch" permettant l'invocation de reducer. Cette derni??re fonction
//invoque le reducer roomsRequested en prenant en entr??e aucun payload(aucun argmument lors de l'appel du reducer).
//En effet, ce reducer permet d'activer la variable isLoading a "true" et ne n??cessite aucun argument. Par la suite,
//une requete HTML est demand??e au server ?? l'adresse http "rooms/" grace ?? la fonction roomsService, le param??tre "queryParams"
//va venir indiquer et pr??ciser l'adresse surlaquelle (adresse devenant "rooms/queryParams") un objet va etre retourner.
//Ensuite, le reducer roomsReceived va etre utiliser en prenant pour param??tre de m??thode de ce reducer l'objet qui a 
//??t?? retourn??e pr??c??demment tandis ce que le deuxi??me argument ([]) repr??sente le payload ou l'action a r??alis??.
//Les fonctions loadFilteredRoomsList, addBookingRoom, removeBookingRoom et updateRoomData ont des fonctionnements tr??s similaire
// ?? celle d??crite dans loadRoomsList, les principales diff??rences ??tant
//  - l'usage de scenarii diff??rent lors de l'appel du reducer (ex: filteredRoomsReceived ou roomsRequested),
//  - la pr??sence ou l'absence de payload lors de l'invocation de la roomservice(ex roomsService.getAll(queryParams)), 
//  - le choix de la m??thode utilis??e lors de l'invocation de la roomservice (ex: getAll, setBooking ou deleteBooking), 
//  - l'usage de la fonctionnalit?? createAction sp??cifique dans certaines fonctions (ex: removeBookingRoomRequestedSuccess, addBookingRoomRequestedSuccess),
//  - l'usage de payload sp??cifique lors de l'appel de fonction Appthunk (ex: payload: { roomId: string; _id: string } ou
//    payload: BookingType).
// Les fonctions "get" (ex: getRooms, getFilteredRooms...) sont des fonctions qui invoquent la fonction RootState rappelant que
// cette fonction retourne le type de rootReducer lui meme ??tant une concat??nation de tous les reducers. Sur ces diff??rents types, la
// variable rooms (d??finit comme param??tre par rootReducer) puis la variable entites (d??finit comme param??tre par roomsSlice) vont etre
// acc??der pour etre associer la valeur de ces variables ?? la fonction "get" concern??e.
// 
