import {Field} from "./Field";
import {Type} from "./Type";
import {Game} from "../../service/Game";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTowerCell} from "@fortawesome/free-solid-svg-icons";
import {Timer} from "../../service/Timer";

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
        let icon = null;
        let classEnemy = "";
        if (this.props.enemy != null && this.props.enemy.isActive) {
            classEnemy = " enemy "
            icon = <FontAwesomeIcon icon={faTowerCell}/>
        } else if (this.props.enemy != null && !this.props.enemy.isActive) {
            classEnemy = " enemy-inactive "
            icon = <FontAwesomeIcon icon={faTowerCell}/>
        }
        let cursor = Timer.workers > 0 ? "cell" : "not-allowed"
        return <div style={{cursor: cursor}} onClick={() => Game.buildPowerLine(this.props.row, this.props.column)}
                    onMouseEnter={this.toggleActive}
                    onMouseLeave={this.toggleActive}
                    className={"field " + className + classEnemy}>
            {icon}
        </div>;
    }
}