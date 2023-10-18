import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SpeciesAddComponent from './components/SpeciesAdd'; // Correct the file path if necessary
import BirdCard from './components/summaryCard'; // Correct the file path if necessary


function App() {
    return (
        <BrowserRouter>
            <Routes>

                <Route path="/"  element={<SpeciesAddComponent />} />
                <Route path="/summary" element={<BirdCard />} />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
