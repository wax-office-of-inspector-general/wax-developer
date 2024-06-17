---
title: Install the WAX Blockchain
order: 31
---

# Prereququsistes
You will need to build on a [supported operating system]
We currently support the following operating systems.
- Ubuntu 22.04 Jammy
- Ubuntu 20.04 Focal
- Ubuntu 18.04 Bionic

Requirements to build:
- C++17 compiler and standard library
- boost 1.67+
- CMake 3.8+
- LLVM 7 - 11 - for Linux only
  - newer versions do not work
- openssl 1.1+
- curl
- libcurl 7.40.0+
- git
- GMP
- Python 3
- python3-numpy
- zlib

# Clone the WAX Blockchain

The GitHub WAX Blockchain Source Code Repository downloads to the **wax-blockchain** directory. The download and build process can take several minutes to several hours, depending on your Internet connection, operating system, and hardware specifications.

To download the WAX Blockchain Source Code Repository:

1. From the command line, clone the Git repository.

    ```shell
    git clone https://github.com/worldwide-asset-exchange/wax-blockchain.git
    ```

2. Change the directory to **wax-blockchain**.

    ```shell
    cd wax-blockchain
    ```

3. Checkout the [Current Release Tag or Branch]("https://github.com/worldwide-asset-exchange/wax-blockchain/releases")

   ```shell
   git fetch --all --tags
   git checkout v5.0.0wax01  (for example... check link above to get the current realease)
   ```

  Update Git submodules.

    ```shell
    git submodule update --init --recursive
    ```

## Build the WAX Blockchain

If you're using our Docker images, you do **not** need to complete these steps.

To build the WAX Blockchain from source, you can use the following steps. If you have a previous version installed, you'll need to uninstall it first. Refer to [Uninstall WAX](https://developer.wax.io/build/dapp-development/wax-blockchain-setup/blockchain_uninstall.html) for more information.

