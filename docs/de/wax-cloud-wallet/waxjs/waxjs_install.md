---
title: WaxJS installieren
layout: default
parent: WaxJS Überblick
grand_parent: WAX Cloud Wallet
lang-ref: Install WaxJS
lang: de
---

Ess gibt mehrere Möglichkeiten **WaxJS** zu installieren:

## NPM

```bash
npm install @waxio/waxjs
```

## YARN

```bash
yarn add @waxio/waxjs
```

## Code und Demo Projekt

Das <a href="https://github.com/worldwide-asset-exchange/waxjs" target="_blank">WaxJS-Repository</a> enthält die <span class="codeSample">waxjs.js< /span> Minimiertes Bundle zusammen mit einem Beispielprojekt.

```
git clone --recursive https://github.com/worldwide-asset-exchange/waxjs.git
```

Sie finden <span class="codeSample">waxjs.js</span> und ein Beispielprojekt im Ordner **dist-web**. Um das Beispiel auszuführen, starten Sie <span class="codeSample">index.html</span> von einem lokalen Webserver.

Wenn Sie das gesamte Projekt erstellen möchten:

### Docs generieren

``` 
npm run docs
```

### Tests ausführen

``` 
npm run test 
```

### Build lib

``` 
npm run build
```

### Build (optimiert fürs Webanwendungen)

``` 
npm run build-web
```





