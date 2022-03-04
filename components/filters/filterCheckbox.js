import clsx from "clsx";

export default function FilterCheckbox(props) {
  const { field, form, traitType, traitValue, traitCount, placement, arrayHelpers, submitForm, ...rest } = props;
  const { name, value: formikValue } = field;

  const handleChange = event => {
    const { value } = event.target;
    const traitTypeIndex = formikValue?.findIndex(element => element?.name == traitType);

    if (!formikValue || traitTypeIndex === -1) {
      arrayHelpers.push({ name: traitType, values: [value] });
      submitForm();
      return;
    }
    const values = formikValue[traitTypeIndex].values;
    const traitValueIndex = values?.indexOf(rest.value);
    if (traitValueIndex === -1) {
      values.push(traitValue);
    } else {
      values.splice(traitValueIndex, 1);
    }
    values?.length === 0 
      ? arrayHelpers.remove(traitTypeIndex) 
      : arrayHelpers.replace(traitTypeIndex, { name: traitType, values });
    submitForm();
  };
  console.log(`traitValue`, traitValue)
  return (
    <div className="flex items-center">
      <input
        id={`filter-${placement}-${traitValue}`}
        value={traitValue}
        type="checkbox"
        onChange={handleChange}
        className="h-4 w-4 border-gray-300 rounded text-indigo-600 focus:ring-indigo-500"
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