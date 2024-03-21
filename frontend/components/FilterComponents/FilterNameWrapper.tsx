import type { FC, PropsWithChildren } from 'react';

type Props = {
  title: string,
};

const FilterNameWrapper: FC<PropsWithChildren<Props>> = ({ title, children }) => (
  <div className="flex-1">
    <p className="t_12 font-ev font-normal opacity-50 whitespace-nowrap">
      {title}
    </p>
    <div className="mt-3 t_14 font-normal font-ev ">
      {children}
    </div>
  </div>
);

export default FilterNameWrapper;
