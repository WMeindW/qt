import {Component} from "react";
import {Type} from "./Type";

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

interface Props {
    key: number;
    row: number;
    column: number;
    isActive: boolean;
    isUnderConstruction: boolean;
    type: Type;
    enemy: FieldObject | null,
    broken: boolean;
    repairing: boolean;
}

export class Field extends Component<Props, any> {
    constructor(props: Props) {
        super(props);
        this.row = props.row;
        this.column = props.column;
        this.type = props.type;
        this.isActive = props.isActive;
        this.isUnderConstruction = props.isUnderConstruction;
        this.enemy = props.enemy;
        this.broken = props.broken;
        this.repairing = props.repairing;
    }

    repairing: boolean;
    broken: boolean;
    enemy: FieldObject | null;
    row: number;
    column: number;
    type: Type;
    isActive: boolean;
    isUnderConstruction: boolean;
}