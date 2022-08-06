"use strict";

import net = require("net");

import {
    workspace, ExtensionContext, Disposable, WorkspaceConfiguration
} from "vscode";

import {
    LanguageClient, LanguageClientOptions,
    NodeModule,
    StreamInfo,
    TransportKind
} from "vscode-languageclient/node";

import {
    debug, DebugSession, DebugConfigurationProvider, DebugAdapterDescriptorFactory,
    DebugAdapterDescriptor, DebugAdapterServer, ProviderResult
} from "vscode";

import getPort = require('get-port');

let client: LanguageClient;

export async function activate(context: ExtensionContext): Promise<void> {

    const config: WorkspaceConfiguration = workspace.getConfiguration("WolframLanguageServer");
    let wolframkernel: string = config.get<string>("WolframPath");
    let wlServerDir: string = config.get<string>("WLServerPath");
    if (wlServerDir[-1] !== "\\" && wlServerDir[-1] !== "/") {
        wlServerDir += "/";
    }

    const defaultSocketPort: number = Number(config.get<number>("Port"));
    let socketPort = await getPort({ port: defaultSocketPort });
    if (socketPort !== defaultSocketPort) {
        console.log("${defaultSocketPort} is currently in use. Using ${socketPort} instead.");
    }

    let serverOptions: NodeModule = {
        module: wlServerDir + "init.wls",
        runtime: wolframkernel,
        transport: {
            kind: TransportKind.socket,
            port: socketPort
        },
        options: {
            execArgv: ["-script"]
        }
    };

    const debuggerPort: number = await getPort();
    const mitigatedDiagnostics: [string] = config.get<[string]>("Diagnostics.mitigated");
    const suppressedDiagnostics: [string] = config.get<[string]>("Diagnostics.suppressed");
    let clientOptions: LanguageClientOptions = {
        documentSelector: ["wolfram"],
        initializationOptions: {
            debuggerPort: debuggerPort,
            diagnosticsOverrides: {
                mitigated: mitigatedDiagnostics,
                suppressed: suppressedDiagnostics
            }
        }
    };

    // push the disposable to the context's subscriptions so that the
    // client can be deactivated on extension deactivation

    // create the language client and start the client.
    client = new LanguageClient("WolframLanguageServer",
        "Wolfram Language Server", serverOptions, clientOptions);
    // register debug type "dap-wl"
    context.subscriptions.push(debug.registerDebugConfigurationProvider("dap-wl",
        new WolframDebugConfigProvider()));
    context.subscriptions.push(debug.registerDebugAdapterDescriptorFactory("dap-wl",
        new WolframDebugAdapterDescriptorFactory(debuggerPort)));

    client.start();
}

export function deactivate(): Thenable<void> | undefined {
    if (!client) {
        return undefined;
    }
    return client.stop();
}

class WolframDebugConfigProvider implements DebugConfigurationProvider { }

class WolframDebugAdapterDescriptorFactory implements DebugAdapterDescriptorFactory {

    port: number;

    constructor(port: number) {
        this.port = port;
    }

    createDebugAdapterDescriptor(_session: DebugSession, _executable:
        undefined): ProviderResult<DebugAdapterDescriptor> {
        return new DebugAdapterServer(this.port);
    }

}