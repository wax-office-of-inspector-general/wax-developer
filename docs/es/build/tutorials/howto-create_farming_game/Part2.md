---
title: Parte 2. Creación de un objeto o ítem cultivable en el estándar AtomicAssets.
order: 10
---

Este es el siguiente artículo en la serie de creación de juegos. Puedes seguir primero el [artículo introductorio](/build/tutorials/howto-create_farming_game/Part1) si aún no lo has leído.

El gaming Play-to-Earn (P2E) está revolucionando el mundo web3 y blockchain, redefiniendo cómo los jugadores interactúan con los juegos. ¿A la vanguardia? La blockchain de WAX. No se trata solo de activos virtuales; es un centro para la agricultura rentable y el comercio de NFTs únicos. WAX es donde el juego se encuentra con las ganancias, combinando la diversión con el potencial financiero.

### Paso 1: Creación de tu Colección de NFTs en WAX

¿Comenzando tu colección de NFTs? Empieza con fuerza eligiendo un tema impresionante. Ópera espacial, épica histórica o un mundo de fantasía: el cielo es el límite. Tu elección debe resonar con tu audiencia. Se trata de crear un universo NFT que cautive y conecte.

![](/public/assets/images/tutorials/howto-create_farming_game/part2/collection_creation-980x517.png)
*Pantalla de creación de colección en Atomic Hub*

1. **Nombre de la Colección**
   - Es hora de darle una marca a tu colección de NFTs. Elige un nombre único que capture el espíritu de tu proyecto. Mantenlo en un máximo de 12 caracteres, mezclando números (1-5) y letras. No se permiten espacios. Ejemplo: `juegogalactico`.

2. **Nombre para Mostrar**
   - Esto es lo que los jugadores verán. Elige algo atractivo que represente la vibra de tu juego. Ejemplo: `Juego Galáctico`.

3. **URL del Sitio Web**
   - Agrega el enlace de tu sitio web donde los jugadores e inversionistas puedan profundizar en tu mundo. Por ejemplo: [https://wax.io](https://wax.io).

4. **Comisión del Mercado**
   - Decide la comisión de intercambio para la plataforma de tu juego. Digamos, un 2% para el intercambio de tus NFTs.

5. **Descripción de la Colección**
   - Sé creativo con la descripción de tu colección. En 3000 caracteres o menos, haz que resalten los temas e ideas principales de tu proyecto.

6. **Imágenes de la Colección**
   - **Imagen de Fondo**: Establece el escenario con una imagen de fondo que refleje el ambiente y tema de tu juego.
   - **Imagen del Logo**: Elige un logo icónico para representar tu colección, haciendo que sea reconocible al instante.

7. **Redes Sociales**
   - Conéctate con tu comunidad. Agrega todos tus enlaces sociales: Twitter, Medium, Facebook, GitHub, Discord, YouTube, Telegram.

Estos pasos son tu plan para crear una colección de NFTs destacada en WAX. Recuerda, cada detalle, desde el nombre hasta las redes sociales, da forma al atractivo de tu juego.

### Paso 2: Creación de Ítems NFT en la Testnet de WAX

#### 2.1 Creación de una Categoría (Esquema) para NFT

![](/public/assets/images/tutorials/howto-create_farming_game/part2/creatrschema1-980x500.png)
![](/public/assets/images/tutorials/howto-create_farming_game/part2/createschema2-980x504.png)
*Pantalla de creación de esquemas en Atomic Hub*

Tendremos los siguientes campos:

- **name**:
  - Tipo de atributo: *string*
  - Descripción: Representa el nombre del jugador u objeto que se está determinando.

- **img**:
  - Tipo de atributo: *imagen*
  - Descripción: Corresponde a una representación visual o imagen asociada con un jugador u objeto.

- **video**:
  - Tipo de atributo: *string*
  - Descripción: Indica cualquier contenido de video asociado con un jugador u objeto que proporcione elementos multimedia adicionales.

- **slots**:
  - Tipo de atributo: *uint8*
  - Descripción: Muestra el número actual de ranuras disponibles para recursos, ítems u otros elementos en el juego.

- **maxSlots**:
  - Tipo de atributo: *uint8*
  - Descripción: Indica el número máximo de ranuras que se pueden obtener o mejorar en el juego.

- **level**:
  - Tipo de atributo: *uint8*
  - Descripción: Indica el nivel o rango de un jugador u objeto, señalando el progreso en el juego.

- **upgradable**:
  - Tipo de atributo: *bool*
  - Descripción: Un valor booleano que indica si un jugador u objeto puede ser mejorado o subir de nivel.

- **rarity**:
  - Tipo de atributo: *string*
  - Descripción: Describe el nivel de rareza de un jugador o ítem, señalando su singularidad o rareza.

- **faction**:
  - Tipo de atributo: *string*
  - Descripción: Representa la facción o afiliación grupal de un jugador u objeto en el juego.

- **miningBoost**:
  - Tipo de atributo: *float*
  - Descripción: Indica cualquier aumento o bonificación asociada con el botín relacionado con un jugador u objeto.

- **staking**:
  - Tipo de atributo: *int32[]*
  - Descripción: Llama al motor de staking, proporcionando información sobre las capacidades de staking de un jugador u objeto.

- **stakeableResources**:
  - Tipo de atributo: *string[]*
  - Descripción: Enumera los tipos de recursos que un jugador u objeto puede colocar en el juego.

#### 2.2 Creación de Plantillas para NFT

Primero, necesitamos elegir una categoría (esquema):

![](/public/assets/images/tutorials/howto-create_farming_game/part2/selectschema-980x222.png)
*Seleccionar esquema para la Plantilla*

Luego necesitamos ingresar todos los datos para nuestra Plantilla:

![](/public/assets/images/tutorials/howto-create_farming_game/part2/CreateTemplate1-980x494.png)
*Creación de Plantilla NFT mediante Atomic Hub*

Después de una creación exitosa, podemos ver el resultado, como se muestra a continuación:

![](/public/assets/images/tutorials/howto-create_farming_game/part2/templateCreated-1024x258.png)
*Plantillas creadas para la colección en Atomic Hub*

#### 2.3 Minteo de NFT

Necesitamos elegir una categoría (esquema) y una plantilla:

![](/public/assets/images/tutorials/howto-create_farming_game/part2/createtemplate-result-980x476.png)
*Minteo de nuevo NFT en Atomic Hub*

Luego ingresamos a quién mintear el NFT en el campo de Receptor de Activos y completamos los campos del NFT, si es necesario:

![](/public/assets/images/tutorials/howto-create_farming_game/part2/createtemplate3-1-980x481.png)

Este es un proceso breve de creación de uno de nuestros principales tipos de activos en esta serie de artículos. Ahora, procedamos con otro tipo de activo.

