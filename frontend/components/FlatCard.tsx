import { FC } from 'react';
import likeIcon from '@/assets/likeIcon.svg';
import Image from 'next/image';
import type { TFetchedFlats } from '@/types/fetchedFlats';
import { formatToSplitedDigitWithComma } from '@/utils/formatting';
import CircleButton from './CircleButton';

type Props = TFetchedFlats[number];

const FlatCard: FC<Props> = ({
  project_title, floor, release_dates, studio, rooms, square, price, old_price, image,
}) => {
  const rows = {
    Проект: project_title,
    Этаж: `${floor} из ?`,
    'Срок сдачи': release_dates,
  };

  const rowsData = Object.entries(rows);
  const lastRow = rowsData.at(-1);

  return (
    <div className="px-6 pt-[18px] h-full pb-4 rounded-[0.36rem] brdr max-w-[580px]">
      <div className="flex justify-between">
        <div>
          <p className="t_12 font-ev">
            {`${studio ? 'Студия' : `${rooms}-комнатная`} ${square}м²`}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <p className="t_18 font-semibold whitespace-nowrap">{`${formatToSplitedDigitWithComma(price.toString()).text} ₽`}</p>
            <p className="t_12 line-through whitespace-nowrap">
              {`${formatToSplitedDigitWithComma(old_price.toString()).text} ₽`}
            </p>
          </div>
        </div>
        <CircleButton
          type="button"
          imageSrc={likeIcon}
          imageAlt="Like"
          onClickAction={() => {}}
        />
      </div>
      <div className="mt-8 mx-auto w-1/2 aspect-[3_/_4] relative">
        <Image
          src={image}
          alt="flat planning image"
          fill
        />
      </div>
      <div className="mt-8">
        {/* Отрисовываем строчки с линиями */}
        {rowsData.slice(0, -1).map((row) => (
          <div key={row[0]}>
            <div className="flex justify-between">
              <p className="t_12 font-ev opacity-50">{row[0]}</p>
              <p className="t_12 font-ev">{row[1]}</p>
            </div>
            <hr className="my-1" />
          </div>
        ))}
        {/* Отрисовываем последнюю строку, без линии */}
        {lastRow && (
          <div className="flex justify-between">
            <p className="t_12 font-ev opacity-50">{lastRow[0]}</p>
            <p className="t_12 font-ev">{lastRow[1]}</p>
          </div>
        )}
      </div>
    </div>
  );
};
export default FlatCard;
