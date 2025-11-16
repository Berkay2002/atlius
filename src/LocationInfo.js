import { Link } from "react-router-dom";

function LocationInfo(loc) {
    return (
    <Link to={"/map/" + loc.data.room} aria-label={`Visa ${loc.data.room} i ${loc.data.building}`}>
    <div className="room">
      <h1 className="roomTitle"><b>{loc.data.room}</b> -  {loc.data.building}</h1>
    </div>
    </Link>
    );
  }
  
  export default LocationInfo;