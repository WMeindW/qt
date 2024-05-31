import React, {ReactElement} from "react";
import {Config} from "./Config";
import {Empty} from "../components/home/Empty";
import {House} from "../components/home/House";
import {Powerline} from "../components/home/Powerline";
import {Timer} from "./Timer";
import {Type} from "../components/home/Type";
import {Field} from "../components/home/Field";
import {Powerplant} from "../components/home/Powerplant";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faScrewdriverWrench} from "@fortawesome/free-solid-svg-icons";
import {Client} from "./Client";

interface FieldObject {
    type: Type,
    row: number,
    column: number,
    isActive: boolean,
    isUnderConstruction: boolean,
    enemy: FieldObject | null,
    broken: boolean,
    repairing: boolean
}

export class Game {
    private static fieldObjects: FieldObject[] = []
    public static securityToken: string;
    private static playerName: string;
    public static isMultiplayer: boolean;
    public static isLead: boolean;
    public static started: boolean;
    public static enemyPlayerName: string;

    static setName(name: string | null): void {
        if (name == null || name.includes(" ") || name.length > 6) return;
        this.playerName = name;
    }

    static setRootElementObject(objs: FieldObject[]) {
        this.fieldObjects = objs;
    }

    static getRootElementObject(): FieldObject[] {

        return this.fieldObjects;
    }

    static setSecurityToken(id: string) {
        this.securityToken = id;
    }

    static getRootElement(): ReactElement {
        let board: ReactElement<Field>[] = [];
        let objs = this.fieldObjects;
        if (objs.length === 0 && this.isLead)
            objs = this.generate();
        for (let i = 0; i < objs.length; i++) {
            let obj = objs[i];

            if (obj.type === Type.House) {
                let element: ReactElement<House> = <House column={obj.column} key={i} row={obj.row}
                                                          isActive={obj.isActive}
                                                          isUnderConstruction={false}
                                                          type={Type.House} enemy={obj.enemy} broken repairing></House>;
                board.push(element);
            } else if (obj.type === Type.Powerline) {
                let element: ReactElement<Powerline> = <Powerline column={obj.column} key={i}
                                                                  row={obj.row} isActive={obj.isActive}
                                                                  isUnderConstruction={obj.isUnderConstruction}
                                                                  type={Type.Powerline} enemy={obj.enemy}
                                                                  broken={obj.broken}
                                                                  repairing={obj.repairing}></Powerline>;

                board.push(element);
            } else if (obj.type === Type.Powerplant) {
                let element: ReactElement<Powerplant> = <Powerplant column={obj.column} key={i}
                                                                    row={obj.row} isActive={obj.isActive}
                                                                    isUnderConstruction={obj.isUnderConstruction}
                                                                    type={Type.Powerplant} enemy={obj.enemy}
                                                                    broken repairing></Powerplant>;
                board.push(element);
            } else {
                let element: ReactElement<Empty> = <Empty column={obj.column} key={i}
                                                          row={obj.row} isActive={obj.isActive}
                                                          isUnderConstruction={obj.isUnderConstruction}
                                                          type={Type.Empty} enemy={obj.enemy} broken repairing></Empty>;
                board.push(element);
            }
        }
        return React.createElement("div", {
            className: "main-grid",
            style: {
                gridTemplateColumns: `repeat(${Config.columns}, 1fr)`,
                gridTemplateRows: `repeat(${Config.rows}, 1fr)`
            }
        }, board);
    }

    static mergeIncoming(array: FieldObject[]) {
        let objs = this.fieldObjects;
        let merged: FieldObject[] = [];
        for (let i = 0; i < array.length; i++) {
            let a = array[i];
            // @ts-ignore
            if (a.type === "POWERPLANT") {
                merged.push({
                    type: Type.Powerplant,
                    row: a.row,
                    column: a.column,
                    isActive: true,
                    isUnderConstruction: false,
                    enemy: null,
                    broken: false,
                    repairing: false,
                });
                // @ts-ignore
            } else if (a.type === "HOUSE") {
                merged.push({
                    type: Type.House,
                    row: a.row,
                    column: a.column,
                    isActive: a.isActive,
                    isUnderConstruction: false,
                    enemy: null,
                    broken: false,
                    repairing: false,
                });
                // @ts-ignore
            } else if (a.type === "POWERLINE") {
                let line: FieldObject = {
                    type: Type.Powerline,
                    row: a.row,
                    column: a.column,
                    isActive: a.isActive,
                    isUnderConstruction: a.isUnderConstruction,
                    enemy: null,
                    broken: a.broken,
                    repairing: a.repairing,
                }
                let obj = objs[i];
                obj.enemy = line;
                /*if (line.broken && !line.repairing && obj.type === Type.Powerline) {
                    obj.broken = true;
                    obj.isActive = false;
                }*/
                merged.push(obj);
            } else {
                if (objs[i] !== undefined) {
                    merged.push(objs[i]);
                } else {
                    merged.push({
                        type: Type.Empty,
                        row: a.row,
                        column: a.column,
                        isActive: false,
                        isUnderConstruction: false,
                        enemy: null,
                        broken: false,
                        repairing: false,
                    });
                }

            }

        }
        return this.fieldObjects = merged;
    }

