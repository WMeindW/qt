import {Game} from "./Game";
import {Config} from "./Config";
import {Type} from "../components/home/Type";
import {Client} from "./Client";

interface FieldObject {
    type: Type,
    row: number,
    column: number,
    isActive: boolean,
    isUnderConstruction: boolean,
    broken: boolean,
    enemy: FieldObject | null,
}

interface TimeStamps {
    seconds: number;
    line: FieldObject
}

export class Timer {
    private static running: boolean;
    public static seconds: number = 0;
    public static score: number = Config.startScore;
    private static buildingPowerLines: TimeStamps[] = [];
    private static repairingPowerLines: TimeStamps[] = [];
    private static setWorkers: Function;
    private static setScore: Function;
    public static workersTime: number[] = [];
    public static workers = Config.startWorkers;
    private static houses: TimeStamps[] = [];
    private static breakTime: number = Config.breakInterval;

    static Stop(): void {
        this.running = false;
    }

    static toggleHouse(obj: FieldObject) {
        let house = this.houses.find(o => o.line.row === obj.row && o.line.column === obj.column);
        if (house === undefined) {
            this.houses.push({
                seconds: Math.round(this.seconds),
                line: obj
            });
        } else {
            if (house.line.isActive !== obj.isActive) {
                house.line = obj;
                house.seconds = Math.round(this.seconds);
            }
        }
    }

    static startBuildingPowerLine(obj: FieldObject) {
        for (const line of this.buildingPowerLines) {
            if (line.line.row === obj.row && line.line.column === obj.column) return;
        }
        this.buildingPowerLines.push({
            seconds: Math.round(this.seconds),
            line: obj
        });
        this.workersTime.push(Config.buildTime);
        this.workers--;
    }

    static fixPowerLine(obj: FieldObject) {
        for (const line of this.repairingPowerLines) {
            if (line.line.row === obj.row && line.line.column === obj.column) {
                line.seconds = Math.round(this.seconds);
                this.workersTime.push(Config.repairTime);
                this.workers--;
                return;
            }
        }
        this.repairingPowerLines.push({
            seconds: Math.round(this.seconds),
            line: obj
        });
        this.workersTime.push(Config.repairTime);
        this.workers--;
    }

    static async Start(setGrid: Function, setTime: Function, setWorkers: Function, setScore: Function, setEnemyScore: Function
    ) {
        this.running = true;
        this.setWorkers = setWorkers;
        this.setScore = setScore;
        while (this.running) {
            await new Promise<void>((resolve) => setTimeout(() => {
                resolve();
            }, 500)).then(() => {
                this.seconds += 0.5;
                if (this.seconds % 0.5 === 0)
                    this.cycle(setGrid, setTime, setEnemyScore);
            });
        }
    }

    private static cycle(setGrid: Function, setTime: Function, setEnemyScore: Function) {
        let objs = Game.getRootElementObject();
        if (this.workers > Config.startWorkers)
            this.workers = 5;
        if (Game.isMultiplayer)
            Client.getScore().then(response => {
                console.log(response);
                if (response.toString() === "lost") {
                    setGrid(Game.finishGame("Game lost!"));
                } else if (response.toString() === "won") {
                    setGrid(Game.finishGame("Game won!"));
                } else {
                    setEnemyScore(response);
                    return;
                }
                this.Stop();
            });
        if (Game.isMultiplayer) {
            Client.save(Game.getRootElementObject()).then(response => Game.mergeIncoming(response));
        }
        if (Game.isLead) {
            if (this.seconds === Config.startTimeout) {
                objs = Game.generateHome(Config.startHome);
            } else if (this.seconds % Config.houseInterval === 0) {
                objs = Game.generateHome(1);
            }
        }
        if (Number.isInteger(this.seconds))
            for (let i = 0; i < this.workersTime.length; i++) {
                this.workersTime[i]--;
            }
        this.workersTime = this.workersTime.filter(item => item > 0);
        for (let i = 0; i < this.buildingPowerLines.length; i++) {
            let lineO = this.buildingPowerLines[i];
            if (this.seconds - lineO.seconds === Config.buildTime) {
                let line = lineO.line;
                // @ts-ignore
                objs.find(o => o.row === line.row && o.column === line.column).isUnderConstruction = false;
                this.workers++;
            }
        }
        for (let i = 0; i < this.repairingPowerLines.length; i++) {
            let lineO = this.repairingPowerLines[i];
            if (this.seconds - lineO.seconds === Config.repairTime) {
                let line = lineO.line;
                // @ts-ignore
                objs.find(o => o.row === line.row && o.column === line.column).broken = false;
                // @ts-ignore
                objs.find(o => o.row === line.row && o.column === line.column).repairing = false;
                this.workers++;
            }
        }
        if (!this.running) return;
        this.updatePowerLine(objs);
        if (Number.isInteger(this.seconds))
            this.updateScore();
        this.breakPowerline(objs);
        if (Number.isInteger(this.seconds))
            setTime(this.seconds);
        setGrid(Game.getRootElement());
        this.setWorkers(Game.generateWorkers(this.workersTime));
    }

