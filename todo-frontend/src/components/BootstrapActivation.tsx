"use client";

import {useEffect} from "react";

export default function BootstrapActivation() {
    useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        //require('bootstrap/dist/js/bootstrap.min.js');
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('bootstrap/dist/js/bootstrap.bundle.js');
    }, []);

    return null;
}