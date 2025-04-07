export class Config {
    static readonly startTimeout: number = 5;
    static readonly rows: number = 20;
    static readonly columns: number = 30;
    static readonly startHome: number = 2;
    static readonly startWorkers: number = 5;
    static readonly startScore: number = 99;
    static readonly buildTime: number = 20;
    static readonly houseInterval: number = 50;
    static readonly scoreDownInterval: number = 10;
    static readonly scoreDownNumber: number = 2;
    static readonly scoreUpInterval: number = 20;
    static readonly scoreUpNumber: number = 1;
    static readonly breakInterval: number = 60;
    static readonly repairTime: number = 10;
    static readonly finishMinutes: number = 5;
    static readonly requestRoute: string = "/cez/api";
}