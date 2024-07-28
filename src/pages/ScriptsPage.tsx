import {useContext} from "react";
import {InjectedScript, ScriptStringKey} from "../types/scripts.ts";
import {BrowserContext} from "../components/BrowserContext.ts";
import PFButtonGroup from "../components/PFButtonGroup.tsx";
import {ButtonProps} from "../types/ui.ts";
import {downloadJSON, readTextFile} from "../utils/common.ts";
import PFButton from "../components/PFButton.tsx";
import { useDebouncedCallback } from 'use-debounce';
import {
    FaArrowDownLong,
    FaArrowUpLong,
    FaDownload,
    FaFile, FaFolderOpen,
    FaPenToSquare,
    FaTrashCan
} from "react-icons/fa6";


const ScriptsPage = () => {

    const context = useContext(BrowserContext);

    const entries = context?.data.entries || [];
    const setEntries = (data: InjectedScript[]) => {
        context?.setData('entries', data);
    };

    const updateEntry = useDebouncedCallback((index: number, key: ScriptStringKey, value: string) => {
        setEntries(entries.map((entry, _index) => {
            if (_index === index) {
                entry[key] = value;
            }
            return entry;
        }));
    }, 1000);

    const toggleHome = (index: number, checked?: boolean)=> {
        setEntries(entries.map((entry, _index) => {
            if (_index === index) {
                entry.onHome = checked
            }
            return entry;
        }));
    }


    const deleteEntry = (index: number) => {
        setEntries(entries.filter((_entry, _index) => {
            return _index !== index;
        }));
    };

    const buttons: ButtonProps[] = [
        {
            content: <FaFile />,
            onClick: async () => {
                setEntries([...entries, {
                    id: entries.length,
                    name: '',
                    content: '',
                    origin: 'http(s)?:\\/\\/.+\\.com',
                    keyBind: '',
                    onHome: false
                }])
            }
        },
        {
            content: <FaDownload />,
            onClick: async () => {
                downloadJSON(entries, `entries${new Date().getTime()}.json`);
            }
        },
        {
            content: <FaFolderOpen />,
            onClick: async () => {
                const file = await readTextFile();
                if (!file || typeof file.value !== 'string') return;

                let data;
                try {
                    data = JSON.parse(file.value);
                } catch (e) {
                    console.error(e);
                }

                if (!Array.isArray(data) || !data.length) return;

                setEntries(data.map((d, index) => {
                    if (typeof d.keyBind === 'string' &&
                        typeof d.content === 'string' && d.content && d.keyBind) {
                        return {
                            keyBind: d.keyBind,
                            content: d.content,
                            origin: d.origin,
                            name: d.name && typeof d.name === 'string' ? d.name : index.toString(),
                            onHome: d.onHome || false,
                            id: typeof d.id === "number" ? d.id : index + 1
                        } as InjectedScript
                    }
                    return null;
                }).filter(d => d) as InjectedScript[]);
            }
        }
    ];
    return (
        <div className="flex flex-col relative overflow-x-auto shadow-md h-full">
            <div className="flex-1">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-zinc-50 dark:bg-zinc-700 dark:text-gray-400">
                <tr>
                    <th scope="col" className="px-6 py-3">
                        Name
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Origin
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Keybind
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Home
                    </th>
                    <th scope="col" className="px-6 py-3">
                        Action
                    </th>
                </tr>
                </thead>
                <tbody>
                {entries.map((entry, index) => (
                    <tr className="odd:bg-white odd:dark:bg-zinc-900 even:bg-zinc-50 even:dark:bg-zinc-800 border-b dark:border-gray-700">
                        <th scope="row" className="p-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <input
                                id="name" type="text" defaultValue={entry.name}
                                className="bg-zinc-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Name" required
                                onChange={(e) => updateEntry(index, 'name', e.target.value)}
                            />
                        </th>
                        <td className="p-1">
                            <input
                                id="origin" type="text" defaultValue={entry.origin}
                                className="block p-2.5 h-[40px] w-full text-sm text-gray-900 bg-zinc-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Origin" required
                                onChange={(e) => updateEntry(index, 'origin', e.target.value)}
                            />
                        </td>
                        <td className="p-1">
                            <input id="keybind" type="text" defaultValue={entry.keyBind}
                                   className="bg-zinc-50 border border-zinc-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="Keybind" required
                                   onChange={(e) => updateEntry(index, 'keyBind', e.target.value)}/>
                        </td>
                        <td>
                            <label className="flex justify-center cursor-pointer">
                                <input type="checkbox" value="" className="sr-only peer"
                                       checked={!!entry.onHome} onChange={(e) => toggleHome(index, e.target.checked)}/>
                                <div
                                    className="relative w-9 h-5 bg-zinc-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-teal-800 rounded-full peer dark:bg-zinc-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-zinc-600 peer-checked:bg-teal-600"></div>

                            </label>
                        </td>
                        <td className="p-3 flex justify-center justify-items-center text-center">
                            <PFButton to={'/editor/' + entry.id}
                                      className="me-2">
                                <FaPenToSquare />
                            </PFButton>
                            <PFButton
                                className="me-2 p-1" >
                                <div className={'flex flex-row'}>
                                    <FaArrowUpLong />
                                    <FaArrowDownLong />
                                </div>
                            </PFButton>
                            <PFButton onClick={() => deleteEntry(index)}
                                      className="text-red-600" >
                                <FaTrashCan />
                            </PFButton>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
            </div>

            <div className="bg-white dark:bg-zinc-900 w-100 p-1 flex items-center justify-between flex-row-reverse">
                <PFButtonGroup buttons={buttons}/>
                <div className="inline-flex rounded-md shadow-sm" role="group">
                </div>
            </div>
        </div>
    )
};

export default ScriptsPage;
