import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './VentanaEmergente.jsx';

import "@ui5/webcomponents-fiori/dist/Assets.js";
import "@ui5/webcomponents-icons/dist/AllIcons.js";
import "@ui5/webcomponents-react/dist/Assets.js";
import VentanaEmergente from './VentanaEmergente.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <VentanaEmergente />
  </React.StrictMode>,
)
