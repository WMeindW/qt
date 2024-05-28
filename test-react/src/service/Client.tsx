import axios from 'axios';
import {Config} from "./Config";
import {Type} from "../components/home/Type";
import {Game} from "./Game";

interface FieldObject {
    type: Type,
    row: number,
    column: number,
    isActive: boolean,
    isUnderConstruction: boolean,
    broken: boolean,
    repairing: boolean
}

export class Client {
    public static seconds: number = 0;

    static async createGame(fields: FieldObject[]): Promise<string> {
        try {
            const response = await axios({
                method: 'post',
                url: Config.requestRoute + "/create",
                data: {
                    fields: fields
                }
            });
            return response.data;  // Assuming you want to return the response data as a string
        } catch (err: any) {
            return err.message;  // Return the error message
        }
    }

    static async joinGame(name: string, isLead: boolean): Promise<string> {
        try {
            const response = await axios({
                method: 'get',
                url: Config.requestRoute + "/join?name=" + name + "&isLead=" + isLead + "&id=" + Game.securityToken,
            });
            return response.data;  // Assuming you want to return the response data as a string
        } catch (err: any) {
            return err.message;  // Return the error message
        }
    }

    static async hasStarted(): Promise<string> {
        try {
            const response = await axios({
                method: 'get',
                url: Config.requestRoute + "/started?id=" + Game.securityToken,
            });
            return response.data;  // Assuming you want to return the response data as a string
        } catch (err: any) {
            return err.message;  // Return the error message
        }
    }

    static async save(fields: FieldObject[]): Promise<string> {
        try {
            const response = await axios({
                method: 'post',
                url: Config.requestRoute + "/save",
                data: {
                    isLead: Game.isLead,
                    id: Game.securityToken,
                    fields: fields
                }
            });
            return response.data;  // Assuming you want to return the response data as a string
        } catch (err: any) {
            return "error";  // Return the error message
        }
    }

    static async Start() {
        while (!Game.started) {
            await new Promise<void>((resolve) => setTimeout(() => {
                resolve();
            }, 1000)).then(() => {
                this.seconds += 0.5;
                if (Number.isInteger(this.seconds))
                    this.hasStarted().then((response) => {
                        console.log(response);
                        if (response.toString() === "true")
                            Game.started = true;
                    });
            });
        }
    }

}