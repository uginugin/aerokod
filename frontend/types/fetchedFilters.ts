export type TFetchedFilters = {
  'projects':
  {
    'id': number,
    'title': string,
    'is_active': boolean,
    'disabled': boolean,
  }[],
  'rooms':
  {
    'number': number,
    'is_active': boolean,
    'disabled': boolean
  }[],
  'square': {
    'min_range': number,
    'max_range': number,
    'min': number,
    'max': number
  },
  'price': {
    'min_range': number,
    'max_range': number,
    'min': number,
    'max': number
  }
};
