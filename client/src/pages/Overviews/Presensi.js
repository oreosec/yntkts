import { useState, useContext, useEffect } from "react";

import { RoleContext } from "../../context/role-context";

import Input from "../../components/atoms/Input";
import Preload from "../../components/molecules/Preload";
import Layout from "../../components/organism/Layout";
import Calendar from "../../components/molecules/Calendar";

// custom vars
const select_options = [{key: "Hadir", value: "hadir"}, {key: "Sakit", value: "sakit"}, {key: "Ijin", value: "ijin"}, {key: "Alpha", value: "alpha"}];

function Presensi() {
    const { objRole } = useContext(RoleContext);
    const [calendar, setCalendar] = useState(new Date());
    const [isPagi, setIsPagi] = useState(true);
    const [formatedObj, setFromatedObj] = useState([
        { name: "", presence: { date: calendar.toISOString(), status: "", description: "" } },
    ]);

    const condition =
        !objRole.isLoading && !objRole.isError && objRole.data.length;

    // this is one of problems that make my head "mumet"
    useEffect(() => {
        if (condition) {
            const formatData = objRole.data.map(
                ({ username, presences }) => {
                    // const {date, status, description} = objFormatter(presences, calendar, isPagi)

                    // return {username, presence: {date, status, description}}
                    return objFormatter(username, presences, calendar, isPagi)
                }
            );

            setFromatedObj(formatData)
        }
    }, [condition, calendar, objRole.data, isPagi]);

    return (
        <Layout>
            <section className="container">
                <header className="py-2">
                    <h1>Presence</h1>

                    <div className="my-4">
                        <Calendar date={calendar} setter={setCalendar} />

                        <div className="my-4 space-y-2">
                            <p className="text-sm">{`${calendar.getDate()}/${calendar.getMonth()}/${calendar.getFullYear()}`}</p>
                            <p className="text-sm font-bold">Pagi</p>
                        </div>
                    </div>
                </header>

                <main className="pt-1 pb-2 space-y-3">
                    <Preload isLoading={objRole.isLoading} />

                    <div className="flex space-x-2 my-2">
                        <button
                            className={`btn borde rounded font-bold w-full md:w-60 transition-colors duration-300 ${
                                isPagi
                                    ? "bg-sky-500 text-white border-sky-500"
                                    : "bg-white text-gray-800 border-white"
                            }`}
                            onClick={() => setIsPagi(true)}
                        >
                            Pagi
                        </button>
                        <button
                            className={`btn border rounded font-bold w-full md:w-60 transition-colors duration-300 ${
                                isPagi
                                    ? "bg-white text-gray-800 border-white"
                                    : "bg-sky-500 text-white border-sky-500"
                            }`}
                            onClick={() => setIsPagi(false)}
                        >
                            Sore
                        </button>
                    </div>

                    {condition ? (
                        formatedObj.map(({ username, presence }, index) => (
                            // objRole.data.map(({username, _id}) => (
                            <div
                                className="relative bg-gray-800 text-white p-3"
                                key={index}
                            >
                                <div className="flex items-center py-1 justify-between">
                                    <p className="border-white border-b">
                                        {username}
                                    </p>
                                    <select
                                        name="presensi"
                                        id="presensi"
                                        className="text-gray-800"
                                    >
                                        {/* {
                                            select_options.map(({key, value}) => (
                                                presence.status === ""? 
                                                <option key={key} value={value}>{key}</option>
                                            ))
                                        } */}
                                    </select>
                                </div>

                                <div className="py-3">
                                    <Input placeholder="Tambah keterangan jika tidak hadir (opsional)" />
                                </div>
                            </div>
                        ))
                    ) : //
                    !condition ? (
                        <p className="text-trueGray-600 opacity-50 text-center font-bold">
                            No data found.
                        </p>
                    ) : null}
                    {condition && (
                        <div className="w-11/12 text-right">
                            <button className="btn btn-primary">Submit</button>
                        </div>
                    )}
                </main>
            </section>
        </Layout>
    );
}

function setTime(date, to = true) {
    if (typeof to !== "boolean") {
        return "Seccond argument type must be a boolean.";
    }

    if (to) {
        date.setHours(6);
        return date;
    } else {
        date.setHours(17);
        return date;
    }
}

// handle compare date
// handle formatedObj state
function objFormatter(username, presences, comparter, pagi) {
    let result;

    if (!Array.isArray(presences)) {
        return "Argument must be an array.";
    }

    if (!comparter instanceof Date) {
        return "Second argument must be a Date.";
    }

    for(let i = 0; i < presences.length; i++){
        const {date, status, description} = presences[i];
        const curr_dt = new Date(date);
        
        
        const isDateEq = 
        curr_dt.getFullYear() === comparter.getFullYear() &&
        curr_dt.getMonth() === comparter.getMonth() &&
        curr_dt.getDate() === comparter.getDate();
        
        if(isDateEq) {
            if (pagi && curr_dt.getHours() <= 6 && curr_dt.getHours() >= 4) {
                result = {username, presence: {date, status, description}}
                return result;
            }
            
            if (!pagi && curr_dt.getHours() <= 15 && curr_dt.getHours() >= 17) {
                result = {username, presence: {date, status, description}}
                return result
            }
        }
    }
    
    if(!result){
        return {
            username,
            presence: {
                date: comparter.toISOString(),
                status: "alpha",
                description: ''
            }
        };
    }
}

export default Presensi;
