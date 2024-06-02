Fight The Blackout - Documentation
==================================

Introduction
------------

**Fight The Blackout** is a web-based game developed by student Daniel Linda during an internship at ČEZ. The game
challenges players to manage a power grid, keeping consumption points connected while dealing with faults and managing
resources.

Configuration
-------------

The game includes a configuration file (`config`) that contains important settings. These settings can be adjusted as
needed to customize the game experience.

Game Modes
----------

The game features two modes:

* **Multiplayer Mode:** Allows two players to compete against each other.
* **Singleplayer Mode:** Designed for one player to play alone.

Gameplay
--------

The game consists of 600 basic tiles. At the start of the game, a power plant is randomly generated. After five seconds,
two consumption points are generated.

The goal is to connect the consumption points to the power grid. Players have five workers to use for building new lines
or repairing existing ones. Building and repairing is done by clicking on the tiles.

Game Mechanics
--------------

Every 60 seconds, a fault appears somewhere on the grid. Players must repair the fault by clicking on it.

The game ends if the score drops to zero or if the player survives for five minutes.

Score calculation:

* +1 point every 20 seconds for each connected consumption point.
* \-2 points every 10 seconds for each unconnected consumption point.
