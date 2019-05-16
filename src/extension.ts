"use strict";

import { workspace, ExtensionContext, Disposable, WorkspaceConfiguration } from "vscode";
import {
    LanguageClient, LanguageClientOptions,
    NodeModule,
    TransportKind
} from "vscode-languageclient";
import getPort = require("get-port");


export async function activate(context: ExtensionContext): Promise<void> {

    const config: WorkspaceConfiguration = workspace.getConfiguration("WolframLanguageServer");
    let wolframkernel: string = config.get<string>("WolframPath");
    let wlServerDir: string = config.get<string>("WLServerPath");
    if (wlServerDir[-1] !== "\\" && wlServerDir[-1] !== "/") {
        wlServerDir += "/";
    }

    let socketport: number = Number(config.get<number>("Port"));
    socketport = await getPort({port: socketport}).then((port: number): number => {
        if(port !== socketport) {
            console.log("${socketport} is currently in use. Using ${port} instead.");
        }
        return port;
    });

    let serverOptions: NodeModule = {
        module: wlServerDir + "init.wls",
        runtime: wolframkernel,
        // transport: TransportKind.pipe,
        transport: {
            kind: TransportKind.socket,
            port: socketport
        },
        options: {
            execArgv: ["-script"]
        }
    };

    let clientOptions: LanguageClientOptions = {
        documentSelector: ["wolfram"],
        synchronize: {
            fileEvents: workspace.createFileSystemWatcher("**/*.*")
        }
    };

    // create the language client and start the client.
    let client: LanguageClient = new LanguageClient("WolframLanguageServer", "Wolfram Language Server", serverOptions, clientOptions);

    let disposable: Disposable = client.start();

    // push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}
