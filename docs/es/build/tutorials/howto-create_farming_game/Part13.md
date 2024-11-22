---
title: Parte 13. Stake de Tokens y Votación en juegos
order: 65
---

Para profundizar en el stake de tokens y su papel en la gobernanza, comenzamos configurando una nueva tabla para gestionar el proceso de staking. Esta tabla hará un seguimiento de los tokens en stake y sus derechos de votación correspondientes, lo cual es crucial para permitir que los jugadores participen en procesos clave de toma de decisiones, como el cambio de ratios de recurso a token en intercambios. Esta funcionalidad no solo aumenta el compromiso de los jugadores, sino que también descentraliza la gobernanza del juego, permitiendo que los jugadores tengan voz en las estrategias económicas del juego.

```cpp
struct [[eosio::table]] balance_j
    {
    name  owner;
    asset quantity;

    uint64_t primary_key() const { return owner.value; }
    };
typedef multi_index< "balance"_n, balance_j > balance_t;
```

Para la implementación del staking de tokens, estableceremos una nueva tabla con los campos 'owner' y 'número de tokens en stake'. Esta tabla hará un seguimiento de los tokens que cada jugador tiene en stake en el juego. Además, para facilitar el staking, se agregará una función que escuche las transferencias de tokens. Esta función actualizará automáticamente la tabla de staking cada vez que se transfieran tokens al contrato, asegurando que los tokens en stake de los jugadores se registren y gestionen con precisión.

```cpp
[[eosio::on_notify("tokencont::transfer")]] // tokencont cambiar por el contrato de tu token
void receive_token_transfer
(
    const name& from,
    const name& to,
    const asset& quantity,
    const std::string& memo
);
```

Al configurar la funcionalidad de staking de tokens, asegúrate de personalizar el código reemplazando `tokencont` con el nombre real de tu contrato de token. Esto es esencial para garantizar que la función de staking interactúe correctamente con el contrato de token específico implementado para tu juego, permitiendo un seguimiento y una gestión precisos de los tokens en stake.

```cpp
void game::receive_token_transfer
(
  const name& from,
  const name& to,
  const asset& quantity,
  const std::string& memo
)
{
  if(to != get_self())
    return;

  if(memo == "stake")
  {
    increase_tokens_balance(from, quantity);
  }
  else
    check(0, "Invalid memo");
}
```

y

```cpp
void game::increase_tokens_balance(const name& owner, const asset& quantity)
{
  balance_t balance_table(get_self(), get_self().value);
  auto balance_table_itr = balance_table.find(owner.value);

  if(balance_table_itr == std::end(balance_table))
  {
    balance_table.emplace(get_self(), [&](auto &new_row)
    {
      new_row.owner = owner;
      new_row.quantity = quantity;
    });
  }
  else
  {
    balance_table.modify(balance_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.quantity += quantity;
    });
  }
}
```

La función para gestionar el staking de tokens opera accediendo a la tabla de balances para localizar la entrada de un jugador específico. Si el jugador ya tiene un balance registrado, la función incrementa la cantidad de tokens en stake en consecuencia. Si no se encuentra un balance existente, crea un nuevo registro para el jugador, documentando la cantidad de tokens que ha puesto en stake.

## Votación

Ahora que el staking de tokens está en su lugar, nos centraremos en implementar un sistema de votación para cambiar el ratio en los intercambios de recursos. Para facilitar esto, introduciremos una nueva tabla diseñada específicamente para gestionar los registros de votación. Esta tabla hará un seguimiento de cada voto relacionado con los ajustes de ratios, permitiendo que los titulares de tokens en stake influyan en las tasas de conversión de recursos a tokens según sus preferencias y la cantidad de tokens en stake que tengan en el juego. Este mecanismo integra la toma de decisiones democrática en el modelo económico del juego.

```cpp
 struct [[eosio::table]] changeration_j
  {
    uint64_t                 voting_id;
    std::string              resource_name;
    float                    new_ratio;
    std::map<name, asset>    voted; // el primero es el nombre del jugador, el segundo es el poder de voto (en tokens)

    uint64_t primary_key() const { return voting_id; }
  };
  typedef multi_index< "changeration"_n, changeration_j > changeration_t;
```

Para admitir la votación sobre cambios en los ratios de intercambio de recursos, estableceremos una nueva tabla estructurada de la siguiente manera:

-   **voting_id**: Un identificador único para cada evento de votación.
-   **resource_name**: El nombre del recurso sujeto al cambio de ratio.
-   **new_ratio**: El nuevo ratio propuesto de intercambio del recurso por el token.
-   **voted**: Una lista que detalla qué jugadores han votado y la cantidad de votos que cada jugador ha emitido, reflejando la cantidad de tokens en stake.

Esta configuración permite a los titulares de tokens participar directamente en las decisiones que afectan la dinámica económica del juego.

```cpp
void game::createvoting(
  const name& player,
  const std::string& resource_name,
  const float& new_ratio
)
{
  require_auth(player);

  const uint64_t key_id = stringToUint64(resource_name);
  resourcecost_t resourcecost_table(get_self(), get_self().value);
  auto resourcecost_table_itr = resourcecost_table.require_find(key_id, "Could not find selected resource name");

  changeration_t changeration_table(get_self(), get_self().value);
  const uint64_t new_voting_id = changeration_table.available_primary_key();

  changeration_table.emplace(player, [&](auto &new_row)
  {
    new_row.voting_id = new_voting_id;
    new_row.resource_name = resource_name;
    new_row.new_ratio = new_ratio;
  });
}
```

Para empezar, verificamos si tal recurso existe en la tabla de configuración:

