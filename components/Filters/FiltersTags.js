import { useContext } from 'react';
import { useRouter } from 'next/router';
import { stringify } from 'qs';
import { CrossIcon } from '../icons';
import FiltersContext from '../../contexts/FiltersContext';

export default function FiltersTags() {
  const { push, query, pathname } = useRouter();
  const { traitFilters, setIsFormReset } = useContext(FiltersContext);

  const refresh = () => {
    const stringifiedSearch = stringify(traitFilters, { encode: false, arrayFormat: 'indices' });

    const newQuery = {
      ...query,
      ...(stringifiedSearch?.length ? { search: stringifiedSearch } : {})
    };

    push({
      pathname,
      query: newQuery,
    }, undefined, { scroll: false });
  };

  return (
    <>
      {
        traitFilters?.stringTraits?.map((type, typeIndex) => {
          if (type?.name && type?.values?.length ) {
            return type.values.map((value, index) => (
              <button 
                key={`${type}-${index}`}
                type="button" className="tag text-xs py-2.5 px-4 rounded-md mr-4 mb-4"
                onClick={() => { 
                  type.values.splice(index, 1);
                  if(type.values?.length === 0) {
                    traitFilters.stringTraits.splice(typeIndex, 1);
                  }
                  refresh();
                }}
              >
                <span className="flex">
                  <span className="text-white mr-2">{type.name}</span>
                  <span className="text-manatee">{value}</span>
                  <CrossIcon className="w-[10px] text-manatee ml-3" />
                </span>
              </button>
            ))
          }
          return '';
        })
      }
      { 
        traitFilters?.stringTraits?.length > 0 && (
          <button
            type="button"
            className="text-xs text-white ml-1 hover:underline"
            onClick={() => setIsFormReset(true)}
          >
            Clear all filters
          </button>
        )
      }
    </>
  );
}
