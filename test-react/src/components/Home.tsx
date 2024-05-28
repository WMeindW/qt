import {Game} from "../service/Game";
import {ReactElement, useEffect, useState} from "react";
import {Config} from "../service/Config";
import {Timer} from "../service/Timer";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHourglass} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    let game = Game.getRootElement();
    const [score, setScore] = useState(Config.startScore);
    const [seconds, setSeconds] = useState(0);
    const [time, setTime] = useState("00:00");
    const [workers, setWorkers] = useState(Game.generateWorkers(Timer.workersTime));
    const [grid, setGrid] = useState<ReactElement>(game);

    useEffect(() => {
        let minutes = Number.parseInt(Number(seconds / 60).toString());
        let sec = (seconds - minutes * 60).toString();
        if (sec.length === 1)
            sec = "0" + sec;
        setTime("0" + minutes.toString() + ":" + sec);
        if (minutes >= 5) {
            Timer.Stop();
            setGrid(Game.finishGame("Game won!"));
        } else if (score === 0) {
            Timer.Stop();
            setGrid(Game.finishGame("Game lost!"));
        }

    }, [seconds]);

    useEffect(() => {
        Timer.Start(setGrid, setSeconds, setWorkers, setScore);
    }, []);

    return <main>
        <header>
            <div className="header-info"><FontAwesomeIcon style={{marginRight:"5px",height:"18px"}} icon={faHourglass}/> {time}</div>
            <div id={"score"} className="header-info">CX: {score}</div>
            <div className="header-info">{workers}</div>
        </header>
        {grid}
    </main>
}