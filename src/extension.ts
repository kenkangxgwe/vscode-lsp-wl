"use strict";

import {
    workspace, ExtensionContext, Disposable, WorkspaceConfiguration
} from "vscode";

import {
    LanguageClient, LanguageClientOptions,
    NodeModule,
    TransportKind
} from "vscode-languageclient";

import {
    debug, DebugSession, DebugConfigurationProvider, DebugAdapterDescriptorFactory,
    DebugAdapterDescriptor, DebugAdapterServer, ProviderResult
} from "vscode";

import getPort = require('get-port');

export async function activate(context: ExtensionContext): Promise<void> {

    const config: WorkspaceConfiguration = workspace.getConfiguration("WolframLanguageServer");
    let wolframkernel: string = config.get<string>("WolframPath");
    let wlServerDir: string = config.get<string>("WLServerPath");
    if (wlServerDir[-1] !== "\\" && wlServerDir[-1] !== "/") {
        wlServerDir += "/";
    }

    let socketport: number = Number(config.get<number>("Port"));
    socketport = await getPort({ port: socketport }).then((port: number): number => {
        if (port !== socketport) {
            console.log("${socketport} is currently in use. Using ${port} instead.");
        }
        return port;
    });

    let serverOptions: NodeModule = {
        module: wlServerDir + "init.wls",
        runtime: wolframkernel,
        // args: ["--theme=" + theme],
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
            // fileEvents: workspace.createFileSystemWatcher("**/*.*")
        }
    };

    // create the language client and start the client.
    let client: LanguageClient = new LanguageClient("WolframLanguageServer", "Wolfram Language Server", serverOptions, clientOptions);

    let disposable: Disposable = client.start();

    // register debug type "lsp-wl"

    context.subscriptions.push(debug.registerDebugConfigurationProvider("dap-wl", new WolframDebugConfigProvider()));
    context.subscriptions.push(debug.registerDebugAdapterDescriptorFactory("dap-wl", new WolframDebugAdapterDescriptorFactory()));
    // push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation
    context.subscriptions.push(disposable);
}

class WolframDebugConfigProvider implements DebugConfigurationProvider { }

class WolframDebugAdapterDescriptorFactory implements DebugAdapterDescriptorFactory {

    createDebugAdapterDescriptor(session: DebugSession, executable: undefined): ProviderResult<DebugAdapterDescriptor> {
        if (typeof session.configuration.port === "number") {
            return new DebugAdapterServer(session.configuration.port);
        }
        return executable;
    }

}