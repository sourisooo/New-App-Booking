import React, { useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFiltersQuery, usePagination, useSort } from '../../hooks';
import useSearch from '../../hooks/useSearch';
import { setSessionStorageData } from '../../services/sessionStorage.service';
import { useAppDispatch } from '../../store/createStore';
import { getFilteredRooms, getRoomsLoadingStatus, loadFilteredRoomsList } from '../../store/rooms';
import Pagination from '../../components/common/Pagination';
import Searchbar from '../../components/common/Searchbar';
import RoomsDisplayCount from '../../components/ui/rooms/RoomsDisplayCount';
import RoomsFilter from '../../ListofRooms/RoomsFilters';
import RoomsList from '../../components/ui/rooms/RoomsList';
import RoomsListSkeleton from '../../components/ui/rooms/RoomsList/RoomsListSkeleton';
import RoomsSort from '../../components/ui/rooms/RoomsSort';

const setPageSizeOptions = [
  { name: '6', value: 6 },
  { name: '12', value: 12 },
  { name: '18', value: 18 },
  { name: '24', value: 24 },
];

const RoomsPage = () => {
  const rooms = useSelector(getFilteredRooms());
  const dispatch = useAppDispatch();
  const roomsIsLoading = useSelector(getRoomsLoadingStatus());
  const { searchFilters, handleResetSearchFilters } = useFiltersQuery();
  const { filteredData, searchTerm, setSearchTerm, handleChangeSearch } = useSearch(rooms, {
    searchBy: 'roomNumber',
  });
  const { sortedItems, sortBy, setSortBy } = useSort(filteredData || [], { path: 'roomNumber', order: 'desc' });
  const {
    itemsListCrop: roomsListCrop,
    currentPage,
    pageSize,
    handleChangePage,
    handleChangePageSize,
  } = usePagination(sortedItems || [], setPageSizeOptions[1].value);

  const handleSort = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSortBy(JSON.parse(event.target.value));
      handleChangePage(event, 1);
    },
    [handleChangePage, setSortBy]
  );

  const handleResetFilters = useCallback(() => {
    handleResetSearchFilters();
    setSearchTerm('');
    setSortBy({ path: 'roomNumber', order: 'desc' });
    handleChangePageSize({ target: setPageSizeOptions[1] });
  }, [handleChangePageSize, handleResetSearchFilters]);

  useEffect(() => {
    const oneDayMs = 86_000_000;
    const initialSearchFilters = {
      arrivalDate: Date.now(),
      departureDate: Date.now() + oneDayMs,
    };

    setSessionStorageData(searchFilters);
    dispatch(loadFilteredRoomsList({ ...initialSearchFilters, ...searchFilters }));
  }, [searchFilters]);

  return (
    <main className='rooms-page'>
      <aside className='rooms-page__filters'>
        <RoomsFilter onReset={handleResetFilters} />
      </aside>
      <section className='rooms-page__rooms'>
        <div className='rooms-page__sorting'>
          <Searchbar value={searchTerm} onChange={handleChangeSearch} />
          <RoomsSort sortBy={sortBy} onSort={handleSort} />
          <RoomsDisplayCount count={pageSize} setCount={handleChangePageSize} options={setPageSizeOptions} />
        </div>
        <h2 className='rooms__title'>????????????, ?????????????? ???? ?????? ?????? ??????????????????</h2>
        {roomsIsLoading ? <RoomsListSkeleton pageSize={pageSize} /> : <RoomsList rooms={roomsListCrop} />}
        {roomsListCrop.length === 0 && <h2>???? ???? ?????????? ?????? ?????? ???????????????????? ?????????????? ???? ?????????? ???????????????????? &#128577;</h2>}

        {sortedItems.length > pageSize && (
          <div className='rooms-page__pagination'>
            <Pagination items={sortedItems} pageSize={pageSize} currentPage={currentPage} onChange={handleChangePage} />
            <p className='rooms-page__pagination-info'>
              {`${(currentPage - 1) * pageSize || 1} - 
              ${pageSize * currentPage > rooms.length ? rooms.length : pageSize * currentPage}
              ???? ${rooms.length} ?????????????????? ????????????`}
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default RoomsPage;

//Commentaires
//La fonction RoomsPage d??finit plusieurs constantes issus des sc??naris du reducer room et de ses GET, acc??des ?? l'int??gralit?? des
//reducers avec useAppDispatch, utilise la fonction useFiltersQuery, useSearch (interagir entre l'URL et la saisie), useSort (tri ascendant ou descant), 
//usePagination(param??trage du nombre de page par resultat). Les fonctions pr??cedentes sont invoqu??s puis destructur??s pour pouvoir
//utiliser les variables de ses fonctions dans cette feuille de code.
//La fonction handleSort est une fonction callback qui se d??clenche lorsque handleChangePage ou setSortBy sont modifi??s. La fonction
//d??clench??e est une fonction qui prend pour entr??e "ChangeEvent<HTMLInputElement>", appelle la fonction setSortBy en prenant comme
//param??tre HTMLInputElement.
//La fonction handleResetFilters est une fonction callback qui se d??vlent lorsque handleChangePageSize, handleResetSearchFilters sont
//modifi??s.  La fonction d??clench??e invoque diff??rentes fonctions initialisant la page d'accueil de la roompage.
//Une fonction useEffect est sp??cifi??e et se d??clenche lorsque searchFilters est modifi??, pour lancer les fonctions issus du reducer rooms
//et celle du localStorage.
//La fonction RoomsPage retourne un template HTML contenant l'ensemble des fonctions et objets et variables pr??cit??s.