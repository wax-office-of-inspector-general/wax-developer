---
title: Troubleshooting
order: 200
lang: en
---

Below is a list of known issues and fixes (if available).

## Build Error in Function `fork_once_func'

**Error Description:** WAX Source Code Repository Build Issue

After running `sudo ./wax_install.sh` to build the WAX Source Code Repository on **Ubuntu 18.04**, the command line reports an error "In function 'fork_once_func'" (around [90%]):

```
Scanning dependencies of target test_cypher_suites
Scanning dependencies of target eosio_chain
[ 90%] Building CXX object libraries/fc/test/crypto/CMakeFiles/test_cypher_suites.dir/test_cypher_suites.cpp.o
[ 90%] Building CXX object libraries/chain/CMakeFiles/eosio_chain.dir/merkle.cpp.o
[ 90%] Building CXX object libraries/chain/CMakeFiles/eosio_chain.dir/name.cpp.o
[ 90%] Building CXX object libraries/chain/CMakeFiles/eosio_chain.dir/transaction.cpp.o
[ 90%] Linking CXX executable test_cypher_suites
/usr/lib/x86_64-linux-gnu/libcrypto.a(threads_pthread.o): In function `fork_once_func':
(.text+0x16): undefined reference to `pthread_atfork'
clang: error: linker command failed with exit code 1 (use -v to see invocation)
libraries/fc/test/crypto/CMakeFiles/test_cypher_suites.dir/build.make:113: recipe for target 'libraries/fc/test/crypto/test_cypher_suites' failed
make[2]: *** [libraries/fc/test/crypto/test_cypher_suites] Error 1
CMakeFiles/Makefile2:783: recipe for target 'libraries/fc/test/crypto/CMakeFiles/test_cypher_suites.dir/all' failed
make[1]: *** [libraries/fc/test/crypto/CMakeFiles/test_cypher_suites.dir/all] Error 2
make[1]: *** Waiting for unfinished jobs....
```

Shortly after receiving this error, the build stops with the following message: 

```
MAKE building EOSIO has exited with the above error. 
```

### Fix

You can use the steps below to fix the issue and resume the WAX Source Code Repository build process.

1. From the command line, change your directory to:

```
cd patches/fc
```

2. From the <span class="sampleCode">patches/fc</span> directory, run:

```
./apply_patch.sh
```

3. When the patch completes, change your directory to:

```
cd ../../build
```

4. From the **build** directory, run:

```
make -j $(nproc)
```

You should now be able to continue the build process. 