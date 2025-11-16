import React, {useEffect, useState, useRef, useMemo, useCallback, lazy, Suspense} from 'react';
import {useParams} from "react-router-dom";
import {elements} from './DataBase.js';
import { Link } from "react-router-dom";
import { BUILDINGS, FLOOR_CODES, MAP_NAMES } from './constants.js';

// Keep small icons as regular imports
import {ReactComponent as Back} from './icons/back.svg';

// Lazy load SVG floor plans for better performance
const Täppan3 = lazy(() => import('./maps/Täppan3.svg').then(module => ({ default: module.ReactComponent })));
const Täppan4 = lazy(() => import('./maps/Täppan4.svg').then(module => ({ default: module.ReactComponent })));
const Täppan5 = lazy(() => import('./maps/Täppan5.svg').then(module => ({ default: module.ReactComponent })));
const Kåkenhus1 = lazy(() => import('./maps/Kåken1.svg').then(module => ({ default: module.ReactComponent })));
const Kåkenhus2 = lazy(() => import('./maps/Kåken2.svg').then(module => ({ default: module.ReactComponent })));
const Kåkenhus3 = lazy(() => import('./maps/Kåken3.svg').then(module => ({ default: module.ReactComponent })));
const Kåkenhus4 = lazy(() => import('./maps/Kåken4.svg').then(module => ({ default: module.ReactComponent })));
const Kåkenhus5 = lazy(() => import('./maps/Kåken5.svg').then(module => ({ default: module.ReactComponent })));

// Floor configuration object to eliminate code duplication
const FLOOR_CONFIGS = {
  [MAP_NAMES.TAPPAN_3]: { component: Täppan3, header: BUILDINGS.TAPPAN, floorCode: FLOOR_CODES.TP3 },
  [MAP_NAMES.TAPPAN_4]: { component: Täppan4, header: BUILDINGS.TAPPAN, floorCode: FLOOR_CODES.TP4 },
  [MAP_NAMES.TAPPAN_5]: { component: Täppan5, header: BUILDINGS.TAPPAN, floorCode: FLOOR_CODES.TP5 },
  [MAP_NAMES.KAKENHUS_1]: { component: Kåkenhus1, header: BUILDINGS.KAKENHUS, floorCode: FLOOR_CODES.K1 },
  [MAP_NAMES.KAKENHUS_2]: { component: Kåkenhus2, header: BUILDINGS.KAKENHUS, floorCode: FLOOR_CODES.K2 },
  [MAP_NAMES.KAKENHUS_3]: { component: Kåkenhus3, header: BUILDINGS.KAKENHUS, floorCode: FLOOR_CODES.K3 },
  [MAP_NAMES.KAKENHUS_4]: { component: Kåkenhus4, header: BUILDINGS.KAKENHUS, floorCode: FLOOR_CODES.K4 },
  [MAP_NAMES.KAKENHUS_5]: { component: Kåkenhus5, header: BUILDINGS.KAKENHUS, floorCode: FLOOR_CODES.K5 }
};

