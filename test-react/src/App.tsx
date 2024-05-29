import {useState} from "react";
import Home from "./components/Home";
import {Settings} from "./components/Settings";
import {Game} from "./service/Game";
import {CreateGameMenu} from "./components/CreateGameMenu";
import {JoinGameMenu} from "./components/JoinGameMenu";
import {Loading} from "./components/Loading";
import {Client} from "./service/Client";

export function App() {
    const [state, setState] = useState(<Settings startGame={() => startGame()}
                                                 createGame={() => createGame()}
                                                 joinGameMenu={() => joinGameMenu()}></Settings>);

    function startGame() {
        Game.isMultiplayer = false;
        Game.isLead = true;
        setState(<Home></Home>);
    }

    function createGame() {
        Game.isLead = true;
        setState(<CreateGameMenu id={Game.createGame()} join={() => joinGame()}></CreateGameMenu>);
    }

    function joinGameMenu() {
        Game.isLead = false;
        setState(<JoinGameMenu join={() => joinGame()} statusElement={<div></div>}></JoinGameMenu>);
    }

    function joinGame() {
        Game.joinGame().then(response => startMultiplayerGame(response))
    }

    function startMultiplayerGame(response: string) {
        console.log(response);
        if (response.toString() === "true") {
            console.log("joined");
            setState(<Loading></Loading>);
            console.log("started waiting");

            Client.Start().then(() => Client.save(Game.getRootElementObject()).then(response => {
                Game.mergeIncoming(response);
                setState(<Home></Home>);
            }));


        } else {
            setState(<Settings startGame={() => startGame()}
                               createGame={() => createGame()}
                               joinGameMenu={() => joinGameMenu()}></Settings>);
        }
    }

    return state;
}