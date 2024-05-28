import {Game} from "../service/Game";
import {ReactElement, useState} from "react";

interface Props {
    join: Function;
    statusElement: ReactElement
}

export function JoinGameMenu(props: Props) {
    const [status, setStatus] = useState(props.statusElement);
    return <div className="menu">
        <form onSubmit={(e) => {
            e.preventDefault();
            props.join();
            console.log("Submit")
        }}>
            <input placeholder="Username"
                   onChange={(e) => Game.setName(e.target.value)}
                   className="menu-input" type={"text"} required={true}/>
            <input placeholder="Id"
                   onChange={(e) => Game.setSecurityToken(e.target.value)}
                   className="menu-input" type={"text"} required={true}/>
            <button className="menu-submit">Submit</button>
        </form>
        {status}
    </div>
}