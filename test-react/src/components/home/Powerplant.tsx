import React from "react";
import {Field} from "./Field";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBolt} from '@fortawesome/free-solid-svg-icons';

export class Powerplant extends Field {

    render() {
        return <div className={"field powerplant"}>
            <FontAwesomeIcon icon={faBolt}/>
        </div>;
    }
}