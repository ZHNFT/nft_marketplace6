import clsx from "clsx";

export default function FilterCheckbox(props) {
  const { form, isChecked, onHandleChange, traitType, traitValue, traitCount, traitRarity, traitTypeArrayHelpers, submitForm, ...rest } = props;

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
          onChange={({ target }) => onHandleChange({ target, traitType })}
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