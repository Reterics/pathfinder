import {useContext, useEffect, useState} from "react";
import {InjectedScript, ScriptKeys} from "../types/scripts.ts";
import {BrowserContext} from "../components/BrowserContext.ts";
import PFButtonGroup from "../components/PFButtonGroup.tsx";
import {ButtonProps} from "../types/ui.ts";
import {downloadJSON, readTextFile} from "../utils/common.ts";
import PFButton from "../components/PFButton.tsx";
import { useDebouncedCallback } from 'use-debounce';


const ScriptsPage = () => {

    const context = useContext(BrowserContext);

    const [entries, setEntries] = useState<InjectedScript[]>([]);

    const saveEntriesInStore = async () => context?.chrome.storage.local.set({entries:entries});
    const updateEntry = useDebouncedCallback((index: number, key: ScriptKeys, value: string) => {
        setEntries(entries.map((entry, _index) => {
            if (_index === index) {
                entry[key] = value;
            }
            return entry;
        }));
        saveEntriesInStore();
    }, 1000);


    const deleteEntry = (index: number) => {
        setEntries([...entries.filter((_entry, _index) => {
            return _index !== index;
        })]);
        saveEntriesInStore();
    };

    const loadEntriesFromStore = async ()=>{
        if (!context) return;

        const { entries } = await context.chrome.storage.local.get(["entries"]);

        setEntries(entries || []);
    }

    useEffect(()=> {
        void loadEntriesFromStore();
    }, []);

    const buttons: ButtonProps[] = [
        {
            content: 'Add',
            onClick: async () => {
                setEntries([...entries, {
                    id: entries.length,
                    name: '',
                    content: '',
                    origin: 'http(s)?:\\/\\/.+\\.com',
                    keyBind: ''
                }])
            }
        },
        {
            content: 'Download',
            onClick: async () => {
                downloadJSON(entries, `entries${new Date().getTime()}.json`);
            }
        },
        {
            content: 'Load',
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
                            id: typeof d.id === "number" ? d.id : index + 1
                        } as InjectedScript
                    }
                    return null;
                }).filter(d => d) as InjectedScript[]);
            }
        },
        {
            content: 'Clear',
            onClick: async () => {
                setEntries([]);
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
                                   className="bg-zinc-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-zinc-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                   placeholder="Keybind" required
                                   onChange={(e) => updateEntry(index, 'keyBind', e.target.value)}/>
                        </td>
                        <td className="p-6 flex justify-center justify-items-center text-center">


                            <PFButton to={'/editor/' + entry.id}
                                  className="me-2" content="Edit" />
                            <PFButton onClick={() => deleteEntry(index)} content="Remove"
                                className="text-red-600"/>
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