function LocationDetails(){
    const {roomName} = useParams();
    const containerRef = useRef(null);

    // Memoize expensive room lookup to prevent recalculation on every render
    const room = useMemo(() => {
        return elements.find(element => element.room === roomName);
    }, [roomName]);

    // Om man tryckt på Täppan kommer våningarna för Täppan att visas, samma för Kåken
    let startFloor = "heh";
    if(roomName === BUILDINGS.TAPPAN){
        startFloor = FLOOR_CODES.TP3;
    }
    else if(roomName === BUILDINGS.KAKENHUS){
        startFloor = FLOOR_CODES.K2;
    }

    const [currentFloor, setCurrentFloor] = useState(startFloor);
    const [loading, setLoading] = useState(true);

    let mapName;
    if(room){
        mapName = room.building + room.floor;
    }
    else{
        mapName = roomName;
    }

    useEffect(() => {
        if(room && containerRef.current){
            const element = containerRef.current.querySelector("#"+roomName);
            if(element){
                element.classList.add("start_buildings");
            }
        }
        return () => {
            if(room && containerRef.current){
                const element = containerRef.current.querySelector("#"+roomName);
                if(element){
                    element.classList.remove("start_buildings");
                }
            }
        };
        }, [room, roomName]);

    useEffect(() => {
        // Simulera laddning av SVG
        setLoading(true);
        const timer = setTimeout(() => {
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [mapName, currentFloor]);

    // Memoize event handler to prevent recreating on every render
    const changeFloor = useCallback((floor) => {
        setCurrentFloor(floor);
    }, []);

    // Validering: Om rummet inte finns och det inte är en av specialfallen
    if(!room && roomName !== BUILDINGS.TAPPAN && roomName !== BUILDINGS.KAKENHUS){
        return (
            <div className="error-page">
                <Link to="/" aria-label="Tillbaka till sökning">
                    <div id="tillbakaKnapp">
                        <Back/>
                    </div>
                </Link>
                <div className="error-content">
                    <h1>Rummet hittades inte</h1>
                    <p>Lokal "{roomName}" finns inte i databasen.</p>
                    <Link to="/" className="error-link">
                        <button className="error-button">Tillbaka till sökning</button>
                    </Link>
                </div>
            </div>
        );
    }

    return(
        <div className="details" ref={containerRef}>
            <Link to="/" aria-label="Tillbaka till sökning">
                <div id="tillbakaKnapp">
                <Back/>
                </div>
            </Link>

            {loading && (
                <div className="loadingIndicator">
                    <p>Laddar karta...</p>
                </div>
            )}

            {/* Render floor plans using configuration object with lazy loading */}
            <Suspense fallback={<div className="loadingIndicator"><p>Laddar...</p></div>}>
                {Object.entries(FLOOR_CONFIGS).map(([configMapName, config]) => {
                    const FloorComponent = config.component;
                    const shouldRender = mapName === configMapName || currentFloor === config.floorCode;

                    return shouldRender ? (
                        <React.Fragment key={configMapName}>
                            <h1 id="headerRoom">{config.header}</h1>
                            <FloorComponent />
                        </React.Fragment>
                    ) : null;
                })}
            </Suspense>
            
            {mapName === MAP_NAMES.TAPPAN &&
            <>

                <div id='floorContainer'>
                <button
                    className={currentFloor === FLOOR_CODES.TP3 ? 'activeFloor' : ''}
                    aria-current={currentFloor === FLOOR_CODES.TP3 ? 'true' : 'false'}
                    aria-label="Visa våning 3"
                    onClick={() => changeFloor(FLOOR_CODES.TP3)}
                >
                    Våning 3
                </button>
                <button
                    className={currentFloor === FLOOR_CODES.TP4 ? 'activeFloor' : ''}
                    aria-current={currentFloor === FLOOR_CODES.TP4 ? 'true' : 'false'}
                    aria-label="Visa våning 4"
                    onClick={() => changeFloor(FLOOR_CODES.TP4)}
                >
                    Våning 4
                </button>
                <button
                    className={currentFloor === FLOOR_CODES.TP5 ? 'activeFloor' : ''}
                    aria-current={currentFloor === FLOOR_CODES.TP5 ? 'true' : 'false'}
                    aria-label="Visa våning 5"
                    onClick={() => changeFloor(FLOOR_CODES.TP5)}
                >
                    Våning 5
                </button>
                </div>
            </>
            }
            {mapName === MAP_NAMES.KAKENHUS &&
            <>

                <div id='floorContainer'>
                <button
                    className={currentFloor === FLOOR_CODES.K1 ? 'activeFloor' : ''}
                    aria-current={currentFloor === FLOOR_CODES.K1 ? 'true' : 'false'}
                    aria-label="Visa våning 1"
                    onClick={() => changeFloor(FLOOR_CODES.K1)}
                >
                    Våning 1
                </button>
                <button
                    className={currentFloor === FLOOR_CODES.K2 ? 'activeFloor' : ''}
                    aria-current={currentFloor === FLOOR_CODES.K2 ? 'true' : 'false'}
                    aria-label="Visa våning 2"
                    onClick={() => changeFloor(FLOOR_CODES.K2)}
                >
                    Våning 2
                </button>
                <button
                    className={currentFloor === FLOOR_CODES.K3 ? 'activeFloor' : ''}
                    aria-current={currentFloor === FLOOR_CODES.K3 ? 'true' : 'false'}
                    aria-label="Visa våning 3"
                    onClick={() => changeFloor(FLOOR_CODES.K3)}
                >
                    Våning 3
                </button>
                <button
                    className={currentFloor === FLOOR_CODES.K4 ? 'activeFloor' : ''}
                    aria-current={currentFloor === FLOOR_CODES.K4 ? 'true' : 'false'}
                    aria-label="Visa våning 4"
                    onClick={() => changeFloor(FLOOR_CODES.K4)}
                >
                    Våning 4
                </button>
                <button
                    className={currentFloor === FLOOR_CODES.K5 ? 'activeFloor' : ''}
                    aria-current={currentFloor === FLOOR_CODES.K5 ? 'true' : 'false'}
                    aria-label="Visa våning 5"
                    onClick={() => changeFloor(FLOOR_CODES.K5)}
                >
                    Våning 5
                </button>
                </div>
            </>
            }
            
            {mapName!==roomName && room &&
            <>

                <div id="description">
                    <h2>{room.room}</h2>
                    <h2>Våning {room.floor}</h2>
                </div>
                </>
            }
        </div>

    )
}
export default LocationDetails;
