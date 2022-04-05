import { useContext } from 'react';
import { useRouter } from 'next/router';
import { stringify } from 'qs';
import FiltersContext from '../../contexts/FiltersContext';
import FilterTag from './FilterTag';

export default function FiltersTags() {
  const { push, query, pathname } = useRouter();
  const { traitFilters, queryFilters, setIsPriceReset, setIsRarityReset, setIsFormReset } = useContext(FiltersContext);

  const refresh = ({ removeKey }) => {
    const stringifiedSearch = stringify(traitFilters, { encode: false, arrayFormat: 'indices' });

    const filteredQuery = query && removeKey
      ? Object.keys(query).filter(key => !removeKey.includes(key)).reduce((acc, key) => ({ ...acc, [key]: query[key] }), {})
      : query;

    const newQuery = {
      ...filteredQuery,
      ...(stringifiedSearch?.length ? { search: stringifiedSearch } : {})
    };

    push({
      pathname,
      query: newQuery,
    }, undefined, { scroll: false });
  };

  return (
    <div>
      {
        queryFilters && Object.keys(queryFilters)?.map(key => {
          if (key === 'price' && queryFilters.price?.priceFrom !== undefined) {
            return (
              <FilterTag
                key="tag_price"
                name="Price"
                value={`$${queryFilters.price.priceFrom} - ${queryFilters.price.priceTo}`}
                onHandleClick={() => {
                  delete queryFilters.price;
                  setIsPriceReset(true);
                  refresh({ removeKey: ['priceFrom', 'priceTo'] });
                }}
              />
            );
          }
          if (key === 'rarity' && queryFilters.rarity?.rarityFrom !== undefined) {
            return (
              <FilterTag
                key="tag_rarity"
                name="Rarity Rank"
                value={`${queryFilters.rarity.rarityFrom} - ${queryFilters.rarity.rarityTo}`}
                onHandleClick={() => {
                  delete queryFilters.rarity;
                  setIsRarityReset(true);
                  refresh({ removeKey: ['rarityFrom', 'rarityTo'] });
                }}
              />
            );
          }
          return '';
        })
      }
      {
        traitFilters?.stringTraits?.map((type, typeIndex) => {
          if (type?.name && type?.values?.length) {
            return type.values.map((value, index) => (
              <FilterTag
                key={`${type}-${index}`}
                name={type.name}
                value={value}
                onHandleClick={() => { 
                  type.values.splice(index, 1);
                  if(type.values?.length === 0) {
                    traitFilters.stringTraits.splice(typeIndex, 1);
                  }
                  refresh();
                }}
              />
            ))
          }
          return '';
        })
      }
      { 
        (
          queryFilters?.price?.priceFrom !== undefined || 
          queryFilters?.rarity?.rarityFrom !== undefined || 
          traitFilters?.stringTraits?.length > 0) && (
          <button
            type="button"
            className="text-xs text-white ml-1 hover:underline"
            onClick={() => {
              delete queryFilters.price;
              delete queryFilters.rarity;
              setIsFormReset(true)
            }}
          >
            Clear all filters
          </button>
        )
      }
    </div>
  );
}
