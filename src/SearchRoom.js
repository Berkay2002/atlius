import {ReactComponent as Map} from './maps/startPage.svg';
import React, { useState, useMemo, useDeferredValue } from 'react';
import LocationInfo from './LocationInfo.js';
import {elements} from './DataBase.js';


function SearchRoom(){

    const [searchString, setSearchString] = useState("");

    // React 18.3 useDeferredValue: More efficient than manual debouncing
    // Defers re-rendering search results while keeping input responsive
    // React automatically optimizes the timing based on device performance
    const deferredSearchString = useDeferredValue(searchString);

    function changeInput(event) {
        setSearchString(event.target.value);
    }

    // Memoize search results to prevent unnecessary recalculations
    // Now uses deferredSearchString for better concurrent rendering
    const resultList = useMemo(() => {
        const matchSearch = (word) => {
            // Validering: Kontrollera att word inte är null eller undefined
            if(!word || deferredSearchString === ""){
                return false;
            }
            const lowerCaseWord = word.toLowerCase();
            const lowerCaseSearchString = deferredSearchString.toLowerCase();

            return lowerCaseWord.search(lowerCaseSearchString) !== -1;
        };

        const filteredResults = elements.filter(room => matchSearch(room.room)).sort((a,b) => a.room.length - b.room.length);
        return filteredResults.slice(0, 5);
    }, [deferredSearchString]);

    const hasMoreResults = useMemo(() => {
        const matchSearch = (word) => {
            // Validering: Kontrollera att word inte är null eller undefined
            if(!word || deferredSearchString === ""){
                return false;
            }
            const lowerCaseWord = word.toLowerCase();
            const lowerCaseSearchString = deferredSearchString.toLowerCase();

            return lowerCaseWord.search(lowerCaseSearchString) !== -1;
        };

        const filteredResults = elements.filter(room => matchSearch(room.room));
        return filteredResults.length > 5;
    }, [deferredSearchString]);

    // Visual indicator when search is being deferred (results are updating)
    const isSearching = searchString !== deferredSearchString;
    //<img id="mapImage" src={TP_4} placeholder="Bild på planlösning"></img>

return(
    <div className="App">
    <div className="searchResults">
        <input
            id="input"
            type="text"
            placeholder="Sök efter lokal..."
            autoComplete="off"
            onChange={changeInput}
            aria-label="Sök efter lokal"
            value={searchString}
        />
        <div role="status" aria-live="polite" style={{ opacity: isSearching ? 0.7 : 1, transition: 'opacity 0.2s' }}>

        {resultList.map((input) => (
        <LocationInfo key={input.room} data={input}/>
        ))
        }

        {deferredSearchString !== "" && resultList.length === 0 && (
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
