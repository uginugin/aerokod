import { NextPage } from 'next';
import MobileFilters from '@/components/FilterComponents/MobileFilters';
import {
  useEffect, useLayoutEffect, useRef, useState,
} from 'react';
import AllFilters from '@/components/FilterComponents/AllFilters';
import useWindowSize from '@/hooks/useWindowSize';
import { fetchfromApi } from '@/utils/api';
import type { TFetchedFilters } from '@/types/fetchedFilters';
import type { TFetchedFlats } from '@/types/fetchedFlats';
import _ from 'lodash';
import BlueMobileButton from '@/components/BlueMobileButton';
import FlatCard from '@/components/FlatCard';
import useQueryParams from '@/hooks/useQueryParams';
import ClipLoader from 'react-spinners/ClipLoader';
import resetFilters from '@/assets/resetFilters.svg';
import Image from 'next/image';

const HomePage: NextPage = () => {
  const [mobileFiltersOpened, setMobileFiltersOpened] = useState(false);
  const { width } = useWindowSize();
  const {
    addParameter, removeParameter, updateURL, searchParams, clearQueryParams,
  } = useQueryParams();
  const filtersInButton = width < 1024;

  const showContent = !filtersInButton || !mobileFiltersOpened;

  const [fetchedFilters, setFetchedFilters] = useState<TFetchedFilters>();
  const [fetchedFlats, setFetchedFlats] = useState<TFetchedFlats>([]);
  const [flatsLoading, setFlatsLoading] = useState(true);
  const [firstRender, setFirstRender] = useState(true);

  const currentPage = useRef(1);
  const lastPage = useRef(1);
  const totalFlatsAmount = useRef(0);
  const perPage = useRef(0);

  const scrollCoords = useRef({ x: 0, y: 0 });

  // для того, чтобы не делать лишних запросов
  // (например обновлять фильтры при смене страницы итд)
  const pageChanged = useRef(false);

  const fetchFlats = (url: string) => new Promise<void>((resolve) => {
    fetchfromApi(url)
      .then((res: {
        data: TFetchedFlats,
        meta: {
          last_page: number,
          per_page: number,
          total: number,
          current_page: number,

        }
      }) => {
        // если страница поменялась, то добавляем в стейт новые квартиры
        if (pageChanged.current) {
          setFetchedFlats((prev) => prev.concat(res.data));
          pageChanged.current = false;
        } else {
          // если страница не изменилась, то заменяем список
          setFetchedFlats(res.data);
        }
        lastPage.current = res.meta.last_page;
        totalFlatsAmount.current = res.meta.total;
        perPage.current = res.meta.per_page;
        currentPage.current = res.meta.current_page;
        setFlatsLoading(false);
        resolve();
      });
  });
  const fetchFilters = () => {
    fetchfromApi(`/filters?${searchParams}`)
      .then((res: { data: TFetchedFilters }) => {
        setFetchedFilters(res.data);
      });
  };

  const debouncedUpdate = _.debounce(async () => {
    if (!pageChanged.current) {
      fetchFilters();
    }
    fetchFlats(`/flats?${searchParams}`);
  }, 700);

  // чтобы страничка "не скроллилась" вверх при изменении query параметров
  useLayoutEffect(() => {
    window.scrollTo(scrollCoords.current.x, scrollCoords.current.y);
    return () => {
      scrollCoords.current = { x: window.scrollX, y: window.scrollY };
    };
  }, [searchParams]);

  useEffect(() => {
    if (firstRender) {
      fetchFilters();
      (async () => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        // eslint-disable-next-line no-plusplus
        for (let i = 0; i < (Number(searchParams.get('page')) || 1); i++) {
          pageChanged.current = true;
          newSearchParams.set('page', (i + 1).toString());
          // eslint-disable-next-line no-await-in-loop
          await fetchFlats(`/flats?${newSearchParams}`);
        }
        pageChanged.current = false;
        setFirstRender(false);
      })();
    } else {
      debouncedUpdate();
    }

    return () => debouncedUpdate.cancel();
  }, [searchParams]);

  const filtersComponent = <AllFilters fetchedFilters={fetchedFilters} />;
  const flatsRemained = totalFlatsAmount.current - fetchedFlats.length;
  const showMoreAmount = perPage.current < flatsRemained ? perPage.current : flatsRemained;
  return (
    <div className="w-full bg-white">
      <div className="my-5 container">
        <div className="relative">
          <h2 className="t_25 font-ex uppercase font-medium">Планировки</h2>
          {filtersInButton && (
            <div className="mt-10">
              <MobileFilters
                opened={mobileFiltersOpened}
                setOpened={setMobileFiltersOpened}
              >
                {filtersComponent}
              </MobileFilters>
            </div>
          )}
          {!filtersInButton && (
            <>
              <div className="filter mt-10">
                {filtersComponent}
              </div>
              <div className="flex before:content-[''] before:flex-1 items-center mt-12">
                <p className="flex t_12 font-ev">{`Найдено ${totalFlatsAmount.current} квартир`}</p>
                <div className="flex flex-1 justify-end">
                  <button
                    type="button"
                    className="flex items-center gap-3"
                    onClick={() => {
                      clearQueryParams();
                      updateURL();
                    }}
                  >
                    <Image src={resetFilters} alt="reset filters" />
                    <p className="t_12 font-ev">Очистить всё</p>
                  </button>
                </div>
              </div>
              <hr className="mt-16" />
            </>
          )}
        </div>
        <main className={`${showContent ? '' : 'hidden'}`}>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-x-[20px]">
            {fetchedFlats?.map((v) => (
              <div key={v.id} className="mt-12">
                <FlatCard {...v} />
              </div>
            ))}
          </div>
          {flatsLoading && (
          <div className="w-full flex justify-center my-10">
            <ClipLoader />
          </div>
          )}
          { (lastPage.current > currentPage.current) && (
            !flatsLoading && (
            <div className="max-w-[580px] mx-auto mt-8">
              <BlueMobileButton
                type="button"
                onClickAction={() => {
                  setFlatsLoading(true);
                  removeParameter('page');
                  addParameter('page', (currentPage.current + 1).toString());
                  pageChanged.current = true;
                  updateURL();
                }}
              >
                <p className="t_14 font-semibold">{`Показать еще ${showMoreAmount} из ${totalFlatsAmount.current}`}</p>
              </BlueMobileButton>
            </div>
            )
          )}
        </main>
      </div>
    </div>
  );
};
export default HomePage;
