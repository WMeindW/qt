Fight The Blackout - API Documentation
======================================

Introduction
------------

This document provides an overview of the API endpoints for the **Fight The Blackout** game, developed by Daniel Linda during an internship at ČEZ. The API is used to manage game states, including creating games, joining games, starting games, saving game states, and retrieving scores.

API Endpoints
-------------

### Create Game

Creates a new game with the specified fields.

    POST /create

**Request Body:**

    {
        "fields": "fieldData"
    }

**Response:** Plain text indicating the result of the game creation process.

### Join Game

Allows a player to join an existing game.

    GET /join

**Parameters:**

*   `name` (string) - The name of the player.
*   `isLead` (boolean) - Indicates if the player is the leader.
*   `id` (string) - The ID of the game to join.

**Response:** Plain text indicating the result of the join operation.

### Check if Game Started

Checks if a game has started.

    GET /started

**Parameters:**

*   `id` (string) - The ID of the game.

**Response:** Plain text indicating if the game has started.

### Save Game

Saves the current state of the game.

    POST /save

**Request Body:**

    {
        "score": "currentScore",
        "isLead": true/false,
        "id": "gameId",
        "fields": "fieldData"
    }

**Response:** JSON array of game fields representing the saved state.

### Get Score

Retrieves the current score of the game.

    GET /score

**Parameters:**

*   `id` (string) - The ID of the game.
*   `isLead` (boolean) - Indicates if the requester is the leader.

**Response:** Plain text representing the current score.