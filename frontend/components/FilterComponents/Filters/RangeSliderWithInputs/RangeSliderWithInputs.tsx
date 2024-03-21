/* eslint-disable react/require-default-props */
import {
  useState, type ChangeEvent, type FC, useEffect, useRef,
} from 'react';
import useQueryParams from '@/Hooks/useQueryParams';
import _ from 'lodash';
import { formatToSplitedDigitWithComma } from '@/Utils/formatting';
import FilterWrapper from '../../FilterWrapper';
import RangeSlider from './RangeSlider/RangeSlider';

type Props = {
  afterCommaAmount?: number,
  rangeSliderStep?: number,
  unit?: string,
  data: {
    'min_range': number,
    'max_range': number,
    'min': number,
    'max': number
  },
  queryParamName: string,
};

// разобраться тут с query-параметрами, выставлением значений и зачеркивании текста!

const RangeSliderWithInputs: FC<Props> = ({
  afterCommaAmount = 0,
  rangeSliderStep = 1,
  unit,
  data,
  queryParamName,
}) => {
  const {
    searchParams, addParameter, removeParameter, updateURL,
  } = useQueryParams();

  const firstRender = useRef(true);

  const minQueryParamName = `f[${queryParamName}][min]`;
  const maxQueryParamName = `f[${queryParamName}][max]`;

  const minDefaultQueryValue = searchParams.get(minQueryParamName);
  const maxDefaultQueryValue = searchParams.get(maxQueryParamName);

  const [value, setValue] = useState({
    min: minDefaultQueryValue ? Number(minDefaultQueryValue) : data.min,
    max: maxDefaultQueryValue ? Number(maxDefaultQueryValue) : data.max,
  });

  const [textValue, setTextValue] = useState({
    min: minDefaultQueryValue ? formatToSplitedDigitWithComma(minDefaultQueryValue, afterCommaAmount).text : '',
    max: maxDefaultQueryValue ? formatToSplitedDigitWithComma(maxDefaultQueryValue, afterCommaAmount).text : '',
  });

  useEffect(() => {
    setValue({
      min: minDefaultQueryValue ? Number(minDefaultQueryValue) : data.min,
      max: maxDefaultQueryValue ? Number(maxDefaultQueryValue) : data.max,
    });
  }, [data]);

  useEffect(() => {
    const debouncedQueryParamsChange = _.debounce(() => {
      removeParameter(minQueryParamName);
      removeParameter(maxQueryParamName);

      // странная работа параметров на API,
      // если отправить f[price][max] без f[price][min],
      // то API вернет ошибку
      // из-за этого не можем корректно подстраивать ползунки в фильтре
      // цены и площади, т.к. всегда нужно хранить минимальный стейт,
      // если выставлен максимальный
      if (textValue.max || textValue.min) {
        addParameter(minQueryParamName, value.min.toString());
        addParameter(maxQueryParamName, value.max.toString());
      }

      updateURL();
    }, 1000);
    if (!firstRender.current) {
      debouncedQueryParamsChange();
    } else {
      firstRender.current = false;
    }
    return () => debouncedQueryParamsChange.cancel();
  }, [textValue]);

  const updateValues = (values: { min: number, max: number }) => {
    setTextValue({
      min: formatToSplitedDigitWithComma(values.min.toString(), afterCommaAmount).text,
      max: formatToSplitedDigitWithComma(values.max.toString(), afterCommaAmount).text,
    });
    setValue({
      min: values.min,
      max: values.max,
    });
  };

  const updateValuesFromInput = (e: ChangeEvent<HTMLInputElement>, minOrMax: 'min' | 'max') => {
    const cleanedInput = e.target.value.replace(/[^\d,]/g, '');

    const { text, numeric } = formatToSplitedDigitWithComma(cleanedInput, afterCommaAmount);

    setTextValue((prev) => ({ ...prev, [minOrMax]: text }));

    // если текста нет, то выставляем допустимые значения
    if (!text) {
      const allowedMinOrMaxValue = minOrMax === 'max' ? data.max : data.min;
      setValue((prev) => ({ ...prev, [minOrMax]: allowedMinOrMaxValue }));
    } else {
      setValue(((prev) => ({ ...prev, [minOrMax]: numeric })));
    }
  };

  // закомменчено т.к. при блюре вызывается запрос и плохо работает с дебаунсом
  // (надо придумать как это решить)
  // const onInputBlur = (e: ChangeEvent<HTMLInputElement>, minOrMax: 'min' | 'max') => {
  //   let inputValue = e.target.value;
  //   // если в инпуте остается запятая без ничего, то убираем ее
  //   if (afterCommaAmount && inputValue.at(-1) === ',') inputValue = inputValue.slice(0, -1);
  //   // так как отправка запросов у нас зависит от изменения значений текстового поля,
  //   // то приходится напрямую запрещать обновления
  //   setTextValue((prev) => ({ ...prev, [minOrMax]: inputValue }));
  // };

  const minPlaceHolder = formatToSplitedDigitWithComma(data.min.toString(), afterCommaAmount).text;
  const maxPlaceHolder = formatToSplitedDigitWithComma(data.max.toString(), afterCommaAmount).text;
  return (
    <FilterWrapper>
      <div className="relative w-full h-full flex items-center">
        <div className="filter-padding flex w-full justify-between items-center overflow-x-hidden">
          <div className="flex flex-1 gap-1">
            <p>от</p>
            <input
              className={`focus:outline-none ${textValue.min && (value.min > data.max || value.min < data.min) ? 'line-through' : ''}`}
              onChange={(e) => updateValuesFromInput(e, 'min')}
              placeholder={minPlaceHolder}
              style={{ width: `${textValue.min.length || minPlaceHolder.length}ch` }}
              value={textValue.min}
              // onBlur={(e) => onInputBlur(e, 'min')}
            />
            {unit && <p>{unit}</p>}
          </div>
          <hr className="h-px w-[20px] mx-5" />
          <div className="flex flex-1 justify-end gap-1">
            <p>до</p>
            <input
              className={`focus:outline-none text-right  ${textValue.max && (value.max < data.min || value.max > data.max) ? 'line-through' : ''}`}
              onChange={(e) => updateValuesFromInput(e, 'max')}
              placeholder={maxPlaceHolder}
              style={{ width: `${textValue.max.length || maxPlaceHolder.length}ch` }}
              value={textValue.max}
              // onBlur={(e) => onInputBlur(e, 'max')}
            />
            {unit && <p>{unit}</p>}
          </div>
        </div>
        <div className="absolute bottom-1 w-full overflow-x-clip">
          <div className="relative w-[calc(100%_-_50px)] left-[25px]">
            <RangeSlider
              min={data.min_range}
              max={data.max_range}
              value={value}
              onChange={updateValues}
              step={rangeSliderStep}
            />
          </div>
        </div>
      </div>
    </FilterWrapper>
  );
};
export default RangeSliderWithInputs;
