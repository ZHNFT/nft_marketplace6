export default function SearchBar() {
    return(
        <div className="flex justify-left">
            <div className="mb-3 w-3/4">
                <input
                type="search"
                class="
                    form-control
                    block
                    w-full
                    px-3
                    py-1.5
                    text-base
                    font-normal
                    text-gray-700
                    bg-white bg-clip-padding
                    border border-solid border-gray-300
                    rounded
                    transition
                    ease-in-out
                    m-0
                    focus:text-gray-700 focus:bg-white focus:border-amber-400 focus:outline-none"
                id="exampleSearch"
                placeholder="Type query"
                />
            </div>
            <button className="mb-3 w-1/4 text-center text-amber-400 hover:text-amber-600"> Sort </button>
        </div>
    )
}