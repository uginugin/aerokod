import { type FC } from 'react';
import type { TFetchedFilters } from '@/types/fetchedFilters';
import ClipLoader from 'react-spinners/ClipLoader';
import FilterNameWrapper from './FilterNameWrapper';
import ProjectSelect from './Filters/ProjectSelect';
import RangeSliderWithInputs from './Filters/RangeSliderWithInputs/RangeSliderWithInputs';
import RoomButton from './Filters/RoomButton';

type Props = {
  fetchedFilters: TFetchedFilters | undefined
};

const AllFilters: FC<Props> = ({ fetchedFilters }) => {
  if (fetchedFilters) {
    return (
      <>
        <FilterNameWrapper title="Проект">
          <ProjectSelect data={fetchedFilters.projects} />
        </FilterNameWrapper>
        <FilterNameWrapper title="Укажите количество комнат">
          <div className="filter">
            {fetchedFilters.rooms.sort((a, b) => a.number - b.number).map((v) => (
              <RoomButton key={v.number} data={v} />
            ))}
          </div>
        </FilterNameWrapper>
        <FilterNameWrapper title="Стоимость">
          <RangeSliderWithInputs
            unit="₽"
            data={fetchedFilters.price}
            queryParamName="price"
          />
        </FilterNameWrapper>
        <FilterNameWrapper title="Задайте площадь, м²">
          <RangeSliderWithInputs
            data={fetchedFilters.square}
            afterCommaAmount={1}
            rangeSliderStep={0.1}
            queryParamName="square"
          />
        </FilterNameWrapper>
      </>
    );
  }
  return (
    <div className="flex justify-center my-10 w-full">
      <ClipLoader />
    </div>
  );
};

export default AllFilters;
