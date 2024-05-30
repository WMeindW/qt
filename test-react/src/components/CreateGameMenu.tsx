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
        <form onSubmit={(e) => {
            e.preventDefault();
            props.join();
        }}>
            <button onClick={(e) => {
                e.preventDefault();
                navigator.clipboard.writeText(gameId)
            }} className="menu-button">{gameId}</button>
            <input placeholder="Username"
                   onChange={(e) => Game.setName(e.target.value)}
                   className="menu-input" type={"text"} required={true}/>
            <button className="menu-submit">Submit</button>
        </form>
    </div>
}