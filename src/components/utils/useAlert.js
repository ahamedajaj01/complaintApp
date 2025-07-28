import { useState, useCallback } from "react";

export default function useAlert(timeout = 2500){
const [alert, setAlert] =useState({type:"", message:""});

const showAlert = useCallback((type, message) => {
	setAlert({ type, message });

    setTimeout(()=>{
setAlert({type:"", message:""})
    }, timeout)
},[timeout]);

return [alert, showAlert]
}