import aboutRight from "../assets/about_right.png";

const AboutPage = () => {
    const version = __VERSION__
    const changelog = __CHANGELOG__
    const gitURL = __GITHUB_URL__
    return (
        <div className='relative p-1 ps-2 pe-2 bg-zinc-500 bg-opacity-90 h-full'>
            <div className="mt-1 flex flex-row flex-wrap space-x-6 bg-zinc-800 text-zinc-300 p-2">
                <div className="flex items-center text-sm">
                    {version}
                </div>
                <div className="flex items-center text-sm">
                    <a href={gitURL} target="_blank" rel="noopener noreferrer">{gitURL}</a>
                </div>
                <div className="flex items-center text-sm">
                    2024
                </div>
            </div>
            <div
                className="prose changelog mt-4 test-base"
            >
                {changelog.split('\n').map((line) =>
                    (<div className={line.startsWith('##') ? 'text-lg' : ''}>{line}</div>))}
            </div>

            <div className="absolute fill-height-webkit w-[180px] right-0 top-0">
                <img src={aboutRight}
                     className="absolute w-full pointer-events-none z-0 fill-height-webkit object-cover"
                     alt="Man"/>
            </div>
        </div>
    )
};

export default AboutPage;
