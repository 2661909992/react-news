import React from 'react';

import NavAddressBar from "./NavAddressBar";
import NavContentBar from "./NavContentBar";

export default function NewRouter(props) {
    return (
        <div>
            <NavAddressBar/>
            <NavContentBar/>
        </div>
    );
}