```cpp
  const uint64_t key_id = stringToUint64(resource_name);
  resourcecost_t resourcecost_table(get_self(), get_self().value);
  auto resourcecost_table_itr = resourcecost_table.require_find(key_id, "Could not find selected resource name");

```

Después de eso, extraemos un nuevo id para la votación

```cpp
 changeration_t changeration_table(get_self(), get_self().value);
  const uint64_t new_voting_id = changeration_table.available_primary_key();

```

y hacemos un nuevo registro, teniendo en cuenta que ahora el jugador paga por los marcos para evitar abusos

```cpp
 changeration_table.emplace(player, [&](auto &new_row)
  {
    new_row.voting_id = new_voting_id;
    new_row.resource_name = resource_name;
    new_row.new_ratio = new_ratio;
  });

```

Ahora vamos a crear una función para la votación. Imaginemos que, condicionalmente, necesitamos 100 votos (100 tokens para que la votación se complete y se aprueben los cambios).

```cpp
void game::vote(
  const name& player,
  const uint64_t& voting_id
)
{
  require_auth(player);

  balance_t      balance_table(get_self(), get_self().value);
  resourcecost_t resourcecost_table(get_self(), get_self().value);
  changeration_t changeration_table(get_self(), get_self().value);

  auto balance_table_itr = balance_table.require_find(player.value, "You don't have staked tokens to vote");
  auto changeration_table_itr = changeration_table.require_find(voting_id, "Could not find selected voting id");
  auto resourcecost_table_itr = resourcecost_table.require_find(stringToUint64(changeration_table_itr->resource_name));

  const asset goal_votes = asset(100 * 10000, symbol("GAME", 4)); // 100.0000 GAME tokens para aplicar los cambios
  asset total_votes = asset(0, symbol("GAME", 4));

  for (const auto& map_itr : changeration_table_itr->voted)
    total_votes += map_itr.second;

  if(total_votes + balance_table_itr->quantity >= goal_votes)
  {
    resourcecost_table.modify(resourcecost_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.ratio = changeration_table_itr->new_ratio;
    });

    changeration_table.erase(changeration_table_itr);
  }
  else
  {
    changeration_table.modify(changeration_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.voted[player] = balance_table_itr->quantity;
    });
  }
}
```

Describamos el código anterior por partes:

1. **Autorización del jugador**

```cpp
 require_auth(player);
```

2. Para la gestión y el procesamiento efectivos de los votos de los jugadores respecto a los cambios en el ratio de recurso a token, el sistema incorpora estructuras de datos críticas. Estas incluyen la Tabla de Balance de Tokens para verificar los tokens en stake de los jugadores como poder de voto, la Configuración del Precio del Recurso para hacer referencia a los cambios actuales y propuestos de los ratios, y la Tabla de Votación para gestionar y contabilizar los votos con sus iteradores. Estos componentes son esenciales para garantizar la transparencia e integridad en el proceso de toma de decisiones democrática del juego.

```cpp
balance_t      balance_table(get_self(), get_self().value);
resourcecost_t resourcecost_table(get_self(), get_self().value);
changeration_t changeration_table(get_self(), get_self().value);

auto balance_table_itr = balance_table.require_find(player.value, "You don't have staked tokens to vote");
auto changeration_table_itr = changeration_table.require_find(voting_id, "Could not find selected voting id");
auto resourcecost_table_itr = resourcecost_table.require_find(stringToUint64(changeration_table_itr->resource_name));
```

3. Para el proceso de votación, se inicializa una variable específica para realizar un seguimiento del progreso hacia el umbral de aprobación predefinido en la configuración del voto. Si se cumple este umbral, la votación se considera exitosa y se pueden aplicar los cambios a la configuración del ratio del recurso.

```cpp
const asset goal_votes = asset(100 * 10000, symbol("GAME", 4)); // 100.0000 GAME tokens para aplicar los cambios
  asset total_votes = asset(0, symbol("GAME", 4));
```

4. Contabilización total de los votos

```cpp
for (const auto& map_itr : changeration_table_itr->voted)
    total_votes += map_itr.second;
```

5. Si los votos totales alcanzan el umbral establecido para la propuesta, indicando la aprobación de los jugadores, entonces se actualiza la configuración del precio del recurso sobre el que se votó en consecuencia. Tras esta actualización, la votación específica se concluye y se elimina de la tabla de votaciones, finalizando la decisión y reflejando la elección colectiva de los jugadores en la configuración del juego.

```cpp
if(total_votes + balance_table_itr->quantity >= goal_votes)
{
    resourcecost_table.modify(resourcecost_table_itr, get_self(), [&](auto &new_row)
    {
      new_row.ratio = changeration_table_itr->new_ratio;
    });

    changeration_table.erase(changeration_table_itr);
}
```

6. De lo contrario, simplemente se añaden los votos emitidos por el jugador

```cpp
else
{
    changeration_table.modify(changeration_table_itr, get_self(), [&](auto &new_row)
    {
        new_row.voted[player] = balance_table_itr->quantity;
    });
}
```

Este artículo se centró en implementar un sistema de staking y votación de tokens dentro de un entorno de juego. Detalló la configuración de una estructura de votación para que los jugadores influyan en los cambios en los ratios de intercambio de recursos a tokens a través de un proceso democrático. Los componentes clave incluyeron la creación de tablas para realizar un seguimiento de los votos y la configuración de los tokens en stake de los jugadores para determinar su poder de voto. El artículo también describió cómo se contabilizan los votos y las condiciones bajo las cuales se implementan los cambios propuestos, enfatizando la integración de estas funcionalidades en el marco del contrato inteligente del juego.

**PD.** El [siguiente enlace](https://github.com/dapplicaio/TokenStakingAndVoting) nos lleva a un repositorio que corresponde a todo lo descrito.