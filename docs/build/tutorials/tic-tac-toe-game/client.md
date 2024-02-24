---
title: Game Client
order: 2
---

# Tic Tac Toe: Game Client

This tic-tac-toe contract provides an example of building a game on WAX, complete with secure use of random values to determine game outcomes.

[Frontend Tutorial on github.com](https://github.com/worldwide-asset-exchange/tic-tac-toe-front-end)

This will guide you how to make the Tictactoe game contract which run on Wax blockchain. Logic of the tictactoe game follow the eosio sample at Tic-tac-toe Game EOS tutorial, but we'll add more logic that support randomize the first turner and random game move if playing with bot.


### How To Play

[Tic Tac Toe](https://tictactoe.wax.io/) is a classic game enjoyed by people of all ages. It's simple to learn but can be surprisingly strategic. Here's a step-by-step guide on how to play:

1. **Setup**: Click `Play Game`
<img src="/assets/images/tutorials/tic-tac-toe/splash.png"/>
And choose `New Game`
<img src="/assets/images/tutorials/tic-tac-toe/new_game.png"/>

2. **Players**: Tic Tac Toe is typically played by two players. One player is assigned "X" and the other "O".
<img src="/assets/images/tutorials/tic-tac-toe/new_game_popup.png"/>

3. **Objective**: The goal is to be the first to create a row of three of your marks (X's or O's) either horizontally, vertically, or diagonally.

4. **Gameplay**: Players take turns placing their mark (X or O) in an empty square on the grid.

5. **Turns**: The player assigned "X" usually goes first, followed by the player assigned "O". Players continue taking turns until one player wins or the grid is full (resulting in a tie).
<img src="/assets/images/tutorials/tic-tac-toe/playing_game.png"/>

6. **Winning**: A player wins the game if they successfully create a row of three of their marks either horizontally, vertically, or diagonally. If a player achieves this, they declare "Tic Tac Toe!" and are declared the winner.

7. **Ties**: If all squares are filled without either player achieving three in a row, the game ends in a tie.
<img src="/assets/images/tutorials/tic-tac-toe/winner.png"/>

**Notes: The winner of the game will get a reward of 10 TIC token (the token issued by the game)**

8. **Rematch**: Players can easily start a new game and beginning again.


## 🛠️ Technologies Utilized

- **Vite**: Elevate your development workflow with Vite, a toolset tailored for swift and efficient web project creation.
- **WAXP Blockchain**: Embrace the decentralized ethos with the WAXP blockchain, fostering secure, transparent smart contract interactions for gaming experiences.
  

## 🚀 Getting Started


Ensure the following prerequisites are met before embarking on your journey:

```
Node.js (Version: 16.16.0) or Yarn (Version: 1.22.17) & npm (Version: 9.6.7) installed on your machine.
```

### 📋 Installation & Setup

1. **Clone the Repository**:
```
git clone git@github.com:worldwide-asset-exchange/tic-tac-toe-front-end.git
```

2. **Navigate to the Project Directory**:
```
cd tic-tac-toe-front-end
```

3. **Install Dependencies**:
```
npm install
```
**OR**
```
yarn
```

4. **Configure Environment Variables**:
Create a `.env` file with the following configuration:
```env
VITE_PUBLIC_URL=http://localhost:5173
```

5. **Initiate Development Server**:
```
npm run dev
```
**OR**
```
yarn run dev
```

6. **Access & Engage**:
Navigate to `http://localhost:5173` and immerse yourself in the blockchain-powered Tic Tac Toe experience.


### 🐳 Docker Integration

To quickly setup a development environment the tutorial is using Docker.

#### 🛠️ Build & Launch Containers

Execute the following command in your terminal within the project directory:
```
docker-compose up --build
```

Access your application at `http://localhost:5173` (or the designated port as specified in your [docker-compose.yml](docker-compose.yml)).

#### 🛑 Terminate Containers

To gracefully halt and remove containers, execute:
```
docker-compose down
```
