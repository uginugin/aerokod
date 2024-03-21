import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

const useQueryParams = () => {
  const pathName = usePathname();

  const searchParams = useSearchParams();
  const searchParamsString = searchParams.toString();

  // добавляем & в конец, т.к. браузер автоматически его убирает
  // и декодируем для нормальной работы
  let queryString = decodeURI(
    searchParamsString ? `${searchParamsString}&` : '',
  );

  const router = useRouter();

  // добавлена для избежания ререндеров при замене параметров.
  // благодаря этой функции можно изменять сразу несколько параметров
  // но после изменений нужно обязательно их применить, выполнив эту функцию
  const updateURL = () => {
    // alert('updated')
    router.replace(`${pathName}?${encodeURI(queryString)}`);
  };

  const addParameter = (paramName: string, paramValue: string) => {
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    if (paramName !== 'page') removeParameter('page');
    const paramWithValue = `${paramName}=${paramValue}`;
    queryString = `${queryString}${paramWithValue}&`;
  };

  // чтобы удалить параметр, можно указать только его имя
  // если параметров с таким именем несколько, то можно ввести еще и значение
  // удаляемого параметра (для точной идентификации)
  // (если не указывать значение, то будет удалено первое вхождение)
  const removeParameter = (paramName: string, paramValue?: string) => {
    // если у нас обновляется любой параметр кроме страницы,
    // то пользователь перемещается снова на первую страницу
    if (paramName !== 'page') removeParameter('page');

    if (paramValue) {
      queryString = queryString.replace(`${paramName}=${paramValue}&`, '');
    } else {
      const startIndex = queryString.indexOf(paramName);
      // если такой элемент существует
      if (startIndex > -1) {
        const endIndex = queryString.indexOf('&', startIndex);
        const stringToRemove = queryString.slice(startIndex, endIndex + 1);
        queryString = `${queryString.replace(stringToRemove, '')}`;
      }
    }
  };

  const clearQueryParams = () => {
    queryString = '';
  };

  return {
    removeParameter,
    addParameter,
    updateURL,
    clearQueryParams,
    searchParams,
  };
};
export default useQueryParams;