:::warning
Important: Refer to [Known Issues](https://developer.wax.io/build/troubleshooting/) if you encounter an issue with the build or use our [Docker Images](https://developer.wax.io/build/dapp-development/docker-setup/) instead (recommended). Building from source is not supported. 
:::

ℹ️ **Pinned vs. Unpinned Build** ℹ️  
We have two types of builds for Leap: "pinned" and "unpinned." The only difference is that pinned builds use specific versions for some dependencies hand-picked by the Leap engineers - they are "pinned" to those versions. In contrast, unpinned builds use the default dependency versions available on the build system at the time. We recommend performing a "pinned" build to ensure the compiler and boost versions remain the same between builds of different Leap versions. Leap requires these versions to remain the same, otherwise its state might need to be recovered from a portable snapshot or the chain needs to be replayed.

⚠️ **A Warning On Parallel Compilation Jobs (`-j` flag)** ⚠️  
When building C/C++ software, often the build is performed in parallel via a command such as `make -j "$(nproc)"` which uses all available CPU threads. However, be aware that some compilation units (`*.cpp` files) in Leap will consume nearly 4GB of memory. Failures due to memory exhaustion will typically, but not always, manifest as compiler crashes. Using all available CPU threads may also prevent you from doing other things on your computer during compilation. For these reasons, consider reducing this value.

🐋 **Docker and `sudo`** 🐋  
If you are in an Ubuntu docker container, omit `sudo` from all commands because you run as `root` by default. Most other docker containers also exclude `sudo`, especially Debian-family containers. If your shell prompt is a hash tag (`#`), omit `sudo`.

## Pinned Build
Make sure you are in the root of the `wax-blockchain` repo, then run the `install_depts.sh` script to install dependencies:
```bash
sudo scripts/install_deps.sh
```

Next, run the pinned build script. You have to give it three arguments in the following order:
1. A temporary folder, for all dependencies that need to be built from source.
2. A build folder, where the binaries you need to install will be built to.
3. The number of jobs or CPU cores/threads to use (note the [jobs flag](#step-3---build) warning above).

The following command runs the `pinned_build.sh` script, specifies a `deps` and `build` folder in the root of the wax-blockchain repo for the first two arguments, then builds the packages using all of your computer's CPU threads (Note: you don't need `sudo` for this command):
```bash
scripts/pinned_build.sh deps build "$(nproc)"
```
Now you can optionally test (Step 4 below) your build, or install (Step 5 below) the `*.deb` binary packages, which will be in the root of your build directory.

# Unpinned Build
The following instructions are valid for this branch. Other release branches may have different requirements, so ensure you follow the directions in the branch or release you intend to build. If you are in an Ubuntu docker container, omit `sudo` because you run as `root` by default.

Install dependencies:
```bash
sudo apt-get update
sudo apt-get install -y \
        build-essential \
        cmake \
        curl \
        git \
        libboost-all-dev \
        libcurl4-openssl-dev \
        libgmp-dev \
        libssl-dev \
        llvm-11-dev \
        python3-numpy
```
To build, make sure you are in the root of the `leap` repo, then run the following command:
```bash
mkdir -p build
cd build
cmake -DCMAKE_BUILD_TYPE=Release -DCMAKE_PREFIX_PATH=/usr/lib/llvm-11 ..
make -j "$(nproc)" package
```
Now you can optionally tests (below in Step 4) for your build, or Install (step 5) the `*.deb` binary packages, which will be in the root of your build directory.

# Step 4 - Test
Leap supports the following test suites:

Test Suite | Test Type | [Test Size](https://testing.googleblog.com/2010/12/test-sizes.html) | Notes
---|:---:|:---:|---
Parallelizable tests | Unit tests | Small
WASM spec tests | Unit tests | Small | Unit tests for our WASM runtime, each short but _very_ CPU-intensive
Serial tests | Component/Integration | Medium
Long-running tests | Integration | Medium-to-Large | Tests which take an extraordinarily long amount of time to run

When building from source, we recommended running at least the parallelizable tests.

## Parallelizable Tests
This test suite consists of any test that does not require shared resources, such as file descriptors, specific folders, or ports, and can therefore be run concurrently in different threads without side effects (hence, easily parallelized). These are mostly unit tests and [small tests](https://testing.googleblog.com/2010/12/test-sizes.html) which complete in a short amount of time.

You can invoke them by running `ctest` from a terminal in your Leap build directory and specifying the following arguments:
```bash
ctest -j "$(nproc)" -LE _tests
```

## WASM Spec Tests
The WASM spec tests verify that our WASM execution engine is compliant with the web assembly standard. These are very [small](https://testing.googleblog.com/2010/12/test-sizes.html), very fast unit tests. However, there are over a thousand of them so the suite can take a little time to run. These tests are extremely CPU-intensive.

You can invoke them by running `ctest` from a terminal in your Leap build directory and specifying the following arguments:
```bash
ctest -j "$(nproc)" -L wasm_spec_tests
```
We have observed severe performance issues when multiple virtual machines are running this test suite on the same physical host at the same time, for example in a CICD system. This can be resolved by disabling hyperthreading on the host.

## Serial Tests
The serial test suite consists of [medium](https://testing.googleblog.com/2010/12/test-sizes.html) component or integration tests that use specific paths, ports, rely on process names, or similar, and cannot be run concurrently with other tests. Serial tests can be sensitive to other software running on the same host and they may `SIGKILL` other `nodeos` processes. These tests take a moderate amount of time to complete, but we recommend running them.

You can invoke them by running `ctest` from a terminal in your Leap build directory and specifying the following arguments:
```bash
ctest -L "nonparallelizable_tests"
```

## Long-Running Tests
The long-running tests are [medium-to-large](https://testing.googleblog.com/2010/12/test-sizes.html) integration tests that rely on shared resources and take a very long time to run.

You can invoke them by running `ctest` from a terminal in your Leap build directory and specifying the following arguments:
```bash
ctest -L "long_running_tests"
```

# Step 5 - Install
Once you have built Leap and tested your build, you can install Leap on your system. Don't forget to omit `sudo` if you are running in a docker container.

We recommend installing the binary package you just built. Navigate to your Leap build directory in a terminal and run this command:
```bash
sudo apt-get update
sudo apt-get install -y ./wax-leap*.deb
```

To see a list of files that were installed:
```bash
sudo dpkg-query -L wax-leap
```

It is also possible to install using `make` instead:
```bash
sudo make install
```

If you need any additional assistance check the README.md file.








