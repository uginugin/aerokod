/* eslint-disable react/require-default-props */
import type { FC, PropsWithChildren } from 'react';

const FilterWrapper: FC<PropsWithChildren> = ({
  children,
}) => (
  <div className="brdr w-full h-14">
    {children}
  </div>

);

export default FilterWrapper;
