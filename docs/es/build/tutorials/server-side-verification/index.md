---
title: Verificación del lado del servidor
order: 100
---

# Usar NKCSS.Antelope.Verify para validar inicios de sesión del lado del cliente en el backend

Tanto [MyCloudWallet](https://mycloudwallet.com) como [Anchor](https://github.com/greymass/anchor) ofrecen una opción para, como parte de la solicitud estándar de prueba de identidad, firmar también una prueba que puedes validar individualmente en el backend. Estas pruebas pueden ser validadas utilizando ECDSA y son ideales para aplicaciones backend de Unity/.NET. Son invisibles para el usuario, no requiriendo ninguna acción adicional en comparación con el flujo de trabajo normal solo del lado del cliente.

## Cómo habilitar la verificación para MyCloudWallet

Puedes consultar [aquí](https://github.com/worldwide-asset-exchange/waxjs#21-login-combining-proof-system) para ver cómo hacer que MyCloudWallet proporcione la prueba adicional, o consultar [NKCSS.Antelope.Verify](https://github.com/NKCSS/NKCSS.Antelope.Verify/) para ver un ejemplo de implementación.

## Cómo habilitar la verificación para Anchor

No hay documentación disponible que haya encontrado, pero se reduce a una propiedad `proof` que está disponible en la respuesta de inicio de sesión, la cual se puede utilizar para validar en el backend. Está firmada con una expiración de 60 segundos para prevenir ataques de repetición. Puedes ver [un ejemplo de implementación en el repositorio de NKCSS.Antelope.Verify](https://github.com/NKCSS/NKCSS.Antelope.Verify/blob/97eac764b52bb185ab4a762ebe00afc1fb4c146b/VerificationExample/wwwroot/js/site.js#L99).