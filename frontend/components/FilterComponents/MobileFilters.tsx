import {
  type FC,
  useEffect,
  type Dispatch,
  type SetStateAction,
  type PropsWithChildren,
} from 'react';
import BlueMobileButton from '@/components/BlueMobileButton';
import mobileFilterIcon from '@/assets/mobileFilterIcon.svg';
import MobileModal from '@/components/MobileModal';
import Image from 'next/image';

type Props = {
  opened: boolean,
  setOpened: Dispatch<SetStateAction<boolean>>,
};

const MobileFilters: FC<PropsWithChildren<Props>> = ({
  opened,
  setOpened,
  children,
}) => {
  const toggleOpened = () => setOpened((prev) => !prev);

  useEffect(() => {
    setOpened(false);
  }, []);

  return (
    <>
      <BlueMobileButton type="button" onClickAction={toggleOpened}>
        <p className="t_14">Фильтр</p>
        <Image src={mobileFilterIcon} alt="Filter Icon" />
      </BlueMobileButton>
      <div className={opened ? '' : 'hidden'}>
        <MobileModal onCloseAction={toggleOpened}>
          <h3 className="t_25 font-medium uppercase">Фильтр</h3>
          <div className="flex flex-col gap-8 mt-8">
            {children}
          </div>
          <div className="mt-12">
            <BlueMobileButton type="button" onClickAction={toggleOpened}>
              <p className="t_14 font-ev font-semibold">Смотреть квартиры</p>
            </BlueMobileButton>
          </div>
        </MobileModal>
      </div>
    </>
  );
};
export default MobileFilters;
