---
title: Part 3. Farming NFT creation on Atomic Hub
order: 15
---

In our last article, we walked you through creating a collection and item. Now, let's step up the game and focus on crafting a farming item.

### 3.1 Creating a Category (Scheme) for NFTs

It's all about laying the groundwork for your NFTs. We'll dive into setting up a category or scheme that defines how your farming items will function and stand out."

![](/public/assets/images/tutorials/howto-create_farming_game/part3/creatingSchema-1024x467.png)

Creating Schema

![](/public/assets/images/tutorials/howto-create_farming_game/part3/creatingSchemaEnd-1024x427.png)
Creating Schema

name:

Attribute Type: string

Description: Represents the name of the player, character, or object within the game.

img (image):

Attribute Type: image

Description: Corresponds to the visual representation or image associated with the player, character, or object.

video:

Attribute Type: string

Description: Refers to any video content linked to the player, character, or object, providing additional multimedia elements.

farmResource:

Attribute Type: string

Description: Specifies the type of resource that can be farmed or harvested by the player or object.

amount:

Attribute Type: float

Description: Represents the quantity or amount of the farmed resource.

level:

Attribute Type: uint8

Description: Denotes the level or rank of the player, character, or object, showcasing progression within the farming aspect of the game.

upgradable:

Attribute Type: bool

Description: A boolean value indicating whether the farming resource, player, or object can be upgraded.

rewardInterval:

Attribute Type: uint32

Description: Indicates the time interval (in seconds) between each reward or harvest cycle.

rarity:

Attribute Type: uint32

Description: Specifies the rarity level of the player, character, or object in the context of farming, distinguishing it in terms of uniqueness or scarcity.

faction:

Attribute Type: string

Description: Represents the faction or group affiliation of the player or object within the farming aspect of the game.

lastClaim:

Attribute Type: uint32

Description: Indicates the timestamp or information regarding the last time the resource was claimed or harvested.

maxLevel:

Attribute Type: uint32

Description: Specifies the maximum level that the farming resource, player, or object can attain.

initialAmount:

Attribute Type: uint8

Description: Represents the initial quantity or amount of the farmed resource when starting the game or acquiring the object.

miningRate:

Attribute Type: float

Description: Indicates the rate at which the farming resource is generated or harvested over time.

3.1 Creating NFT Templates

First things first: select the right category (or scheme) for your NFT template. It's like choosing the perfect mold for your farming item -- critical for shaping its identity and function.

![](/public/assets/images/tutorials/howto-create_farming_game/part3/create-new-template-1024x524.png)
New Template Creation via Atomic Hub

Next up, it's time to bring your NFT to life. Upload the image that'll represent your farming item and fill in the necessary fields to give it character and context.

![](/public/assets/images/tutorials/howto-create_farming_game/part3/temp1-1024x536.png)
Creation of NFT Template

![](/public/assets/images/tutorials/howto-create_farming_game/part3/temp2-1024x499.png)
this is what the created template looks like:

![](/public/assets/images/tutorials/howto-create_farming_game/part3/tempres-1024x262.png)
Creation of NFT Template completed

3.1 Mint NFT

First, we need to choose a category (scheme) and a template:

![](/public/assets/images/tutorials/howto-create_farming_game/part3/mintNFT-1024x502.png)
Minting NFT

Then, decide if need to update the NFT data and consider adding extra details if needed. Keep in mind, the data in your NFT can be static or dynamic, changing as the game progresses or based on other logic. It's like giving your NFT a personality that evolves!

![](/public/assets/images/tutorials/howto-create_farming_game/part3/mintNFTend-1024x542.png)
Minting NFT and sending to receiver

After creation, our NFT will be displayed in the user's inventory and can be used in the future in our game.

In next article we will explain tokens and resources that are needed for our game.