    private static updateScore() {
        for (const house of this.houses) {
            if (house.line.isActive) {
                if ((Math.round(this.seconds) - house.seconds) % Config.scoreUpInterval === 0) {
                    this.score += Config.scoreUpNumber;
                }
            } else {
                if ((Math.round(this.seconds) - house.seconds) % Config.scoreDownInterval === 0) {
                    this.score -= Config.scoreDownNumber;
                }
            }
        }
        if (this.score < 0)
            this.score = 0;
        else if (this.score > Config.startScore)
            this.score = Config.startScore;
        this.setScore(this.score);
        /*let houses = objs.filter(o => o.type === Type.House);
        let activeHouses = houses.filter(o => o.isActive).length;
        if ((this.seconds + 8) % Config.scoreDownInterval === 0) {
            this.score -= Config.scoreDownNumber * (houses.length - activeHouses);
        }
        if ((this.seconds + 8) % Config.scoreUpInterval === 0) {
            this.score += Config.scoreUpNumber * activeHouses;
        }
        if (this.score < 0)
            this.score = 0;
        else if (this.score > 100)
            this.score = 100;
        this.setScore(this.score);*/
    }

    private static updatePowerLine(objs: FieldObject[]) {
        const visited = new Set<FieldObject>();

        function getNeighbors(obj: FieldObject): FieldObject[] {
            return objs.filter(o =>
                ((o.column === obj.column && Math.abs(o.row - obj.row) === 1) ||
                    (o.row === obj.row && Math.abs(o.column - obj.column) === 1))
                && (o.type === Type.Powerline || o.type === Type.House) && !o.isUnderConstruction && !o.broken
            );
        }

        function dfs(obj: FieldObject, visited: Set<FieldObject>): void {
            if (visited.has(obj)) return;
            visited.add(obj);
            obj.isActive = true;
            if (obj.type === Type.House) return;
            const neighbors = getNeighbors(obj);
            //console.log(neighbors.filter(o => o.type === Type.House));
            for (const neighbor of neighbors) {
                if (!neighbor.isActive) {
                    dfs(neighbor, visited);
                }
            }
        }

        for (const obj of objs) {
            if (obj.type === Type.Powerline || Type.House) obj.isActive = false;
        }
        const plant = objs.find(obj => obj.type === Type.Powerplant);
        if (!plant) {
            console.log("No always active/Powerplant");
            return;
        }
        dfs(plant, visited);
        return visited;
    }

    private static breakPowerline(objs: FieldObject[]) {
        if (!Number.isInteger(this.seconds)) return;
        if (this.seconds !== this.breakTime) return;
        let lines = objs.filter(obj => obj.type === Type.Powerline && !obj.isUnderConstruction);
        if (lines.length === 0) return;
        let line = lines[Math.floor(Math.random() * (lines.length))];
        // @ts-ignore
        line = objs.find(o => o.row === line.row && o.column === line.column);
        if (line === undefined) return;
        line.broken = true;
        line.isActive = false;
        this.breakTime = Config.breakInterval + this.seconds + Math.floor(Math.random() * (10) - 5);
        console.log(this.breakTime);
    }


}