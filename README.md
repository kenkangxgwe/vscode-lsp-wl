# Visual Studio Code Client for Wolfram Language Server

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> by [kenkangxgwe](https://github.com/kenkangxgwe) and [hxianglong](https://github.com/huxianglong)

<!-- markdown-toc start - Don't edit this section. Run M-x markdown-toc-refresh-toc -->
**Table of Contents**

- [Visual Studio Code Client for Wolfram Language Server](#visual-studio-code-client-for-wolfram-language-server)
  - [Installation](#installation)
  - [Installation](#installation-1)
  - [Client Settings](#client-settings)
  - [Features](#features)
  - [Footnotes](#footnotes)

<!-- markdown-toc end -->

*Please be advised to git pull the lastest minor version __0.2.x__. There are some
breaking changes you want to know more in the server's
[README](https://github.com/kenkangxgwe/lsp-wl/blob/master/README.md).*

**Wolfram Language Server (WLServer)** is an implementation of the Microsoft's
[Language Server Protocol
(LSP)](https://microsoft.github.io/language-server-protocol) for [Wolfram
Language](http://www.wolfram.com/language). This server is
implemented in Wolfram Language itself.

This is the client-side code for VS Code, which is based on some slight
modifications of [Microsoft's LSP
example](https://github.com/Microsoft/vscode-extension-samples/tree/master/lsp-sample).
However, you still need to manually install the
[server](https://github.com/kenkangxgwe/lsp-wl) .

## Installation

## Installation

0. [Wolfram Mathematica](http://www.wolfram.com/mathematica/) (11.2 or higher<a
    name="ref1"></a>[<sup>1</sup>](#footnote1)) or [Wolfram
    Engine](https://www.wolfram.com/engine/) (12.0 or higher).

1. Download the [server](https://github.com/kenkangxgwe/lsp-wl) from its
   repository.

    ```
    git clone https://github.com/kenkangxgwe/lsp-wl.git
    ```

2. Install the dependent paclets with the correct versions from the Wolfram kernel / Mathematica.
(_This will cost a while for the first time_) :  
    ``` mathematica
    PacletInstall[{"AST", "0.11"}, "Site" -> "http://pacletserver.wolfram.com", "UpdateSites" -> True]
    PacletInstall[{"Lint", "0.11"}, "Site" -> "http://pacletserver.wolfram.com", "UpdateSites" -> True]
    ```

3. Install the client extenstion from [Visual Studio Marketplace: Wolfram
Language Server](https://marketplace.visualstudio.com/items?itemName=lsp-wl.lsp-wl-client).

## Client Settings

Once you have installed the extension, a few settings have to be done manually
in the client side to make things work.

After the extension is launched, go to **Preference -> Settings -> User Settings
-> Extensions -> Wolfram Language Server**, and configure the following options:

- *Port:* The client communicates with the server through port. Feel free to use
  any port that is not occupied by other processes.

- *WLServer Path:* The path to the server repository.

- *Wolfram Path:* The path of the `Wolfram` executable. **(NOT `Mathematica` or `WolframKernel`)**  
  For **Windows** users, the default path is `C:\Program Files\Wolfram
  Research\Mathematica\11.*\wolfram.exe`.  
  For **MaxOS** users, the default path is
  `/Applications/Mathematica.app/Contents/MacOS/wolfram`.  
  For **Linux** users, the default path is
  `/usr/local/Wolfram/Mathematica/11.*/wolfram`.

Restart VS Code to take effect.

## Features

- **DocumentSymbol:** You may typeset your package in the same way that
  Mathematica FrontEnd handles it: a cell begins with two lines of comments,
  where the first line specifies the style of the cell and the second line names it.
  So you may get the outline structure of the file.
  
  ``` mathematica
  (* ::Title:: *)
  (*Title of the file*)

  (* ::Section:: *)
  (*Section 1*)
  ```
  
  ![hover](https://raw.githubusercontent.com/kenkangxgwe/lsp-wl/master/images/documentSymbol.png)

- **Hover:** Provide documentations for functions and variables from the
  ``System` `` context, such as `String` and `$Path`, the `MessageName` and
  the special numerical literals with `^^` or `*^`.

  ![hover](https://raw.githubusercontent.com/kenkangxgwe/lsp-wl/master/images/hover.png)

- **Completion:** The completion is shown by the client automatically.
  Functions and system variables from the ``System` `` context that matches the
  input would be displayed. To enter an unicode character, you may use the
  leader key <kbd>\\</kbd> followed by the alias just like <kbd>esc</kbd> in
  Wolfram FrondEnd. E.g., `<esc>a` in the FrontEnd is input as `\a` in the
  editor and the server will show you the available completions.

  ![completion-unicode](https://raw.githubusercontent.com/kenkangxgwe/lsp-wl/master/images/completion_alias.png)

- **Completion Resolve:** Further information (such as documentation) would be
  provided for the items in the list.

  ![completion](https://raw.githubusercontent.com/kenkangxgwe/lsp-wl/master/images/completion.png)

- **Diagnostics:** Syntax error would be underlined. This feature is powered by
  Brenton's `AST` and `Lint` paclets, thank you
  [@bostick](https://github.com/bostick).

  ![diagnostics](https://raw.githubusercontent.com/kenkangxgwe/lsp-wl/master/images/diagnostics.png)


This is an early release, so more features are on the way. Notice that,
syntax highlight will NOT be provided as long as it is excluded in the LSP,
but there are already some good enough extensions written [by Flip
Phillips](https://marketplace.visualstudio.com/items?itemName=flipphillips.wolfram-language)
and
[by shigma](https://marketplace.visualstudio.com/items?itemName=shigma.vscode-wl).

## Footnotes

<a name="footnote1"> </a> **[1]** `SocketListen[]` is used for server-client
communication, which is introduced since 11.2. [^](#ref1)
