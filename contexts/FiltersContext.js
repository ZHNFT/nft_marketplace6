import { createContext } from 'react';

const FiltersContext = createContext({
  traitFilters: null,
  setTraitFilters: () => {},
  isFormReset: false,
  setIsFormReset: () => {}
});

export default FiltersContext;