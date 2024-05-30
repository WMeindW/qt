import React from "react";
import {Field} from "./Field";
import {faHouseChimneyUser} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Game} from "../../service/Game";

export class House extends Field {


    render() {
        const className = this.props.isActive ? "powerline-on " : "powerline-off ";
        const enemyClass = this.props.enemy ? "enemy" : "";
        Game.houseActive(this);
        return <div className={"field house " + className + enemyClass}>
            <FontAwesomeIcon icon={faHouseChimneyUser}/>
        </div>;
    }
}