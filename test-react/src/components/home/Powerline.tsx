import React from "react";
import {Field} from "./Field";
import {faTowerCell} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Game} from "../../service/Game";


export class Powerline extends Field {

    render() {
        const activeClass = this.props.isActive ? "powerline-on" : "powerline-off ";
        const constructionClass = this.props.isUnderConstruction ? "powerline-construction " : " ";
        const brokenClass = this.props.broken ? "broken " : " "
        const repairingClass = this.props.repairing ? "repairing " : " ";
        let classEnemy = "";
        if (this.props.enemy != null)
            classEnemy = " enemy "
        return <div onClick={() => Game.fixPowerLine(this)}
                    className={"field " + constructionClass + activeClass + brokenClass + repairingClass + classEnemy}>
            <FontAwesomeIcon icon={faTowerCell} fade={this.props.broken && !this.props.repairing}/>
        </div>;
    }
}