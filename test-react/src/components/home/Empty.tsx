import {Field} from "./Field";
import {Type} from "./Type";
import {Game} from "../../service/Game";

interface State {
    isActive: boolean;
}

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
    repairing: boolean
}

export class Empty extends Field {
    type = Type.Empty;
    state: State = {
        isActive: this.props.isActive
    }

    constructor(props: Props) {
        super(props);
        this.toggleActive = this.toggleActive.bind(this);
    }

    toggleActive() {
        this.setState((prevState: State) => ({
            isActive: !prevState.isActive
        }));
        this.isActive = !this.isActive;
    }

    render() {
        const className = this.state.isActive ? "light" : ""
        return <div onClick={() => Game.buildPowerLine(this.props.row, this.props.column)}
                    onMouseEnter={this.toggleActive}
                    onMouseLeave={this.toggleActive}
                    className={"field " + className}></div>;
    }
}