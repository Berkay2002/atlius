import React from 'react';
import { Link } from 'react-router-dom';
import {ReactComponent as Back} from './icons/back.svg';

function NotFound() {
  return (
    <div className="not-found-page">
      <Link to="/">
        <div id="tillbakaKnapp">
          <Back/>
        </div>
      </Link>

      <div className="not-found-content">
        <h1 className="not-found-title">404</h1>
        <h2>Sidan hittades inte</h2>
        <p>Den sida du söker efter finns inte eller har flyttats.</p>
        <Link to="/" className="not-found-link">
          <button className="not-found-button">Tillbaka till startsidan</button>
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
