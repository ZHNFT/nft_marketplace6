import { CrossIcon } from "../icons";

export default function FilterTag({ name, value, onHandleClick }) {
  return (
    <button
      type="button" className="tag text-xs py-2.5 px-4 rounded-md mr-4 mb-4"
      onClick={onHandleClick}
    >
      <span className="flex">
        <span className="text-white mr-2">{name}</span>
        <span className="text-manatee">{value}</span>
        <CrossIcon className="w-[10px] text-manatee ml-3" />
      </span>
    </button>
  );
};