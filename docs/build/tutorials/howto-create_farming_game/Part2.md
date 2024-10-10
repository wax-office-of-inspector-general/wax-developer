---
title: Part 2. Creating a farmable object or item in AtomicAssets standard.
order: 10
---

This is next article regarding game creation series, you can follow first [introduction one](https://dapplica.io/blog/wax/part-1-how-to-make-a-game-on-wax-general-concepts) if you didn’t read it yet.

Play-to-Earn (P2E) gaming is taking the web3 and blockchain world by storm, redefining how players interact with games. At the forefront? The WAX blockchain. It’s not just about virtual assets; it’s a hub for profitable farming and trading unique NFTs. WAX is where gaming meets earning, blending fun with financial potential.”

**Step 1: Crafting Your NFT Collection on WAX**

Kicking off your NFT collection? Start with a bang by picking a killer theme. Space opera, historical epic, or a fantasy world – the sky’s the limit. Your choice should resonate with your audience. It’s all about creating an NFT universe that captivates and connects.

![](/public/assets/images/tutorials/howto-create_farming_game/part2/collection_creation-980x517.png)

Collection creation screen on Atomic Hub

**1\. Collection Name**

Time to brand your NFT collection! Pick a name that’s unique and captures your project’s spirit. Keep it within 12 characters, mixing numbers and letters. No spaces allowed. Like ‘galacticgame’.

#### 2\. Display Name

This is what players see. Choose something catchy that embodies your game’s vibe. Example: ‘Galactic Game’.

#### 3\. Website URL

Add your website link where players and investors can dive deeper into your world. For instance: https://wax.io.

#### 4\. Market Fee

Decide on the trading commission for your game’s platform. Let’s say, 2% for trading your NFTs.

**5\. Collection Description**

Get creative with your collection’s description. In 3000 characters or less, make it pop with your project’s main themes and ideas.

#### 6\. Collection Images

##### Background Image

Set the scene with a background image that mirrors your game’s mood and theme.

##### Logo Image

Pick an iconic logo to represent your collection, making it instantly recognizable.

#### 7\. Social Media

Connect with your community. Add all your social links – Twitter, Medium, Facebook, GitHub, Discord, YouTube, Telegram.

These steps are your blueprint for crafting a standout NFT collection on WAX. Remember, every detail, from the name to socials, shapes your game’s appeal.

**Step 2. Description of the Process of Creating NFT items on the WAX Testnet**

**2.1 creation of a category (scheme) for NFT**

![](/public/assets/images/tutorials/howto-create_farming_game/part2/creatrschema1-980x500.png)

![](/public/assets/images/tutorials/howto-create_farming_game/part2/createschema2-980x504.png)

Schema creation screen in Atomic Hub

We will have following fields:

**name:**

Attribute type: string

Description: Represents the name of the player or object being determined.

**img :**

Attribute type: image

Description: Corresponds to a visual representation or image associated with a player or object.

**video:**

Attribute type: string

Description: Indicates any video content associated with a player or object that provides additional multimedia elements.

**slots:**

Attribute type: uint8

Description: Shows the current number of available slots for resources, items or other items in the game.

**maxSlots:**

Attribute type: uint8

Description: Indicates the maximum number of slots that can be obtained or improved in the game.

**level:**

Тип атрибуту: uint8

Опис: Вказує на рівень чи ранг гравця чи об’єкта, вказуючи на прогрес в грі.

**upgradable:**

Attribute type: bool

Description: A Boolean value indicating whether a player or object can be improved or leveled up.

**rarity:**

Attribute type: string

Description: Describes the rarity level of a player or item, noting its uniqueness or rarity.

**faction :**

Attribute type: string

Description: Represents the faction or group affiliation of a player or object in the game.

**miningBoost:**

Attribute type: float

Description: Indicates any boost or bonus associated with loot associated with a player or object.

**staking:**

Attribute Type: int32\[\]

Description: Calls the staking engine, providing information about the staking capabilities of a player or object.

**stakeableResources:**

Attribute Type: string\[\]

Description: Lists the types of resources that can be placed by a player or an object in the game.

**2.2 creation of Templates for NFT**

First we need to choose a category (scheme)

![](/public/assets/images/tutorials/howto-create_farming_game/part2/selectschema-980x222.png)

Select schema for Template

then we need enter all the data for our Template:

![](/public/assets/images/tutorials/howto-create_farming_game/part2/CreateTemplate1-980x494.png)

Creating NFT Template via Atomic Hub

after successful creation, we can see the result, such as below

![](/public/assets/images/tutorials/howto-create_farming_game/part2/templateCreated-1024x258.png)

Templates Created for Collection in Atomic Hub

**2.3 Mint NFT**

So we need to choose a category (scheme) and a template:

![](/public/assets/images/tutorials/howto-create_farming_game/part2/createtemplate-result-980x476.png)

Minting new NFT at Atomic Hub

then we enter whom to mint the NFT in Asset Receiver field and enter fields for NFT, if necessary:

![](/public/assets/images/tutorials/howto-create_farming_game/part2/createtemplate3-1-980x481.png)

This is a brief process of creating one of our main asset types in this series of articles. Now let’s proceed with another type of assets.