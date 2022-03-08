import clsx from "clsx";

export default function FilterCheckbox(props) {
  const { field, form, traitType, traitValue, traitCount, placement, traitValueArrayHelpers, traitTypeArrayHelpers, submitForm, ...rest } = props;
  const { name, value: formikValue } = field;
  const traitTypeIndex = form?.values?.stringTraits?.findIndex(trait => {
    return trait?.name === traitType
  });
  const values = form?.values?.stringTraits && form?.values?.stringTraits[traitTypeIndex]?.values;

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
    <div className="flex items-center">
      <input
        id={`filter-${placement}-${traitValue}`}
        value={traitValue}
        type="checkbox"
        onChange={handleChange}
        className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
        checked={values && values?.indexOf(rest.value) !== -1}
        {...rest}
      />
      <label
        htmlFor={`filter-${placement}-${traitValue}`}
        className={clsx("ml-3", {
          'text-sm dark:text-slate-200 text-gray-600': placement === 'desktop',
          'min-w-0 dark:text-slate-200 flex-1 text-gray-500': placement === 'mobile',
        })}
      >
        {traitValue}
      </label>
      <span className={clsx("ml-auto", {
        'dark:text-slate-200 text-gray-500': placement === 'mobile',
        'text-sm dark:text-slate-200 text-gray-600': placement === 'desktop',
      })}>
        {traitCount}
      </span>
    </div>
  );
};