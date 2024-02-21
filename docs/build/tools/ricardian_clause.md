---
title: Cláusulas Ricardianas
order: 112
---

# Cláusulas Ricardianas

Similar a un [Contrato Ricardiano](/build/tools/ricardian_contract), una cláusula Ricardiana es un documento digital que especifica los términos de todo tu contrato inteligente, no solo por acción.

Para asociar una cláusula Ricardiana con tu contrato inteligente, necesitarás crear un archivo en markdown.

* Este archivo debe tener el mismo nombre que tu contrato inteligente. Por ejemplo, si tu contrato inteligente se llama **wax.cpp**, tu archivo de cláusulas Ricardianas debe llamarse: wax.clauses.md.
* Cada etiqueta **```<h1>```** debe tener la clase "clause": ```<h1 class="clause">```.

También es importante dónde almacenas tu archivo de cláusulas Ricardianas (en relación con tu archivo C++ de contrato inteligente). Esto depende de cómo estés compilando tu contrato.

## Usa WAX-CDT

Si usas **eosio-init** para crear una plantilla de contrato inteligente, se crea automáticamente una carpeta para ti bajo tu directorio de proyecto (por ejemplo, wax/ricardian). Por defecto, esta carpeta no contiene una cláusula Ricardiana. Necesitarás crear una, como wax.clauses.md.

Los scripts de CMake incluirán automáticamente los archivos listados en el directorio **ricardian**.

Consulta [Crear un Contrato Inteligente](/build/dapp-development/smart-contract-quickstart/) para más información.

## Usa eosio-cpp

Si usas eosio-cpp, tu cláusula Ricardiana debe estar en el mismo directorio que wax.cpp y debe tener el mismo nombre: wax.clauses.md.

```shell
eosio-cpp -abigen wax.cpp -o wax.wasm
```

## Ejemplo de Cláusula Ricardiana

Para incluir una cláusula Ricardiana:

1. Crea un archivo llamado **tu-contrato.clauses.md** (por ejemplo, wax.clauses.md).
2. Incluye la clase "clause" en la etiqueta ```<h1>```.
3. Pega el siguiente markdown en tu archivo de cláusulas.

```html
<hr style="height:1px; border:none; color:#000; background-color:#000; width:100%; text-align:left; margin: 0 auto 0 0;">

<h1 class="clause">Garantía</h1>

El invocador de la acción del contrato deberá cumplir sus Obligaciones bajo este Contrato de manera oportuna y profesional, utilizando conocimientos y recomendaciones para realizar los servicios que cumplan con los estándares generalmente aceptables establecidos por los Productores de Bloques de la Blockchain WAX.IO. 

<h1 class="clause">Incumplimiento</h1>

La ocurrencia de cualquiera de los siguientes constituirá un incumplimiento material bajo este Contrato: 

<h1 class="clause">Remedios</h1>

Además de todos y cada uno de los demás derechos que una parte pueda tener disponibles según la ley, si una parte incumple al no cumplir sustancialmente con cualquier disposición, término o condición de este Contrato, la otra parte puede terminar el Contrato proporcionando un aviso por escrito a la parte incumplidora. Este aviso describirá con detalle suficiente la naturaleza del incumplimiento. La parte que recibe dicho aviso será eliminada de inmediato de ser un Productor de Bloques y este Contrato se terminará automáticamente. 

<h1 class="clause">Fuerza Mayor</h1>

Si el desempeño de este Contrato o cualquier obligación bajo este Contrato es prevenido, restringido o interferido por causas más allá del control razonable de cualquiera de las partes ("Fuerza Mayor"), y si la parte incapaz de llevar a cabo sus obligaciones da a la otra parte un aviso escrito rápido de tal evento, entonces las obligaciones de la parte que invoca esta disposición serán suspendidas en la medida necesaria por tal evento. El término Fuerza Mayor incluirá, sin limitación, actos de Dios, incendio, explosión, vandalismo, tormenta u otra ocurrencia similar, órdenes o actos de autoridad militar o civil, o por emergencias nacionales, insurrecciones, disturbios o guerras, o huelgas, cier

res patronales, paros de trabajo o fallos de proveedores. La parte excusada utilizará esfuerzos razonables bajo las circunstancias para evitar o eliminar tales causas de incumplimiento y procederá a realizar con prontitud siempre que tales causas sean removidas o cesen. Un acto u omisión se considerará dentro del control razonable de una parte si es cometido, omitido o causado por dicha parte, o sus empleados, oficiales, agentes o afiliados. 

<h1 class="clause">Resolución de Disputas</h1>

Cualquier controversia o disputa que surja de o en relación con este Contrato será resuelta por arbitraje vinculante bajo las reglas predeterminadas establecidas por la Blockchain WAX.IO. La decisión del árbitro será definitiva, y el juicio puede ser ingresado sobre ella por cualquier corte que tenga jurisdicción apropiada. 

<h1 class="clause">Acuerdo</h1>

Este Contrato contiene el acuerdo completo de las partes, y no hay otras promesas o condiciones en ningún otro acuerdo ya sea oral o escrito concerniente al objeto de este Contrato. Este Contrato reemplaza cualquier acuerdo previo escrito u oral entre las partes. 

<h1 class="clause">Divisibilidad</h1>

Si alguna disposición de este Contrato se considera inválida o inaplicable por cualquier motivo, las disposiciones restantes continuarán siendo válidas y aplicables. Si un tribunal encuentra que alguna disposición de este Contrato es inválida o inaplicable, pero que limitando tal disposición se convertiría en válida y aplicable, entonces tal disposición se considerará escrita, interpretada y aplicada como así limitada. 

<h1 class="clause">Enmienda</h1>

Este Contrato puede ser modificado o enmendado por escrito por acuerdo mutuo entre las partes, si el escrito es firmado por la parte obligada bajo la enmienda. 

<h1 class="clause">Ley Aplicable</h1>

Este Contrato será interpretado de acuerdo con las Máximas de Equidad. 

<h1 class="clause">Notificación</h1>

Cualquier aviso o comunicación requerido o permitido bajo este Contrato será suficientemente dado si se entrega a una dirección de correo electrónico verificable o a tal otra dirección de correo electrónico como una de las partes haya proporcionado públicamente por escrito, o publicado en un contrato de difusión proporcionado por esta blockchain con el propósito de proporcionar avisos de este tipo. 

<h1 class="clause">Renuncia de Derecho Contractual</h1>

El fallo de cualquiera de las partes en hacer cumplir cualquier disposición de este Contrato no será interpretado como una renuncia o limitación del derecho de esa parte a posteriormente hacer cumplir y obligar el estricto cumplimiento con cada disposición de este Contrato. 

<h1 class="clause">Honorarios de Árbitros a la Parte Prevalente</h1>

En cualquier acción que surja bajo este documento o cualquier acción separada relativa a la validez de este Acuerdo, ambas partes pagarán la mitad del costo inicial de arbitraje, y a la parte prevalente se le otorgarán honorarios y costos razonables del árbitro. 

<h1 class="clause">Construcción e Interpretación</h1>

Se renuncia a la regla que requiere construcción o interpretación contra el redactor. El documento se considerará como si hubiera sido redactado por ambas partes en un esfuerzo mutuo. 

<h1 class="clause">En Testimonio de lo Cual</h1>

En testimonio de lo cual, las partes han causado que este Acuerdo sea ejecutado por ellos mismos o sus representantes debidamente autorizados a partir de la fecha de ejecución, y autorizado como probado por la firma criptográfica en la transacción que invoca este contrato.
