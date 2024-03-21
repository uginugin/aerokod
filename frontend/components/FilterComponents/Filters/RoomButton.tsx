import { useState, type FC, useEffect } from 'react';
import type { TFetchedFilters } from '@/types/fetchedFilters';
import useQuery from '@/Hooks/useQueryParams';

type Props = {
  data: TFetchedFilters['rooms'][number]
};
const RoomButton: FC<Props> = ({ data }) => {
  const [active, setActive] = useState(data.is_active);
  const queryParamName = 'f[rooms][]';
  const { addParameter, removeParameter, updateURL } = useQuery();

  useEffect(() => {
    setActive(data.is_active);
  }, [data]);

  return (
    <div className={`brdr h-14 w-full ${active ? '!border-white' : ''}`}>
      <button
        disabled={data.disabled && !active}
        onClick={() => {
          setActive((prev) => !prev);
          if (active) {
            removeParameter(queryParamName, `${data.number}`);
          } else {
            addParameter(queryParamName, `${data.number}`);
          }
          updateURL();
        }}
        type="button"
        className={`h-full filter-padding w-full flex justify-center items-center rounded-[10px] ${active ? 'bg-blue' : ''} ${data.disabled ? 'bg-grey opacity-50' : ''}`}
      >
        <p className={`${active ? 'text-white' : ''}${data.disabled ? 'line-through' : ''}`}>
          {data.number === 0 ? 'Ст' : `${data.number}К`}
        </p>
      </button>
    </div>
  );
};
export default RoomButton;
