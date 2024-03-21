import { useState, type FC } from 'react';
import Image from 'next/image';
import downArrow from '@/assets/downArrow.svg';
import type { TFetchedFilters } from '@/types/fetchedFilters';
import useQueryParams from '@/Hooks/useQueryParams';
import FilterWrapper from '../FilterWrapper';

type Props = {
  data: TFetchedFilters['projects']
};
const ProjectSelect: FC<Props> = ({ data }) => {
  const defaultValue = 'Все';
  const queryParamName = 'f[projects][]';

  const {
    addParameter,
    removeParameter,
    updateURL,
  } = useQueryParams();

  const activeElement = data.find((v) => v.is_active === true);
  const [opened, setOpened] = useState(false);
  const [activeValue, setActiveValue] = useState(activeElement?.title || defaultValue);

  return (
    <FilterWrapper>
      <div className="h-full w-full">
        <button
          onClick={() => setOpened((prev) => !prev)}
          type="button"
          className="w-full filter-padding h-full bg-transparent focus:outline-none flex items-center justify-between"
        >
          <p>
            {/* className={activeElement?.disabled ? 'line-through' : ''} */}
            {activeValue}
          </p>
          <Image src={downArrow} alt="open list" />
        </button>
        {opened && (
        <div className="relative z-10 bg-white brdr mx-2">
          <div className="mt-1">
            <button
              type="button"
              className="w-full hover:bg-blue hover:text-white"
              onClick={() => {
                setActiveValue(defaultValue);
                removeParameter(queryParamName);
                updateURL();
                setOpened((prev) => !prev);
              }}
            >
              {defaultValue}
            </button>
            <hr className="mt-1" />
          </div>
          {data.map((v) => (
            <div key={v.id} className="mt-1">
              <button
                disabled={v.disabled}
                type="button"
                className={`h-full w-full t_14 ${v.disabled ? 'line-through' : 'hover:bg-blue hover:text-white'}`}
                onClick={() => {
                  setActiveValue(v.title);
                  removeParameter(queryParamName);
                  addParameter(queryParamName, `${v.id}`);
                  updateURL();
                  setOpened((prev) => !prev);
                }}
              >
                {v.title}
              </button>
              <hr className="mt-1" />
            </div>
          ))}
        </div>
        )}
      </div>

    </FilterWrapper>
  );
};
export default ProjectSelect;
