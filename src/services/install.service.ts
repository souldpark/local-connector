import { injectable } from 'inversify';
import { Server, Socket } from 'socket.io';
import { exec } from 'child_process';
import fs from "fs";
import path from "path";

@injectable()
export class InstallService {
    private publicCertificate = path.join(process.cwd(), "lib", "local-connector.pem");
    private privateKey = path.join(process.cwd(), "lib", "local-connector-key.pem");
    private mkcert = path.join(process.cwd(), "lib", "mkcert.exe");

    constructor() {

    }

    public async install() {
        return new Promise((resolve: any, reject: any) => {

            fs.existsSync(path.join())
            const mkcertCommand = `${this.mkcert} -install -cert-file ${this.publicCertificate} -key-file ${this.privateKey} localhost`;

            // Execute the command
            exec(mkcertCommand, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error executing mkcert: ${error}`);
                    return;
                }
                console.log(`mkcert output:\n${stdout}`);
                console.error(`mkcert errors:\n${stderr}`);

                const privateKey = fs.readFileSync(`${this.privateKey}`, 'utf8');
                const certificate = fs.readFileSync(`${this.publicCertificate}`, 'utf8');
                resolve({ key: privateKey, cert: certificate })
            });

        })

    }


}