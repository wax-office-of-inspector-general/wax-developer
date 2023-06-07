---
title: Install and Build WAX RNG
order: 81
---

To install <a href="https://github.com/worldwide-asset-exchange/wax-orng" target="_blank">WAX RNG</a> from GitHub:

1. From the command line, clone the Git repository.

    ```shell
    git clone https://github.com/worldwide-asset-exchange/wax-orng.git
    ```

## Build the WAX RNG Smart Contract and Unit Tests

The <a href="https://github.com/worldwide-asset-exchange/wax-orng" target="_blank">WAX RNG</a> GitHub repository includes WAX RNG source code and various unit tests.

* **src** RNG smart contract code.
* **tests:** Unit test source code.

To build these smart contracts with our Docker image and **make** scripts:

1. From the command line, change the directory to **wax-orng**.

    ```shell
    cd wax-orng
    ```

2. Start the development docker.

    ```shell
    make dev-docker-start
    ```

3. Next, you have two options.

    1. Build the smart contracts and unit tests.

        ```shell
        make build
        ```

        Run tests

        ```shell
        make test
        ```

    2. Optional, build and test.

        ```shell
        make all
        ```

4. Clean all and exit.

    ```shell
    make clean
    ```

    ```shell
    exit
    ```