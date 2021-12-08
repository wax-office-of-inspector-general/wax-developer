---
title: WAX-CDT Sample Contracts
layout: default
nav_order: 52
parent: WAX Contract Development Toolkit
grand_parent: dApp Development
---

WAX-CDT provides a **wax-cdt/examples** directory that includes the following sample smart contracts:

- Hello World
- multi_index Example
- Inline Transaction Example

Each project includes two **CMakeLists.txt** files: one in the project's root directory, and the other in the projects **src** directory. You can use these files to automatically generate WASM and ABI files for the sample projects.

In this tutorial, you'll learn how to use the **make** scripts to build the Hello World example.

<strong>Note:</strong> These samples were created with **eosio-init** (part of the [WAX-CDT Options](/wax-docs/dev-docs/cdt_options) suite of tools). Refer to [Create a Smart Contract](/wax-docs/dev-docs/dapp_hello_world) to customize these scripts for your smart contracts.
{: .label .label-yellow }

## Compile Hello World

To compile the Hello World example:

1. From the command line, navigate to **wax-cdt/examples/hello**.

    ```shell
    cd wax-cdt/examples/hello
    ```

2. Create a **build** directory.

    ```shell
    mkdir build
    ```

    <strong>Note:</strong> By default, <strong>eosio-init</strong> creates a build directory. Because this directory is empty, it's not uploaded to Git. If you use <strong>eosio-init</strong> to [Create a Smart Contract](/wax-docs/dev-docs/dapp_hello_world), you'll be able to skip this step. 
    {: .label .label-yellow }

3. Navigate to the **build** directory.

    ```shell
    cd build
    ```

4. Initialize cmake from the **wax-cdt/examples/hello** directory to write the necessary build files to the **build** directory.

    ```shell
    cmake ..
    ```

    The console prints the following build tasks:

    ```shell
    -- The C compiler identification is GNU 7.4.0
    -- The CXX compiler identification is GNU 7.4.0
    -- Check for working C compiler: /usr/bin/cc
    -- Check for working C compiler: /usr/bin/cc -- works
    -- Detecting C compiler ABI info
    -- Detecting C compiler ABI info - done
    -- Detecting C compile features
    -- Detecting C compile features - done
    -- Check for working CXX compiler: /usr/bin/c++
    -- Check for working CXX compiler: /usr/bin/c++ -- works
    -- Detecting CXX compiler ABI info
    -- Detecting CXX compiler ABI info - done
    -- Detecting CXX compile features
    -- Detecting CXX compile features - done
    -- Setting up Eosio Wasm Toolchain 1.6.1 at /usr/local/eosio.cdt
    CMake Warning (dev) in CMakeLists.txt:
      No cmake_minimum_required command is present.  A line of code such as

        cmake_minimum_required(VERSION 3.10)

      should be added at the top of the file.  The version specified may be lower
      if you wish to support older CMake versions for this project.  For more
      information run "cmake --help-policy CMP0000".
    This warning is for project developers.  Use -Wno-dev to suppress it.

    -- Configuring done
    -- Generating done
    -- Build files have been written to: waxblockchain/wax-blockchain/wax-cdt/examples/hello/build
    ```

4. Build the scripts.

    ```shell
    make
    ```

    The console prints the following confirmation:

    ```shell
    [  5%] Performing build step for 'hello_project'
    [100%] Built target hello
    [ 11%] No install step for 'hello_project'
    [ 16%] No test step for 'hello_project'
    [ 22%] Completed 'hello_project'
    [ 50%] Built target hello_project
    [ 55%] Performing configure step for 'hello_tests_project'
    ```

You should now be able to locate the **hello.wasm** and **hello.abi** files in the **build/hello** directory. 

<!--## Modify the Scripts and Build Your Project

If you didn't use eosio-init to create a smart contracts template (recommended), you can still use the CMake scripts to build your smart contract by making just a few modifications.

In the example below, we'll use the following directory structure:

- A **mycontracts** root directory
- A **mycontracts/wax** folder that contains the following:

    - wax.cpp
    - wax.contracts.md (optional Ricardian contract)
    - wax.clauses.md (optional Ricardian clause)

To customize the build scripts:

1. Copy **wax-cdt/examples/hello/CMakeLists.txt** into **mycontracts** (your parent smart contract directory). 

2. From **mycontracts**, open **CmakeLists.txt** and modify the <span class="codeSample">ExternalProject_Add</span> method. 

**mycontracts/CMakeLists.txt:**

```
include(ExternalProject)
# if no cdt root is given use default path
if(EOSIO_CDT_ROOT STREQUAL "" OR NOT EOSIO_CDT_ROOT)
   find_package(eosio.cdt)
endif()

ExternalProject_Add(
   wax_project
   SOURCE_DIR ${CMAKE_SOURCE_DIR}/wax
   BINARY_DIR ${CMAKE_BINARY_DIR}/wax
   CMAKE_ARGS -DCMAKE_TOOLCHAIN_FILE=${EOSIO_CDT_ROOT}/lib/cmake/eosio.cdt/EosioWasmToolchain.cmake
   UPDATE_COMMAND ""
   PATCH_COMMAND ""
   TEST_COMMAND ""
   INSTALL_COMMAND ""
   BUILD_ALWAYS 1
)
```

Save the file.

3. Copy **wax-cdt/examples/hello/src/CMakeLists.txt** into **mycontracts/wax**. 

**mycontracts/wax/CMakeLists.txt:**

```
project(wax)

set(EOSIO_WASM_OLD_BEHAVIOR "Off")
find_package(eosio.cdt)

add_contract( wax wax wax.cpp )
target_include_directories( wax PUBLIC ${CMAKE_SOURCE_DIR} )
target_ricardian_directory( wax ${CMAKE_SOURCE_DIR} )
```

Save the file.

4. From the command line, navigate to **wax-cdt/mycontracts**.

```
cd wax-cdt/mycontracts
```

5. Create a **build** directory.

```
mkdir build
```

6. Navigate to the **build** directory.

```
cd build
```

7. Run <span class="codeSample">cmake</span> to write the necessary build files to the **build** directory.

```
cmake ..
```

8. Build the scripts. You might receive several warnings during this process.

```
make
```

You should now be able to locate the **wax.wasm** and **wax.abi** files in the **build/wax** directory. -->





