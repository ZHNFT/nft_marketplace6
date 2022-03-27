import clsx from "clsx";

export default function FilterCheckbox(props) {
  const { field, form, traitType, traitValue, traitCount, traitRarity, traitValueArrayHelpers, traitTypeArrayHelpers, submitForm, ...rest } = props;
  const { name, value: formikValue } = field;
  const traitTypeIndex = form?.values?.stringTraits?.findIndex(trait => {
    return trait?.name === traitType
  });
  const values = form?.values?.stringTraits && form?.values?.stringTraits[traitTypeIndex]?.values;
  const isChecked = values && values?.indexOf(rest.value) !== -1;

  const handleChange = event => {
    const { value, checked } = event.target;
    const currentValueIndex = values?.indexOf(rest.value);

    if (!form?.values?.stringTraits || form?.values?.stringTraits?.length === 0 || !form?.values?.stringTraits[traitTypeIndex]) {
      traitTypeArrayHelpers.push({ name: traitType, values: [ value ] });
      submitForm();
      return;
    }

    if (traitTypeIndex !== -1 && checked) {
      traitValueArrayHelpers.push(value)
      submitForm();
      return;
    }

    if (traitTypeIndex !== -1 && !checked) {
      traitValueArrayHelpers.remove(currentValueIndex);
      if (values?.length -1 === 0) {
        traitTypeArrayHelpers.remove(traitTypeIndex);
      }
      submitForm();
      return;
    }
  };

  return (
    <div className={clsx(
      'flex relative overflow-hidden items-center rounded-md py-1.5 px-3 my-1 border-[0.5px] hover:border-cornflower',
      isChecked ? 'border-cornflower after:bg-cornflower after:block after:m-auto after:w-[3px] after:h-full after:absolute after:left-0 after:top-0 after:bottom-0' : 'border-transparent'
    )}>
      <label
        className="text-xs flex w-full items-center cursor-pointer"
      >
        <input
          id={`filter-${traitValue}`}
          value={traitValue}
          type="checkbox"
          onChange={handleChange}
          className="absolute -left-[999px]"
          checked={isChecked}
          {...rest}
        />
        <span className="flex-1 max-w-[108px]">
          <span className="text-manatee text-xxs truncate">{ traitType }</span>
          <span className="block truncate">{ traitValue }</span>
        </span>
        <span className={clsx(
          'w-[30px] ml-1 text-center shrink-0',
          isChecked ? 'text-white' : 'text-manatee'
        )}>
          { traitRarity }
        </span>
        <span className={clsx(
          'w-[30px] ml-1 text-center shrink-0',
          isChecked ? 'text-white' : 'text-manatee'
        )}>
          { traitCount }
        </span>
      </label>
    </div>
  );
};