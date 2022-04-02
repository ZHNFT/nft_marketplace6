import { createContext } from 'react';

const FiltersContext = createContext({
  traitFilters: null,
  setTraitFilters: () => {},
  queryFilters: null,
  setQueryFilters: () => {},
  isPriceReset: null,
  setIsPriceReset: () => {},
  isRarityReset: null,
  setIsRarityReset: () => {},
  isFormReset: false,
  setIsFormReset: () => {}
});

export default FiltersContext;