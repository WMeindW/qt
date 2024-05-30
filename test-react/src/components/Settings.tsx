interface Props {
    startGame: Function;
    createGame: Function;
    joinGameMenu: Function;
}

export function Settings(props: Props) {

    return <div className="menu">
        <h2>Fight The Blackout!</h2>
        <button onClick={() => props.startGame()} className="menu-button">Single Player</button>
        <button onClick={() => props.createGame()} className="menu-button">Host Multiplayer</button>
        <button onClick={() => props.joinGameMenu()} className="menu-button">Join Multiplayer</button>
        <h4 className="settings-text">Vytvořil Daniel Linda v rámci stáže v <img className="settings-img" src="/d2.svg"
                                                                                 alt=""/></h4>
    </div>;
}