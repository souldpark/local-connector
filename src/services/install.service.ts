import { injectable } from 'inversify';
import { Server, Socket } from 'socket.io';
import fs from "fs";
import path from "path";
import { createCA, createCert } from "mkcert";
import forge from 'node-forge';
import sudo from 'sudo-prompt';

@injectable()
export class InstallService {
    private publicCertificate = path.join(process.cwd(), "lib", "local-connector.pem");
    private privateKey = path.join(process.cwd(), "lib", "local-connector-key.pem");
    private mkcert = path.join(process.cwd(), "lib", "mkcert");

    constructor() {

    }

    public async install() {
        return new Promise(async (resolve: any, reject: any) => {
            const ca = await createCA({
                organization: "AddLayer LLC",
                countryCode: "US",
                state: "Delaware",
                locality: "Delaware",
                validity: 365
            });

            const passphrase = "34518147";

            const p12Asn1 = forge.pkcs12.toPkcs12Asn1(
                forge.pki.privateKeyFromPem(ca.key),
                [forge.pki.certificateFromPem(ca.cert)],
                passphrase
            )

            const p12Der = forge.asn1.toDer(p12Asn1).getBytes();

            let startPath = process.env.INIT_CWD;

            if (!startPath) {
                startPath = __dirname;
            }

            if (!fs.existsSync(`${startPath}/certificates`)) {
                fs.mkdirSync(`${startPath}/certificates`);
            }

            fs.writeFileSync(`${startPath}/certificates/ca.pfx`, p12Der, { encoding: 'binary' });



            // const importCommand = `certutil -importpfx -p "${passphrase}" -f "${process.env.INIT_CWD}/certificates/ca.pfx"`;
            // sudo.exec(importCommand, {
            //     name: 'Local Connector',
            // })


            const cert = await createCert({
                ca: { key: ca.key, cert: ca.cert },
                domains: ["localhost", "127.0.0.1"],
                organization: "SouldPark",
                validity: 365
            });

            resolve({ key: cert.key, cert: cert.cert })

            //             fs.existsSync(path.join())
            //             const mkcertCommand = `sudo ${this.mkcert} -install -cert-file ${this.publicCertificate} -key-file ${this.privateKey} localhost`;
            // console.log(mkcertCommand)
            //             // Execute the command
            //             exec(mkcertCommand, (error, stdout, stderr) => {
            //                 if (error) {
            //                     console.error(`Error executing mkcert: ${error}`);
            //                     return;
            //                 }
            //                 console.log(`mkcert output:\n${stdout}`);
            //                 console.error(`mkcert errors:\n${stderr}`);
            // //sudo /home/mpanichella/TeamProjects/SouldPark/local-connector/lib/mkcert -install -cert-file /home/mpanichella/TeamProjects/SouldPark/local-connector/lib/local-connector.pem -key-file /home/mpanichella/TeamProjects/SouldPark/local-connector/lib/local-connector-key.pem localhost

            //             });

        })

    }


}