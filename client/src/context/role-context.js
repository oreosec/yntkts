import { createContext, useState, useEffect, useCallback } from "react";
import { useSelector } from "react-redux";

export const RoleContext = createContext();

function RoleProvider({ children }) {
    const {
        auth: { loggedIn, as },
        mentor,
        moderator,
    } = useSelector((state) => state);
    const [formatedRole, setFormatedRole] = useState(null);
    const [objRole, setObjRole] = useState(null);

    // function
    const handleSetState = useCallback(() => {
        if (loggedIn) {
            if (as.role === "moderator") {
                setObjRole(moderator);
                return setFormatedRole("Koordinator");
            }

            if (as.role === "mentor") {
                setObjRole(mentor);
                return setFormatedRole("Pengampu");
            }
        }
    }, [loggedIn, as, mentor, moderator]);

    useEffect(() => {
        handleSetState();
    }, [handleSetState]);

    return (
        <RoleContext.Provider value={{ formatedRole, objRole }}>
            {children}
        </RoleContext.Provider>
    );
}

export default RoleProvider;
