import axios from 'axios';
import {Config} from "./Config";
import {Type} from "../components/home/Type";
import {Game} from "./Game";
import {Timer} from "./Timer";

interface FieldObject {
    type: Type,
    row: number,
    column: number,
    isActive: boolean,
    isUnderConstruction: boolean,
    broken: boolean,
    repairing: boolean,
    enemy: FieldObject | null,
}

export class Client {

    static async createGame(fields: FieldObject[]): Promise<string> {
        try {
            const response = await axios({
                method: 'post',
                url: Config.requestRoute + "/create",
                data: {
                    fields: fields
                }
            });
            return response.data;
        } catch (err: any) {
            return err.message;
        }
    }

    static async joinGame(name: string, isLead: boolean): Promise<string> {
        try {
            const response = await axios({
                method: 'get',
                url: Config.requestRoute + "/join?name=" + name + "&isLead=" + isLead + "&id=" + Game.securityToken,
            });
            return response.data;
        } catch (err: any) {
            return err.message;
        }
    }

    static async hasStarted(): Promise<string> {
        try {
            const response = await axios({
                method: 'get',
                url: Config.requestRoute + "/started?id=" + Game.securityToken,
            });
            return response.data;
        } catch (err: any) {
            return err.message;
        }
    }

    static async save(fields: FieldObject[]): Promise<FieldObject[]> {
        try {
            const response = await axios({
                method: 'post',
                url: Config.requestRoute + "/save",
                data: {
                    score: Timer.score,
                    isLead: Game.isLead,
                    id: Game.securityToken,
                    fields: fields
                }
            });
            return response.data;
        } catch (err: any) {
            return err;
        }
    }

    static async getScore() {
        try {
            const response = await axios({
                method: 'get',
                url: Config.requestRoute + "/score?id=" + Game.securityToken + "&isLead=" + Game.isLead,
            });
            let res;
            res = response.data;
            if (response.data === "")
                res = Config.startScore;
            return res;
        } catch (err: any) {
            return err;
        }
    }

    static async Start() {
        while (!Game.started) {
            await new Promise<void>((resolve) => setTimeout(() => {
                resolve();
            }, 250)).then(() => {

                this.hasStarted().then((response) => {
                    if (response.toString().includes("true")) {
                        if (Game.isLead) {
                            Game.enemyPlayerName = response.toString().split(",")[1];
                        } else {
                            Game.enemyPlayerName = response.toString().split(",")[2];
                        }
                        Game.started = true;
                    }

                });
            });
        }
    }

}