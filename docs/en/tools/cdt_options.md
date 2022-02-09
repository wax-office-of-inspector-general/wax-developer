---
title: WAX-CDT Options
layout: default
nav_order: 110
parent: Tools & Topics
lang-ref: WAX-CDT Options
lang: en
---

Below is a list of common WAX-CDT tools and parameters. You can use these tools to generate WASM and ABI files for your smart contracts.

## eosio-abidiff
Compares the differences between two ABI files. A report prints out to the console.

```shell
USAGE: eosio-abidiff [options] [input file1] ... [input file2] ...
EXAMPLE: eosio-abidiff hello.abi old_hello.abi   

OPTIONS:

Generic Options:

  -help      - Display available options (-help-hidden for more)
  -help-list - Display list of available options (-help-list-hidden for more)
  -version   - Display the version of this program
```

## eosio-cpp
Generates WASM and ABI files for your smart contracts.

```shell
USAGE: eosio-cpp [options] [input file] ...
EXAMPLE: eosio-cpp -abigen wax.cpp -o wax.wasm

OPTIONS:
  -C                       - Include comments in preprocessed output
  -CC                      - Include comments from within macros in preprocessed output
  -D=[string]              - Define [macro] to [value] (or 1 if [value] omitted)
  -E                       - Only run the preprocessor
  -I=[string]              - Add directory to include search path
  -L=[string]              - Add directory to library search path
  -O=[string]              - Optimization level s, 0-3
  -S                       - Only run preprocess and compilation steps
  -U=[string]              - Undefine macro [macro]
  -W=[string]              - Enable the specified warning
  -c                       - Only run preprocess, compile, and assemble steps
  -dD                      - Print macro definitions in -E mode in addition to normal output
  -dI                      - Print include directives in -E mode in addition to normal outpu
  -dM                      - Print macro definitions in -E mode instead to normal output
  -emit-ast                - Emit Clang AST files for source inputs
  -emit-llvm               - Use the LLVM representation for assembler and object files
  -faligned-allocation     - Enable C++17 aligned allocation functions
  -fcoroutine-ts           - Enable support for the C++ Coroutines TS
  -finline-functions       - Inline suitable functions
  -finline-hint-functions  - Inline functions which are (explicitly or implicitly) marked inline
  -fmerge-all-constants    - Allow merging of constants
  -fno-cfl-aa              - Disable CFL Alias Analysis
  -fno-elide-constructors  - Disable C++ copy constructor elision
  -fno-lto                 - Disable LTO
  -fstack-protector        - Enable stack protectors for functions potentially vulnerable to stack smashing
  -fstack-protector-all    - Force the usage of stack protectors for all functions
  -fstack-protector-strong - Use a strong heuristic to apply stack protectors to functions
  -fstrict-enums           - Enable optimizations based on the strict definition of an enum's value range
  -fstrict-return          - Always treat control flow paths that fall off the end of a non-void function as unreachable
  -fstrict-vtable-pointers - Enable optimizations based on the strict rules for overwriting polymorphic C++ objects
  -include=[string]        - Include file before parsing
  -isysroot=[string]       - Set the system root directory (usually /)
  -l=[string]              - Root name of library to link
  -lto-opt=[string]        - LTO Optimization level (O0-O3)
  -o=[string]              - Write output to [file]
  -std=[string]            - Language standard to compile for
  -v                       - Show commands to run and use verbose output
  -w                       - Suppress all warnings

Generic Options:

  -help                    - Display available options (-help-hidden for more)
  -help-list               - Display list of available options (-help-list-hidden for more)
  -version                 - Display the version of this program
```

## eosio-init
Creates a smart contract template and directory structure. Includes CMake build scripts by default.

```shell
USAGE: eosio-init [options]
EXAMPLE: eosio-init -project wax

OPTIONS:

Generic Options:

  -help             - Display available options (-help-hidden for more)
  -help-list        - Display list of available options (-help-list-hidden for more)
  -version          - Display the version of this program

eosio-init:
generates an eosio smart contract project

  -bare             - produces only a skeleton smart contract without CMake support
  -path=[string]    - directory to place the project
  -project=[string] - output project name
```

## eosio-ld
WebAssembly linker.

```shell
USAGE: eosio-ld [options] [input file] ...

OPTIONS:

Generic Options:

  -help             - Display available options (-help-hidden for more)
  -help-list        - Display list of available options (-help-list-hidden for more)
  -version          - Display the version of this program

eosio.ld options:

  -L=[string]       - Add directory to library search path
  -fno-cfl-aa       - Disable CFL Alias Analysis
  -fno-lto          - Disable LTO
  -fno-post-pass    - Don't run post processing pass
  -fno-stack-first  - Don't set the stack first in memory
  -l=[string]       - Root name of library to link
  -lto-opt=[string] - LTO Optimization level (O0-O3)
  -o=[string]       - Write output to [file]
```

<!--### eosio-abigen

```bash
USAGE: eosio-abigen [options] <source0> [... <sourceN>]

OPTIONS:

Generic Options:

  -help                      - Display available options (-help-hidden for more)
  -help-list                 - Display list of available options (-help-list-hidden for more)
  -version                   - Display the version of this program

eosio-abigen:
generates an ABI from C++ project input

  -extra-arg=<string>        - Additional argument to append to the compiler command line
  -extra-arg-before=<string> - Additional argument to prepend to the compiler command line
  -output=<string>           - Set the output filename and fullpath
  -p=<string>                - Build path
```-->