    static generate(): FieldObject[] {
        let objs: FieldObject[] = [];
        let column: number = 0;
        let row: number = 0;
        for (let i = 0; i < Config.columns * Config.rows; i++) {
            column = i % Config.columns;
            objs.push({
                type: Type.Empty,
                row: row,
                column: column,
                isActive: false,
                isUnderConstruction: false,
                enemy: null,
                broken: false,
                repairing: false,
            })
            if (column === Config.columns - 1)
                row++;
        }
        objs = this.generatePowerPlant(objs);
        return this.fieldObjects = objs;
    }

    static generateHome(count: number) {
        let objs = this.fieldObjects;
        let plants: FieldObject[] = [];
        for (const child of objs) {
            if (child.type === Type.Powerplant) {
                plants.push(child);
            }
        }
        for (let i = 0; i < count; i++) {
            let accepted: boolean = false;
            let childRow = 0;
            let childCol = 0;
            let rand: number = 0;
            while (!accepted) {
                rand = Math.floor(Math.random() * (objs.length));
                if (objs[rand].type !== Type.Empty) continue;
                childRow = objs[rand].row;
                childCol = objs[rand].column;
                for (const plant of plants) {
                    accepted = Math.abs(childRow - plant.row) > 1 || Math.abs(childCol - plant.column) > 1;
                }
            }
            objs[rand] = {
                type: Type.House,
                row: childRow,
                column: childCol,
                isActive: false,
                isUnderConstruction: false,
                enemy: null,
                broken: false,
                repairing: false,
            }
        }
        return this.fieldObjects = objs;
    }

    static buildPowerLine(row: number, column: number) {
        if (Timer.workers <= 0) return;
        let objs = this.fieldObjects;
        for (let i = 0; i < objs.length; i++) {
            if (objs[i].row === row && objs[i].column === column) {
                console.log("constructed")
                objs[i] = {
                    type: Type.Powerline,
                    row: row,
                    column: column,
                    isActive: false,
                    isUnderConstruction: true,
                    enemy: null,
                    broken: false,
                    repairing: false,
                }
                Timer.startBuildingPowerLine(objs[i]);
            }
        }
    }

    static fixPowerLine(obj: Field) {
        if (Timer.workers <= 0) return;
        let line = this.fieldObjects.find(o => o.row === obj.row && o.column === obj.column);
        console.log(line);
        if (line === undefined || !line.broken) return;
        line.repairing = true;
        Timer.fixPowerLine(line);
    }

    static houseActive(obj: Field) {
        Timer.toggleHouse({
            type: Type.House,
            row: obj.props.row,
            column: obj.props.column,
            isActive: obj.props.isActive,
            isUnderConstruction: false,
            enemy: null,
            broken: false,
        });
    }

    static finishGame(text: string) {
        let finishText = <h5 key={1} className={"game-finish-text"}>{text}</h5>
        let score = <h6 className={"game-finish-text-score"}
                        key={2}>{"CX: " + Timer.score + "/" + Config.startScore}</h6>;
        console.log(score);
        return React.createElement("div", {
            className: "game-finish",
            children: [finishText, score]
        });
    }

    static generateWorkers(workersTime: number[]) {
        let workers: ReactElement[] = [];
        let time = workersTime.sort((a, b) => b - a);
        for (let i = 0; i < Config.startWorkers - time.length; i++) {
            workers.push(<div key={i} className="worker"><FontAwesomeIcon icon={faScrewdriverWrench}/></div>)
        }
        for (let i = 0; i < workersTime.length; i++) {
            workers.push(<div key={i + workers.length} className="worker worker-off">{workersTime[i]}</div>);
        }
        return React.createElement("div", {className: "header-workers"}, workers)
    }

    static async createGame() {
        this.isMultiplayer = true;
        return this.securityToken = await Client.createGame(Game.generate());
    }

    static async joinGame() {
        this.isMultiplayer = true;
        return await Client.joinGame(this.playerName, this.isLead);
    }

    private static generatePowerPlant(objs: FieldObject[]) {
        let rand = Math.floor(Math.random() * (objs.length));
        let row = objs[rand].row;
        let column = objs[rand].column;
        objs[rand] = {
            type: Type.Powerplant,
            row: row,
            column: column,
            isActive: true,
            isUnderConstruction: false,
            enemy: null,
            broken: false,
            repairing: false,
        }
        return objs;
    }

}