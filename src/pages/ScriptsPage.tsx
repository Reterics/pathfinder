import {useContext, useEffect, useState} from "react";
import {Link} from "react-router-dom";
import {InjectedScript, ScriptKeys} from "../types/scripts.ts";
import {BrowserContext} from "../components/BrowserContext.ts";


const ScriptsPage = () => {

    const context = useContext(BrowserContext);

    const [entries, setEntries] = useState<InjectedScript[]>([]);

    const updateEntry = (index: number, key: ScriptKeys, value: string) => {
        setEntries(entries.map((entry, _index) => {
            if (_index === index) {
                entry[key] = value;
            }
            return entry;
        }))
    };


    const deleteEntry = (index: number) => {
        setEntries([...entries.filter((_entry, _index) => {
            return _index !== index;

        })])
    };

    const refreshEntries = async ()=>{
        if (!context) return;

        const { entries } = await context.chrome.storage.local.get(["entries"]);

        setEntries(entries || []);
    }

    useEffect(()=> {
        void refreshEntries();
    }, []);

    return (
        <div className="relative overflow-x-auto shadow-md">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
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
                        Action
                    </th>
                </tr>
                </thead>
                <tbody>
                {entries.map((entry, index) => (
                    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                        <th scope="row" className="p-1 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <input
                                id="name" type="text"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Name" required onInput={() => updateEntry(index, 'name', entry.name)}
                            />
                        </th>
                        <td className="p-1">
                            <input
                                id="origin" type="text"
                                className="block p-2.5 h-[40px] w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="Origin" required onInput={() => updateEntry(index, 'origin', entry.origin || '')}
                            />
                        </td>
                        <td className="p-1">
                            <input id="keybind" type="text"
                                   className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="Keybind" required
                                   onInput={() => updateEntry(index, 'keyBind', entry.keyBind)}/>
                        </td>
                        <td className="p-6 flex justify-center justify-items-center text-center">

                            <Link to="`editor/${entry.id}`"
                                  className="flex w-auto place-content-center font-medium text-white hover:underline me-2">

                            </Link>
                            <a className="flex w-auto place-content-center font-medium text-red-600 dark:text-red-500 hover:underline"
                               onClick={() => deleteEntry(index)}></a>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>

            <div className="bg-white dark:bg-gray-900 w-100 p-1 flex items-center justify-between flex-row-reverse">
                <div className="inline-flex rounded-md shadow-sm" role="group">
                </div>
            </div>
        </div>
    )
};

export default ScriptsPage;
