import {
  useEffect,
  useState,
  type FC,
  type ChangeEventHandler,
} from 'react';
import styles from './RangeSlider.module.scss';

type ValuePropType = {
  min: number;
  max: number;
};

type Props = {
  min: number,
  max: number,
  value: ValuePropType,
  // eslint-disable-next-line react/require-default-props
  step?: number,
  onChange: (values: ValuePropType) => void,
};

const RangeSlider: FC<Props> = ({
  min, max, value, step = 1, onChange,
}) => {
  const [minValue, setMinValue] = useState(value ? value.min : min);
  const [maxValue, setMaxValue] = useState(value ? value.max : max);

  useEffect(() => {
    if (value) {
      setMinValue(value.min);
      setMaxValue(value.max);
    }
  }, [value]);

  const handleMinChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const newMinVal = Math.min(+e.target.value, maxValue - step);
    if (!value) setMinValue(newMinVal);
    onChange({ min: newMinVal, max: maxValue });
  };

  const handleMaxChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    e.preventDefault();
    const newMaxVal = Math.max(+e.target.value, minValue + step);
    if (!value) setMaxValue(newMaxVal);
    onChange({ min: minValue, max: newMaxVal });
  };

  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  return (
    <div>
      <div className={styles['input-wrapper']}>
        <input
          className={styles.input}
          type="range"
          value={minValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMinChange}
        />
        <input
          className={styles.input}
          type="range"
          value={maxValue}
          min={min}
          max={max}
          step={step}
          onChange={handleMaxChange}
        />

        <div className={styles['control-wrapper']}>
          <div
            className={`${styles.control} bg-blue`}
            style={{ left: `${minPos}%` }}
          />
          <div className={`${styles.rail} h-[1.5px]`}>
            <div
              className={`${styles['inner-rail']} bg-blue`}
              style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
            />
          </div>
          <div className={`${styles.control} bg-blue`} style={{ left: `${maxPos}%` }} />
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
