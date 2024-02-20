---
title: Generador de Números Aleatorios de WAX
order: 80
---

# Generador de Números Aleatorios de WAX

El Generador de Números Aleatorios de WAX (WAX RNG) es un servicio nativo de blockchain que proporciona números aleatorios comprobablemente justos para usuarios individuales. Basado en el <a href="https://github.com/gluk256/misc/blob/master/rng4ethereum/signidice.md" target="_blank">algoritmo Signidice</a>, WAX RNG ofrece una excelente aleatorización, un flujo de trabajo más limpio y una verificación RSA ultrarrápida.

## Qué Incluye

El repositorio de GitHub de <a href="https://github.com/worldwide-asset-exchange/wax-orng" target="_blank">WAX RNG</a> incluye:

* Código Fuente de WAX RNG
* Contratos de Muestra y Pruebas Unitarias
* Scripts de make que usan nuestras <a href="https://hub.docker.com/u/waxteam" target="_blank">Imágenes de Docker</a>

## Antes de Comenzar

Si deseas utilizar nuestras imágenes de Docker para construir el repositorio de GitHub de <a href="https://github.com/worldwide-asset-exchange/wax-orng" target="_blank">WAX RNG</a>, necesitarás:

1. Docker, instalado y configurado para ejecutarse sin sudo
2. make

Para construir el repositorio WAX RNG y ejecutar pruebas unitarias desde el código fuente, necesitarás:

1. Instalar la [Configuración de Blockchain](/build/dapp-development/wax-blockchain-setup/)
2. Instalar el [Kit de Desarrollo de Contratos de WAX (WAX-CDT)](/build/dapp-development/wax-cdt/)

