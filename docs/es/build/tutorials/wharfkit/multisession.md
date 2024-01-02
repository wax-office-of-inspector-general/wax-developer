---
title: WharfKit - Multi Session
order: 110
---

# Multi Session con WharfKit

## Introducción

WharfKit permite iniciar sesión en múltiples cadenas de bloques así como con diferentes cuentas de usuario. Esto es útil para aplicaciones que necesitan interactuar con, como por ejemplo, un mercado de NFTs que permite a los usuarios comprar y vender NFTs.

Cada vez que un usuario inicia sesión en una cadena de bloques, se crea una sesión. Una sesión contiene la información de la cuenta de usuario, como el nombre de usuario, la clave pública y la clave privada. También contiene la información de la cadena de bloques, como el ID de la cadena de bloques. Esta información se conserva en el almacenamiento local del navegador y nunca se envía a ningún servidor.

WharfKit puede gestionar múltiples sesiones para poder cambiar entre ellas con facilidad. Veamos cómo hacerlo.

## Conociendo el Kit de Sesión

El kit de sesión es el encargado de gestionar las sesiones. Para ello, proporciona una serie de métodos que nos permiten crear, y restaurar sesiones. Para familiarizarnos con el kit de sesión recomendamos la lectura del artículo [WharfKit - How To React](/es/build/tutorials/wharfkit/howto_react) de esta documentación.

## Recuperando Sesiones

Gracias al método `getSessions()` del kit de sesión, podemos recuperar todas las sesiones que se han creado. Este método devuelve un array de sesiones, que podemos recorrer para obtener la información de cada una de ellas.

```javascript
sessionKit
    .getSessions()
    .then((globalSessions: SerializedSession[] | undefined) => {
        if (globalSessions) {
            console.log(
                'Total de sesiones recuperadas: ',
                globalSessions.length
            );
        }
        // filtrar las sesiones por cadena de bloques
        const sessionsThisChain = globalSessions?.filter(
            (session: SerializedSession) => {
                return session.chain === chainId;
            }
        );
        // filtrar las sesiones por wallet. En este caso, Anchor
        const sessionsThisWallet = globalSessions?.filter(
            (session: SerializedSession) => {
                return session.walletPluguin.id === 'anchor';
            }
        );
    });
```

## Cambiar de Sesión

Para cambiar de sesión, simplemente necesitamos llamar al método `restore()` del kit de sesión, pasando como parámetro la sesión que queremos restaurar. Este método devuelve una promesa que se resuelve con la sesión restaurada.

```javascript
// ....
const session: SerializedSession = sessionsThisChain[0];
// ....

sessionKit.restore(session).then((session: Session | undefined) => {
    if (session) {
        console.log('Sesión restaurada: ', session);
    }
});
```

El almacenamiento de las sesiones se realiza en un objeto de tipo `SerializedSession`.

```javascript
interface SerializedSession {
    actor: NameType;
    chain: Checksum256Type;
    default?: boolean;
    permission: NameType;
    walletPlugin: SerializedWalletPlugin;
}
```

Cabe destacar que el atributo ```default``` es el que indica si la sesión es la sesión por defecto. Esto es útil para saber qué sesión se está utilizando en cada momento.

## Agregar Sesiones

Para agregar una sesión, simplemente necesitamos llamar al método `login()` del kit de sesión. Este método devuelve una promesa que se resuelve con la sesión agregada.

```javascript
sessionKit.login().then((session: Session | undefined) => {
    if (session) {
        console.log('Sesión agregada: ', session);
    }
});
```

## Cerrar Sesión

Para cerrar una sesión, simplemente necesitamos llamar al método `logout()` del kit de sesión, pasando como parámetro la sesión que queremos cerrar. Si no se pasa ningún parámetro, se cerrará la sesión por defecto.

```javascript
sessionKit.logout(session);
```
