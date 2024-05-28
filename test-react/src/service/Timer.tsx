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
    private static score: number = Config.startScore;
    private static buildingPowerLines: TimeStamps[] = [];
    private static repairingPowerLines: TimeStamps[] = [];
    private static setWorkers: Function;
    private static setScore: Function;
    public static workersTime: number[] = [];
    public static workers = Config.startWorkers;

    static Stop(): void {
        this.running = false;
    }

    static startBuildingPowerLine(obj: FieldObject) {
        this.buildingPowerLines.push({
            seconds: Math.round(this.seconds),
            line: obj
        });
        this.workersTime.push(Config.buildTime);
        this.workers--;
    }

    static fixPowerLine(obj: FieldObject) {
        for (const line of this.repairingPowerLines) {
            if (line.line.row === obj.row && line.line.column === obj.column) return;
        }
        this.repairingPowerLines.push({
            seconds: Math.round(this.seconds),
            line: obj
        });
        this.workersTime.push(Config.repairTime);
        this.workers--;
    }

    static async Start(setGrid: Function, setTime: Function, setWorkers: Function, setScore: Function
    ) {
        this.running = true;
        this.setWorkers = setWorkers;
        this.setScore = setScore;
        while (this.running) {
            await new Promise<void>((resolve) => setTimeout(() => {
                resolve();
            }, 1000)).then(() => {
                this.seconds += 0.5;
                if (Number.isInteger(this.seconds))
                    this.cycle(setGrid, setTime);
            });
        }
    }

    private static cycle(setGrid: Function, setTime: Function) {
        let objs = Game.getRootElementObject();
        if (Game.isLead) {
            if (this.seconds === Config.startTimeout) {
                objs = Game.generateHome(Config.startHome);
            } else if (this.seconds % Config.houseInterval === 0) {
                objs = Game.generateHome(1);
            }
        }
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
        Game.setRootElementObject(objs);
        this.updatePowerLine(objs);
        this.updateScore(objs);
        if (this.seconds % Config.breakInterval === 0) this.breakPowerline(objs);
        setTime(this.seconds);
        this.setWorkers(Game.generateWorkers(this.workersTime));
        setGrid(Game.getRootElement());
        if (Game.isMultiplayer)
            Client.save(Game.getRootElementObject()).then(response => Game.mergeIncoming(response));
    }

    private static updateScore(objs: FieldObject[]) {
        let houses = objs.filter(o => o.type === Type.House);
        let activeHouses = houses.filter(o => o.isActive).length;
        if (this.seconds % Config.scoreDownInterval === 0) {
            this.score -= Config.scoreDownNumber * (houses.length - activeHouses);
        }
        if (this.seconds % Config.scoreUpInterval === 0) {
            this.score += Config.scoreUpNumber * activeHouses;
            console.log(Config.scoreUpNumber * activeHouses)
        }
        if (this.score < 0)
            this.score = 0;
        else if (this.score > 100)
            this.score = 100;
        this.setScore(this.score);
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
            throw new Error("No always active object found.");
        }
        dfs(plant, visited);
        return visited;
    }

    private static breakPowerline(objs: FieldObject[]) {
        let lines = objs.filter(obj => obj.type === Type.Powerline && !obj.isUnderConstruction);
        if (lines.length === 0) return;
        let line = lines[Math.floor(Math.random() * (lines.length))];
        // @ts-ignore
        line = objs.find(o => o.row === line.row && o.column === line.column);
        if (line === undefined) return;
        line.broken = true;
        line.isActive = false;
    }


}