import { NextResponse } from "next/server";
import { exec } from 'child_process';
import fs from 'fs';
import path, { parse } from 'path';

const executeFunction = async () => {
    const scriptPath = path.resolve('./src/app/api/cpu', 'performanceJson.py');
    return new Promise(async (resolve, reject) => {
        await exec(`python3 ${scriptPath}`, (error, stdout: any, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                resolve({ error: error });
                return;
            }
            resolve(stdout);

            console.log(`stdout: ${stdout}`);
        });
    })
}

export const GET = async () => {
    let output: any = '{}';

    await executeFunction().then((data) => {
        output = data;
    });
    return new NextResponse(output);
}