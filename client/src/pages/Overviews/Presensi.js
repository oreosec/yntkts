import { useState, useContext, useEffect } from "react";

import { RoleContext } from "../../context/role-context";

import Input from "../../components/atoms/Input";
import Preload from "../../components/molecules/Preload";
import Layout from "../../components/organism/Layout";
import Calendar from "../../components/molecules/Calendar";

function Presensi() {
    const { objRole } = useContext(RoleContext);
    const [calendar, setCalendar] = useState(new Date());
    const [presences, setPresences] = useState([
        { date: calendar, status: "", description: "" },
    ]);

    const condition =
        !objRole.isLoading && !objRole.isError && objRole.data.length;

    const handleInputValue = (i, v) => {
        setPresences((prev) => {
            let current;
        });
    };

    // this is one of problems that make my head "mumet"
    useEffect(() => {
        if (condition) {
            //
            // const current = objRole.data.filter((data) => data);

            const current = objRole.data.map(({ _id, presences }) => ({
                presences: presences.map(
                    ({ date, status }) => `${_id} ${date} ${status}` // this wont detect because calendar.getHours() is not at the same time
                ),
            }));

            const p = current.map(({ presences }) => presences);
            console.log(p);

            // setPresences(() => {
            //     const p = current.map(() =>  )

            //     return newState;
            // });
        }
    }, [condition, calendar, objRole.data]);

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
                    {condition ? (
                        objRole.data.map(({ username, _id }, index) => (
                            <div
                                className="relative w-11/12 bg-gray-800 text-white p-3"
                                key={_id}
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
                                        <option value="hadir">Hadir</option>
                                        <option value="sakit">Sakit</option>
                                        <option value="ijin">Ijin</option>
                                        <option value="ijin">Alpha</option>
                                    </select>
                                </div>

                                <div className="py-3">
                                    <Input placeholder="Tambah keterangan jika tidak hadir (opsional)" />
                                </div>
                                <p>{index}</p>
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

export default Presensi;
