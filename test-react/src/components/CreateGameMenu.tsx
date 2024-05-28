import {useState} from "react";
import {Game} from "../service/Game";

interface Props {
    id: Promise<string>;
    join: Function;
}

export function CreateGameMenu(props: Props) {
    const [gameId, setGameId] = useState("");
    props.id.then(response =>
        setGameId(response)
    )
    return <div className="menu">
        <button onClick={() => {
            navigator.clipboard.writeText(gameId)
        }} className="menu-button">{gameId}</button>
        <form onSubmit={(e) => {
            e.preventDefault();
            props.join();
        }}
        ><input placeholder="Username"
                onChange={(e) => Game.setName(e.target.value)}
                className="menu-input" type={"text"} required={true}/>
            <button className="menu-submit">Submit</button>
        </form>
    </div>
}