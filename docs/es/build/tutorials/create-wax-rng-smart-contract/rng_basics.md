---
title: Conceptos Básicos de WAX RNG
order: 82
---

# Conceptos Básicos de WAX RNG

* **Contrato Inteligente WAX RNG.** El contrato inteligente WAX RNG se ejecuta en la red principal de WAX, propiedad de la cuenta **orng.wax**.  
* **Servicio Oracle WAX RNG.** Asegurado por la cuenta **oracle.wax**, este servicio monitorea la Blockchain de WAX externamente, escuchando nuevas llamadas al contrato inteligente WAX RNG. Cuando solicitas un nuevo número aleatorio, el oráculo RNG crea firmas RSA que generan números aleatorios comprobablemente justos.

Aquí está el flujo típico de WAX RNG:

1. Tu usuario o tu aplicación del lado del cliente suministran un número aleatorio de 64 bits (*signing_value*). Por ejemplo, podrías mostrar un botón que llama a una función de javascript que genera un número pseudoaleatorio. Cuando el usuario esté satisfecho con su valor semilla, pueden hacer clic en otro botón (por ejemplo, Comenzar a Jugar).
2. También necesitas suministrar un número de seguimiento único (*assoc_id*). Esto puede ser un id de trabajo interno o id de base de datos. Este número servirá como una clave única para identificar la solicitud y ayudar a recuperar el número aleatorio obtenido.
3. Tu contrato inteligente llama al servicio WAX RNG para solicitar un número aleatorio, enviando tu *assoc_id* y el *signing_value* del usuario.
4. El oráculo WAX RNG acepta tu solicitud, luego usa un par de claves pública y privada interna para crear una firma RSA basada en el número suministrado por tu cliente (*signing_value*). Esta firma se convierte en hash y se convierte en tu número aleatorio.
5. El servicio WAX RNG verifica la firma RSA devuelta por el oráculo WAX RNG, luego envía el número aleatorio a una acción de devolución de llamada en tu contrato inteligente, junto con tu número de seguimiento (*assoc_id*).
6. Muestras el número aleatorio al cliente o implementas algún tipo de lógica de aleatorización, animación o función dentro del juego.
