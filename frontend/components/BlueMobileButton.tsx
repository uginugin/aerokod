import { FC } from 'react';

type Props = {
  type: 'button' | 'submit' | 'reset',
  onClickAction: () => void,
};

const BlueMobileButton: FC<React.PropsWithChildren<Props>> = ({
  children,
  type,
  onClickAction,
}) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      onClickAction();
    }}
    // eslint-disable-next-line react/button-has-type
    type={type}
    className="flex items-center justify-center w-full h-11 rounded-[10px] bg-blue text-white gap-2"
  >
    {children}
  </button>
);
export default BlueMobileButton;
