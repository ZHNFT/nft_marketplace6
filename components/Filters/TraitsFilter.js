import { useState } from 'react';
import { Disclosure, RadioGroup, Transition } from '@headlessui/react';
import { Field, FieldArray } from 'formik';
import RangeField from '../Forms/RangeField';
import { ArrowIcon, DiamondIcon } from '../icons';
import Slider from '../Slider/Slider';
import FilterCheckbox from './FilterCheckbox';

export default function TraitsFilter({ formValues, setFieldValue, filters, submitForm }) {
  const [selectedTraitType, setSelectedTraitType] = useState(null);

  const handleChange = ({ target, traitTypeIndex, traitType, traitTypeArrayHelpers }) => {
    const { value, checked } = target;
    const values = formValues?.stringTraits && formValues?.stringTraits[traitTypeIndex]?.values;
    const currentValueIndex = values?.indexOf(value);

    if (!formValues?.stringTraits || formValues?.stringTraits?.length === 0 || !formValues?.stringTraits[traitTypeIndex]) {
      traitTypeArrayHelpers.push({ name: traitType, values: [ value ] });
      submitForm();
      return;
    }

    if (traitTypeIndex !== -1 && checked) {
      formValues?.stringTraits[traitTypeIndex].values.push(value);
      setFieldValue('stringTraits', formValues?.stringTraits);
      submitForm();
      return;
    }

    if (traitTypeIndex !== -1 && !checked) {
      formValues?.stringTraits[traitTypeIndex].values.splice(currentValueIndex, 1);
      if (values?.length === 0) {
        formValues?.stringTraits.splice(traitTypeIndex, 1);
      }
      setFieldValue('stringTraits', formValues?.stringTraits);
      submitForm();
      return;
    }
  };

  return (
    <Disclosure as="div" className="mt-8 min-w-[200px]" defaultOpen>
      {({ open }) => (
        <>
          <Disclosure.Button className="text-xs w-full text-left pb-4 flex justify-between items-start">
            Traits
            <ArrowIcon type={ open ? 'up' : 'down' } className="dark:text-manatee text-frost w-[8px] mr-1.5 relative bottom-0.5" />
          </Disclosure.Button>

          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-95 opacity-0"
            enterTo="transform scale-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-100 opacity-100"
            leaveTo="transform scale-95 opacity-0"
          >
            <Disclosure.Panel static>
              {filters?.length && (
                <>
                  <Slider className="mb-4" arrowSize="sml">
                    <RadioGroup
                      value={selectedTraitType}
                      onChange={setSelectedTraitType}
                    >
                      <div className="flex items-start h-full">
                        {filters.map((traitType, index) => (
                          <RadioGroup.Option
                            key={index}
                            value={{...traitType, index}}
                            className={({ checked }) =>
                              `${
                                (checked || selectedTraitType?.type === traitType.type) ? 'border-cornflower after:bg-cornflower after:block after:m-auto after:w-full after:h-[3px] after:absolute after:left-0 after:right-0 after:bottom-0' : 'border-white'
                              } h-full relative min-w-[50px] no-shrink w-auto overflow-hidden mx-1 first:ml-0 bg-black/[0.05] dark:bg-white/[0.05] text-ink dark:text-white last:mr-0 text-xs rounded-md px-3 py-2 cursor-pointer flex border-[0.5px] hover:border-cornflower`
                            }
                          >
                            {({ checked }) => (
                              <div className="flex flex-col items-center w-full">
                                <RadioGroup.Label
                                  as="p"
                                  className="text-center font-medium leading-1"
                                >
                                  { traitType.type }
                                </RadioGroup.Label>
                                <span className="dark:text-manatee text-frost text-xs">{ traitType.traitCount }</span>
                              </div>
                            )}
                          </RadioGroup.Option>
                        ))}
                      </div>
                    </RadioGroup>
                  </Slider>
                  {
                    selectedTraitType && selectedTraitType.attributes?.length > 0 ? (
                      <>
                        <div className="flex text-xs px-3">
                          <div className="flex-1" />
                          <div className="text-center w-[30px] ml-1">
                            <span className="sr-only">Rarity</span>
                            <DiamondIcon className="w-[15px] relative -left-[2px]" />
                          </div>
                          <div className="w-[30px] text-center dark:text-manatee text-frost ml-1">
                            <button type="button">
                              <span className="sr-only">count</span> #
                              <span className="inline-block w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-manatee mb-[1px] ml-1" />
                            </button>
                          </div>
                        </div>
                        <div className="max-h-[260px] overflow-y-auto scroller -mr-[10px]">
                          <div className="mr-[10px]">
                            <FieldArray name={`stringTraits`}>
                              {(traitTypeArrayHelpers) => (
                                <>
                                  <Field 
                                    name={`stringTraits.${selectedTraitType.index}.name`}
                                    hidden
                                    value={selectedTraitType.type}
                                  />
                                  <FieldArray name={`stringTraits.${selectedTraitType.index}.values`}>
                                    {() => {
                                      const traitTypeIndex = formValues.stringTraits?.findIndex(trait => {
                                        return trait?.name === selectedTraitType.type
                                      });
                                      return (
                                        <>
                                          {selectedTraitType.attributes.map(({ id, value, count, rarityRank }) => {
                                            const values = formValues?.stringTraits && formValues?.stringTraits[traitTypeIndex]?.values;
                                            return (
                                              <Field
                                                key={`filter-${selectedTraitType.type}-${value}-${id}`}
                                                component={FilterCheckbox}
                                                name={`stringTraits.${selectedTraitType.index}.values.${id}`}
                                                traitValue={value}
                                                traitCount={count}
                                                traitType={selectedTraitType.type}
                                                traitRarity={rarityRank}
                                                traitTypeArrayHelpers={traitTypeArrayHelpers}
                                                value={value}
                                                submitForm={submitForm}
                                                isChecked={values ? values?.indexOf(value) !== -1 : false}
                                                onHandleChange={args => handleChange({ ...args, traitTypeIndex, traitTypeArrayHelpers })}
                                              />
                                            );
                                          })}
                                        </>
                                      );
                                    }}
                                  </FieldArray>
                                </>
                              )}
                            </FieldArray>
                          </div>
                        </div>
                      </>
                    )
                    : (
                      <>
                        { selectedTraitType && selectedTraitType.maxValue > selectedTraitType.minValue && (
                          <RangeField
                            step={1}
                            min={selectedTraitType.minValue}
                            max={selectedTraitType.maxValue}
                            initialValues={[selectedTraitType.minValue, selectedTraitType.maxValue]}
                            isDate={selectedTraitType.display_type === 'date'}
                            onChange={([min, max]) => console.log(min, max)}
                          />
                        )}
                      </>
                    )
                  }
                </>
              )}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}