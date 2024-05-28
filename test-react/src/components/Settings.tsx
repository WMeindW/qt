interface Props {
    startGame: Function;
    createGame: Function;
    joinGameMenu: Function;
}

export function Settings(props: Props) {

    return <div className="menu">
        <button onClick={() => props.startGame()} className="menu-button">Play</button>
        <button onClick={() => props.createGame()} className="menu-button">Create Game</button>
        <button onClick={() => props.joinGameMenu()} className="menu-button">Join Game</button>
    </div>;
}