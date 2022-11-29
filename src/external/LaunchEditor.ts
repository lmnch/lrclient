
import * as fs from 'fs/promises';
import { ChildProcess } from 'child_process';
const child_process = require('child_process');


var editor = process.env.EDITOR;

export class NoEditorSetError extends Error {

    constructor() {
        super("No editor was set! Please configure an editor with $EDITOR variable.");
    }
}

export async function launchEditor(data: string): Promise<string> {
    if (!editor) {
        throw new NoEditorSetError();
    }
    return new Promise((res: (arg0: string) => void, rej) => {
        fs.writeFile(".tmp", data).then(_ => {
            const child = child_process.spawn(editor, [".tmp"], {
                stdio: 'inherit'
            });
            child.on('exit', (e: Error, code: any) => {
                if (e) {
                    rej(e);
                }
                fs.readFile(".tmp").then((edited: Buffer) => {
                    fs.rm(".tmp");
                    res(edited.toString());
                });
            });
        });
    })
}