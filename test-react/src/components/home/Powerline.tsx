import React from "react";
import {Field} from "./Field";
import {faScrewdriverWrench, faTowerCell} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Game} from "../../service/Game";
import {Timer} from "../../service/Timer";


export class Powerline extends Field {

    render() {
        const activeClass = this.props.isActive ? "powerline-on" : "powerline-off ";
        const constructionClass = this.props.isUnderConstruction ? "powerline-construction " : " ";
        const brokenClass = this.props.broken ? "broken " : " "
        const repairingClass = this.props.repairing ? "repairing " : " ";
        let classEnemy = "";
        let icon = <FontAwesomeIcon icon={faTowerCell} fade={this.props.broken && !this.props.repairing}/>;
        if (this.props.repairing || this.props.isUnderConstruction)
            icon = <FontAwesomeIcon icon={faScrewdriverWrench}/>;
        if (this.props.enemy != null)
            classEnemy = " enemy "
        let cursor = "not-allowed";
        if (this.props.broken && !this.props.repairing && Timer.workers > 0)
            cursor = "cell";
        if (this.props.repairing || this.props.isUnderConstruction)
            cursor = "progress";
        return <div style={{cursor: cursor}} onClick={() => Game.fixPowerLine(this)}
                    className={"field " + constructionClass + activeClass + brokenClass + repairingClass + classEnemy}>
            {icon}
        </div>;
    }
}