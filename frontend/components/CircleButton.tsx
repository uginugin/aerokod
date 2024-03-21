import Image from 'next/image';
import type { FC } from 'react';

type Props = {
  type: 'button' | 'submit' | 'reset',
  imageSrc: string,
  imageAlt: string,
  // eslint-disable-next-line react/require-default-props
  backgroundColor?: string,
  // eslint-disable-next-line react/require-default-props
  noBorder?: boolean,
  onClickAction: () => void,
};

const CircleButton: FC<Props> = ({
  backgroundColor, type, imageSrc, imageAlt, onClickAction, noBorder,
}) => (
  <button
    // eslint-disable-next-line react/button-has-type
    type={type}
    onClick={onClickAction}
    className={`flex h-[35px] p-[9px] aspect-square items-center justify-center ${noBorder ? '' : 'brdr'} !rounded-full`}
    style={{
      // eslint-disable-next-line object-shorthand
      backgroundColor: backgroundColor,
    }}
  >
    <div className="relative h-full w-full">
      <Image src={imageSrc} alt={imageAlt} fill />
    </div>
  </button>
);

export default CircleButton;
