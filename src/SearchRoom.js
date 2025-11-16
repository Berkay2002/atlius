import {ReactComponent as Map} from './maps/startPage.svg';
import React, { useState, useMemo, useEffect } from 'react';
import LocationInfo from './LocationInfo.js';
import {elements} from './DataBase.js';


function SearchRoom(){

    const [searchString, setSearchString] = useState("");
    const [debouncedSearchString, setDebouncedSearchString] = useState("");

    // Debounce search input to reduce unnecessary re-renders
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchString(searchString);
        }, 150);

        return () => clearTimeout(timer);
    }, [searchString]);

    function changeInput(event) {
        setSearchString(event.target.value);
    }

    // Memoize search results to prevent unnecessary recalculations
    const resultList = useMemo(() => {
        const matchSearch = (word) => {
            // Validering: Kontrollera att word inte är null eller undefined
            if(!word || debouncedSearchString === ""){
                return false;
            }
            const lowerCaseWord = word.toLowerCase();
            const lowerCaseSearchString = debouncedSearchString.toLowerCase();

            return lowerCaseWord.search(lowerCaseSearchString) !== -1;
        };

        const filteredResults = elements.filter(room => matchSearch(room.room)).sort((a,b) => a.room.length - b.room.length);
        return filteredResults.slice(0, 5);
    }, [debouncedSearchString]);

    const hasMoreResults = useMemo(() => {
        const matchSearch = (word) => {
            // Validering: Kontrollera att word inte är null eller undefined
            if(!word || debouncedSearchString === ""){
                return false;
            }
            const lowerCaseWord = word.toLowerCase();
            const lowerCaseSearchString = debouncedSearchString.toLowerCase();

            return lowerCaseWord.search(lowerCaseSearchString) !== -1;
        };

        const filteredResults = elements.filter(room => matchSearch(room.room));
        return filteredResults.length > 5;
    }, [debouncedSearchString]);
    //<img id="mapImage" src={TP_4} placeholder="Bild på planlösning"></img>

return(
    <div className="App">
    <div className="searchResults">
        <input id="input" type="text" placeholder="Sök efter lokal..." autoComplete="off" onChange={changeInput} aria-label="Sök efter lokal"/>
        <div role="status" aria-live="polite">

        {resultList.map((input) => (
        <LocationInfo key={input.room} data={input}/>
        ))
        }

        {debouncedSearchString !== "" && resultList.length === 0 && (
            <div className="emptyState">
                <p>Inga resultat hittades</p>
            </div>
        )}

        {hasMoreResults && (
            <div className="moreResults">
                <p>Fler resultat tillgängliga...</p>
            </div>
        )}
        </div>
    </div>

    <Map width={100+"vw"}/>
</div>
)}

export default SearchRoom;
