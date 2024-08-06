import {NestedObject, SearchStack, TextFile} from "../types/scripts.ts";

export const getAllValuesByPath = (obj: NestedObject|typeof globalThis, path: string): unknown => {
    const keys = path.split('.');
    const results = [];
    const stack: SearchStack[] = [{ obj, index: 0 }];

    while (stack.length > 0) {
        const { obj, index } = stack.pop() as SearchStack;

        if (index === keys.length) {
            results.push(obj);
            continue;
        }

        const key = keys[index];

        if (Array.isArray(obj)) {
            for (const item of obj) {
                stack.push({ obj: item, index });
            }
        } else if (obj && typeof obj === 'object' && key in obj) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            stack.push({ obj: obj[key], index: index + 1 });
        }
    }

    return results;
};

export const getFunctionFromString = (path: string, base = window): null|(()=>void) => {
    // Split the path into its parts
    const pathParts = path.split('.');

    // Use reduce to traverse the window object based on the path parts
    const func = pathParts.reduce((acc, part) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        return acc && acc[part];
    }, base);

    // Check if the result is indeed a function
    if (typeof func !== 'function') {
        // console.warn(`Path ${path} does not resolve to a function`);
        return null;
    }

    return func;
}

export const downloadFile = (content: string, filename: string, type = "application/json") => {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}


export const downloadJSON = (jsonObject: object, filename: string) => {
    downloadFile(JSON.stringify(jsonObject), filename, "application/json");
}


export const uploadFileInputAsText = (file: Blob): Promise<string|ArrayBuffer|null> => {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function (): void {
            resolve(reader.result);
        };
        reader.readAsText(file);
        reader.onerror = function (error): void {
            console.log('Error: ', error);
        };
    })
};

export const readTextFile = (accept = 'application/json'): Promise<TextFile> => {
    return new Promise(resolve => {
        const fileInput = document.createElement("input");
        fileInput.classList.add("readTextFile");
        fileInput.setAttribute("type", "file");
        if (accept) {
            fileInput.setAttribute('accept', accept);
        }
        fileInput.onchange = async function (): Promise<void> {
            const formData: TextFile = {
                value: ''
            };
            const files = fileInput.files as FileList;
            if (files && files.length) {
                formData.value = await uploadFileInputAsText(files[0]);
                formData.file_input = files[0];
            }
            fileInput.outerHTML = "";
            resolve(formData);
        };
        document.body.appendChild(fileInput);
        fileInput.click();
    });
}


export const readJSONFile = async (): Promise<object|null> => {
    const file = await readTextFile();
    if (!file || !file.value || typeof file.value !== 'string') {
        return null;
    }

    let json = null;

    try {
        json = JSON.parse(file.value)
    } catch (err) {
        console.error(err);
    }

    if (!json) {
        return null;
    }

    return json;
}
