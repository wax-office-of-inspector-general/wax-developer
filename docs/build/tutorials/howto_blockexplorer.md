---
title: How to explore WAX Blockchain
order: 97
lang: en
---

# How to explore WAX Blockchain block by block at a low level (Node.JS)

## Introduction

One of the key advantages of the blockchain is that all the information is stored in the blocks in an unalterable and reliable way so that it can be consulted at any time. However, performing these queries is often not easy. For this reason, historical data storage services have been developed to facilitate this task, such as the SHIP or Hyperion APIs. Some of these services are limited to the actions of a smart contract or a specific and reduced group of them, such as the AtomicAssets API.

Most of these query services consist of two distinct components.
- Filler: In charge of exploring the blockchain to extract the information, process it and store it in the database.
- API: Responsible for handling data queries from users or applications. These queries are made on the database already generated and designed specifically for the desired type of query.

In this tutorial we are going to develop the core of a "filler". We will see a design that, although functional, will have to be adapted for each specific use. The type of data to be obtained and how to manage it is beyond the scope of this tutorial.

The "Filler" engine must connect to a SHIP node of the blockchain in order to receive the blocks that it will later evaluate. This connection will be made using the "eosio-statereceiver" library created by EOSDAC.

https://github.com/eosdac/eosio-statereceiver

:::warning
<strong>Note</strong>: For this tutorial, the library has been modified to update it to "enf-eosjs", the new JavaScript library for Antelope blockchains that replaces the obsolete "eosjs". For that reason, in the example repository, the files "connection.js" and "statereceiver.js" of that library have been included directly as part of the code.
:::

## Structure

The engine will consist of two components: 
- Traces processor: It receives from the statereceiver the traces contained in each block received from the SHIP. We will be able to make a first filtering before translating the serialised information of the actions and adding this information to the data stack that will be processed by the next component.
- Action processor: This component operates independently and its function will be to process the already deserialised actions. From here we can send the filtered and processed information to the database or use it for the function that is the object of the project we are designing.

## Starting the engine

The program will start from a function that will create the connection to the *statereceiver* and register our data processor to receive the information obtained from the blockchain.

```js
const run = async () => {

  /**
   * Set stateReceiver
  */
 const sr = new StateReceiver({
   startBlock: 0,  
   endBlock: 0xffffffff,
   mode: 0,
   config: {
     eos: {
       wsEndpoint: process.env.WS,
      },
    },
  irreversibleOnly: false,
  verbose: false,
  });

  /**
   * Create handlers
   */
  const trace_handler = new TraceHandler();
  // const block_handler = new BlockHandler();
  // const delta_handler = new DeltaHandler();
  // [...]

  /**
   * Register handlers
   */
  sr.registerTraceHandler(trace_handler);
  // sr.registerBlockHandler(block_handler);
  // sr.registerDeltaHandler(delta_handler);
  // [...]

  /**
   * Start stateReceiver
   */
  sr.start();
};
```
The "trace_handler" object contains our filler engine. With this sentence we link the "statereceiver" module to the function "trace_handler.processTrace" of our engine.

```js
sr.registerTraceHandler(trace_handler);
```

:::warning
<strong>Note</strong>: StateReceiver allows us to create other types of handles to receive data. We can create handles to process blocks, traces or deltas, for example.
:::

## processTrace

To capture the statereceiver data we must have to create and register this function. Its declaration will be of the form:

```js
async processTrace(block_num, traces, block_timestamp) {...}
```

It receives the number of the block to manage, an object with the traces of the block and the time-stamp of the block. Our job now is to go through the traces to extract and deserialise the ones we are interested in.

```js
async processTrace(block_num, traces, block_timestamp) {
  // Parse traces
  for (const trace of traces) {
    if (trace[0] === "transaction_trace_v0") {
      const tx_id = trace[1].id;
      for (const action of trace[1].action_traces) {
        if (action[0] === "action_trace_v0") {
          try {
            const actionDeser = await apiRpc.deserializeActions([
              action[1].act,
            ]);
            // Add desereialize data to actions buffer
            this.queue.push({
              data: actionDeser,
              block_num: block_num,
              block_timestamp: block_timestamp,
              tx_id: tx_id,
              retries: 0,
            });
          } catch (error) {
            console.log("Deserialized error.", error);
          }
        }
      }
    }
  }
}
```

In this example we have not made any filter. All actions contained in the block are deserialised and added to the pool to be managed by our "processQueue" function.

```js
async processQueue() {
  // No actions or this is still processing? exit
  if (!this.queue.length || this.processingQueue) {
    return;
  }

  this.processingQueue = true;
  const itemProcess = this.queue.pop();
  const action = itemProcess.data[0];
  let retries = itemProcess.retries;

  // Too much retries? drop action and exit
  if (retries > 20) {
    console.log("Exceeded retries!");
    return;
  }

  try {

    /**
     * process data here
     */
    // **************************************************
    console.log('Action', JSON.stringify(action), '\n')
    // ***************************************************

    this.processingQueue = false;
  } catch (error) {
    // Error? retry
    console.log(error);
    setTimeout(() => {
      retries++;
      this.queue.push(item);
    }, 1000 * retries);
  }
}
```

This function shall be executed cyclically. It extracts data from the pool, as long as it exists, and processes it. This is where we can perform the final actions with the information received. For example, we capture the transactions of more than 10000 WAX to show them in the console, or send them to the database (see attached code example).

The routine runs in a constant loop so we must block it while it is processing data. To force cyclic processing we can use a *setInterval* statement.

```
This.processingQueue = true
```

At the start of each cycle we check if Queue has data to process or if the processor is available.

## Example code

A complete example is available on Github:

https://github.com/3dkrender/WAXCrawler

In this example we will crawl the blockchain to locate those transactions over 10000 WAX. We use a database to store the number of the first block from where we want to start crawling the blockchain and to store the transactions that meet the condition.