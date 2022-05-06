import { CrossIcon } from "../icons";

export default function FilterTag({ name, value, onHandleClick }) {
  return (
    <button
      type="button" className="tag bg-lightShade text-xs py-2.5 px-4 rounded-md mr-4 mb-4"
      onClick={onHandleClick}
    >
      <span className="flex">
        <span className="dark:text-white text-ink mr-2">{name}</span>
        <span className="dark:text-manatee text-frost">{value}</span>
        <CrossIcon className="w-[10px] dark:text-manatee text-frost ml-3" />
      </span>
    </button>
  );
};