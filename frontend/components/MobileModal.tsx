import { type FC, type PropsWithChildren } from 'react';
import CircleButton from '@/components/CircleButton';
import closeIcon from '@/assets/closeIcon.svg';

type Props = {
  onCloseAction: () => void,
};

const MobileModal: FC<PropsWithChildren<Props>> = ({ children, onCloseAction }) => (
  <div className="w-full absolute px-3 top-0 z-10 bg-white">
    <div className="flex justify-end">
      <CircleButton
        noBorder
        backgroundColor="#8f8f8f"
        type="button"
        imageSrc={closeIcon}
        imageAlt="close modal"
        onClickAction={onCloseAction}
      />
    </div>
    <div className="mt-6">
      {children}
    </div>
  </div>
);
export default MobileModal;
