---
title: Parte 3. Creación de NFT para agricultura en Atomic Hub
order: 15
---

En nuestro último artículo, te guiamos en la creación de una colección y un ítem. Ahora, vamos a subir de nivel y centrarnos en la elaboración de un ítem para agricultura.

### 3.1 Creación de una Categoría (Esquema) para NFTs

Todo se trata de establecer la base para tus NFTs. Nos sumergiremos en la configuración de una categoría o esquema que definirá cómo funcionarán tus ítems de agricultura y cómo destacarán.

![](/public/assets/images/tutorials/howto-create_farming_game/part3/creatingSchema-1024x467.png)
![](/public/assets/images/tutorials/howto-create_farming_game/part3/creatingSchemaEnd-1024x427.png)
*Creando Esquema*

- **name**:
  - Tipo de Atributo: *string*
  - Descripción: Representa el nombre del jugador, personaje u objeto dentro del juego.

- **img (imagen)**:
  - Tipo de Atributo: *imagen*
  - Descripción: Corresponde a la representación visual o imagen asociada con el jugador, personaje u objeto.

- **video**:
  - Tipo de Atributo: *string*
  - Descripción: Se refiere a cualquier contenido de video vinculado al jugador, personaje u objeto, proporcionando elementos multimedia adicionales.

- **farmResource**:
  - Tipo de Atributo: *string*
  - Descripción: Especifica el tipo de recurso que puede ser cultivado o cosechado por el jugador u objeto.

- **amount**:
  - Tipo de Atributo: *float*
  - Descripción: Representa la cantidad o monto del recurso cultivado.

- **level**:
  - Tipo de Atributo: *uint8*
  - Descripción: Denota el nivel o rango del jugador, personaje u objeto, mostrando el progreso dentro del aspecto de agricultura del juego.

- **upgradable**:
  - Tipo de Atributo: *bool*
  - Descripción: Un valor booleano que indica si el recurso de agricultura, jugador u objeto puede ser mejorado.

- **rewardInterval**:
  - Tipo de Atributo: *uint32*
  - Descripción: Indica el intervalo de tiempo (en segundos) entre cada ciclo de recompensa o cosecha.

- **rarity**:
  - Tipo de Atributo: *uint32*
  - Descripción: Especifica el nivel de rareza del jugador, personaje u objeto en el contexto de la agricultura, distinguiéndolo en términos de singularidad o escasez.

- **faction**:
  - Tipo de Atributo: *string*
  - Descripción: Representa la facción o afiliación grupal del jugador u objeto dentro del aspecto de agricultura del juego.

- **lastClaim**:
  - Tipo de Atributo: *uint32*
  - Descripción: Indica la marca de tiempo o información respecto a la última vez que se reclamó o cosechó el recurso.

- **maxLevel**:
  - Tipo de Atributo: *uint32*
  - Descripción: Especifica el nivel máximo que el recurso de agricultura, jugador u objeto puede alcanzar.

- **initialAmount**:
  - Tipo de Atributo: *uint8*
  - Descripción: Representa la cantidad inicial del recurso cultivado al comenzar el juego o al adquirir el objeto.

- **miningRate**:
  - Tipo de Atributo: *float*
  - Descripción: Indica la tasa a la cual se genera o cosecha el recurso de agricultura a lo largo del tiempo.

### 3.2 Creación de Plantillas de NFT

Primero lo primero: selecciona la categoría correcta (o esquema) para tu plantilla NFT. Es como elegir el molde perfecto para tu ítem de agricultura, fundamental para definir su identidad y función.

![](/public/assets/images/tutorials/howto-create_farming_game/part3/create-new-template-1024x524.png)
*Creación de Nueva Plantilla mediante Atomic Hub*

Luego, es momento de darle vida a tu NFT. Sube la imagen que representará a tu ítem de agricultura y completa los campos necesarios para darle carácter y contexto.

![](/public/assets/images/tutorials/howto-create_farming_game/part3/temp1-1024x536.png)
*Creación de Plantilla NFT*

![](/public/assets/images/tutorials/howto-create_farming_game/part3/temp2-1024x499.png)
*Así es como se ve la plantilla creada:*

![](/public/assets/images/tutorials/howto-create_farming_game/part3/tempres-1024x262.png)
*Creación de Plantilla NFT completada*

### 3.3 Mintear NFT

Primero, necesitamos elegir una categoría (esquema) y una plantilla:

![](/public/assets/images/tutorials/howto-create_farming_game/part3/mintNFT-1024x502.png)
*Minteo de NFT*

Luego, decide si necesitas actualizar los datos del NFT y considera agregar detalles adicionales si es necesario. Ten en cuenta que los datos de tu NFT pueden ser estáticos o dinámicos, cambiando a medida que el juego progresa o basado en otras lógicas. ¡Es como darle a tu NFT una personalidad que evoluciona!

![](/public/assets/images/tutorials/howto-create_farming_game/part3/mintNFTend-1024x542.png)
*Minteo de NFT y envío al receptor*

Después de la creación, nuestro NFT se mostrará en el inventario del usuario y podrá utilizarse en el futuro en nuestro juego.

En el próximo artículo, explicaremos los tokens y recursos que se necesitan para nuestro juego.

