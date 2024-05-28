import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUsers} from "@fortawesome/free-solid-svg-icons";

export function Loading() {
    return <FontAwesomeIcon className="loading-icon" icon={faUsers} fade/>
}