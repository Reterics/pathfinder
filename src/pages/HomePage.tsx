

const HomePage = () => {
    return (
        <div className="absolute z-50 w-full text-center text-white m-4 flex flex-col gap-y-2 bottom-px">
            <h1 className="text-xl font-bold pb-4">
                How can we start the journey?
            </h1>
            <button type="button"
                    className="w-28 self-center text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-zinc-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-3">
                Let's start
            </button>
        </div>
    )
};

export default HomePage;
