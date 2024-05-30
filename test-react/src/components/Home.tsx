import {Game} from "../service/Game";
import {ReactElement, useEffect, useState} from "react";
import {Config} from "../service/Config";
import {Timer} from "../service/Timer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHourglass, faUser} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    let game = Game.getRootElement();
    const [score, setScore] = useState(Config.startScore);
    const [seconds, setSeconds] = useState(0);
    const [time, setTime] = useState("00:00");
    const [workers, setWorkers] = useState(Game.generateWorkers(Timer.workersTime));
    const [grid, setGrid] = useState<ReactElement>(game);
    const [name, setName] = useState(<div></div>);
    const [enemyScore, setEnemyScore] = useState("");
    useEffect(() => {
        let minutes = Number.parseInt(Number(seconds / 60).toString());
        let sec = (seconds - minutes * 60).toString();
        if (sec.length === 1)
            sec = "0" + sec;
        setTime("0" + minutes.toString() + ":" + sec);

        if (!Game.isMultiplayer) {
            if (minutes >= Config.finishMinutes) {
                Timer.Stop();
                setGrid(Game.finishGame("Game won!"));
            } else if (score === 0) {
                Timer.Stop();
                setGrid(Game.finishGame("Game lost!"));
            }
        } else {
            if (minutes >= Config.finishMinutes) {
                Timer.Stop();
                if (score > Number(enemyScore)) {
                    setGrid(Game.finishGame("Game won!"));
                } else if (score < Number(enemyScore)) {
                    setGrid(Game.finishGame("Game lost!"));
                } else {
                    setGrid(Game.finishGame("Draw!"));
                }
            }
        }
    }, [enemyScore, score, seconds]);

    useEffect(() => {
        Timer.Start(setGrid, setSeconds, setWorkers, setScore, setEnemyScore);
        let nameElement = Game.isMultiplayer ? <><FontAwesomeIcon icon={faUser}/>
            <div>{Game.enemyPlayerName}</div>
        </> : <div></div>;
        setName(nameElement);
        if (Game.isMultiplayer) {
            setEnemyScore(Config.startScore.toString());
        }
    }, []);

    return <main>
        <header>
            <h4 className="header-info"><FontAwesomeIcon style={{marginRight: "5px", height: "18px"}}
                                                          icon={faHourglass}/> {time}</h4>
            <h4 id={"score"} className="header-info">CX: {score}</h4>
            <div className="header-info">{workers}</div>
            <h4 className="header-name">{name}</h4>
            <h4 className="header-score">{enemyScore}</h4>
        </header>
        {grid}
    </main>
}