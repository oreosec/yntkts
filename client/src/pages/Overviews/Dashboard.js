import { useState, useContext } from "react";
// redux
import { useSelector, useDispatch } from "react-redux";

// components
// atoms
import Input from "../../components/atoms/Input";
import Status from "../../components/atoms/Status";
import Options from "../../components/atoms/Options";
import ButtonIcon from "../../components/atoms/ButtonIcon";
import Backdrop from "../../components/atoms/Backdrop";
// molecules
import Calendar from "../../components/molecules/Calendar";
import Card from "../../components/molecules/Card";
import Select from "../../components/molecules/Select";
import Sweetalert from "../../components/molecules/Sweetalert";
import Preload from "../../components/molecules/Preload";
// organism
import Layout from "../../components/organism/Layout";
//icons
import {
    BiChevronDown,
    BiEditAlt,
    BiMessageRoundedError,
    BiTrash,
    BiUserPlus,
    BiXCircle,
} from "react-icons/bi";

//utils
import { api } from "../../config/axios/apiClient";

import { fetchMentor } from "../../state/mentor/mentor-actions";
import { RoleContext } from "../../context/role-context";

// vars
const kelas_SMP = ["7", "8", "9"];
const kelas_MA = ["10", "11", "12"];

function Dashboard() {
    // redux
    const { auth } = useSelector((state) => state);
    const { username, _id: mentor_id } = auth.as;
    const dispatch = useDispatch();
    const { formatedRole, content } = useContext(RoleContext);

    // sweetalert handler
    const [sweetMsg, setSweetMsg] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    // calendar handler
    const [calendar, setCalendar] = useState(new Date());
    const [isPagi, setIsPagi] = useState(true);
    // dropdown handler
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // add refs moderator
    const [isRefModerator, setIsRefModerator] = useState(false);
    const [moderators, setModerators] = useState([]);

    // add santri handler
    const [isEditSantri, setIsEditSantri] = useState(false);
    const [isAddSantri, setIsAddSantri] = useState(false);
    const [nama, setNama] = useState("");
    const [kelas, setKelas] = useState("7");
    const [division, setDivision] = useState("A");
    const [jenjang, setJenjang] = useState("SMP");

    return (
        <Layout>
            <Preload />
            <section className="container">
                <header className="pt-3 flex flex-col justify-between md:items-center space-y-4 md:flex-row w-full md:space-y-0">
                    <div className="md:w-8/12">
                        <h1>Overview</h1>
                        <span className="font-bold text-sm">
                            as
                            <span className="italic ml-2">
                                {username} {""}
                                {`(${formatedRole})`}
                            </span>
                        </span>
                    </div>

                    {formatedRole === "Pengampu" && (
                        // Menu
                        <div className="relative flex flex-col mt-2 md:w-4/12 xl:w-2/12">
                            <div
                                className="relative btn cursor-pointer w-full bg-white rounded-sm flex items-center justify-between z-[1]"
                                onClick={() =>
                                    setIsDropdownOpen(!isDropdownOpen)
                                }
                            >
                                <p className="font-bold">Options</p>
                                <BiChevronDown
                                    className={`
                                        transition-transform duration-200
                                        ${
                                            isDropdownOpen
                                                ? "rotate-180"
                                                : "rotate-0"
                                        }
                                    `}
                                />
                            </div>

                            <div
                                className={`absolute top-12 rounded overflow-hidden w-full bg-white shadow-2xl transition-all duration-200 z-[1] ${
                                    isDropdownOpen ? "flex flex-col" : "hidden"
                                }`}
                            >
                                <button
                                    className="btn transition-colors duration-300 hover:bg-sky-600 hover:text-white text-left border-b"
                                    onClick={() => setIsAddSantri(true)}
                                >
                                    Add Santri
                                </button>
                                <button
                                    className="btn transition-colors duration-300 hover:bg-sky-600 hover:text-white text-left border-b"
                                    onClick={() => handleRefModeratorDialog()}
                                >
                                    Set Koordinator
                                </button>
                                <button
                                    className={`btn transition-colors duration-300 hover:bg-sky-600 hover:text-white text-left border-b ${isEditSantri ? "bg-sky-600 text-white" : "bg-white"}`}
                                    onClick={() =>
                                        setIsEditSantri(!isEditSantri)
                                    }
                                >
                                    Edit Santri
                                </button>
                            </div>
                        </div>
                    )}
                </header>

                <Preload isLoading={content.isLoading} />

                <main className="relative mt-4 md:mt-10">
                    <Calendar date={calendar} setter={setCalendar} />

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

                    {!content.isLoading &&
                    !content.isError &&
                    content.data.length >= 1 ? (
                        <div className="mt-3 grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                            {
                                //
                                content.data.map(
                                    ({ _id, username, presences }) => (
                                        <Card
                                            key={_id}
                                            className="bg-white cursor-pointer"
                                        >
                                            <div className="flex items-center">
                                                <Status
                                                    className={
                                                        handleFusingFusing(
                                                            presences,
                                                            calendar
                                                        ) === "hadir"
                                                            ? "bg-success"
                                                            : handleFusingFusing(
                                                                  presences,
                                                                  calendar
                                                              ) === "idle"
                                                            ? "bg-disabled"
                                                            : "bg-danger"
                                                    }
                                                />
                                                <span className="font-bold ml-2">
                                                    {username}
                                                </span>
                                                {isEditSantri ? (
                                                    <div className="flex ml-auto space-x-4">
                                                        <div
                                                            className="group relative"
                                                            onClick={() =>
                                                                handleReports()
                                                            }
                                                        >
                                                            <BiEditAlt className="transition-colors duration-150 hover:text-red-500 cursor-pointer" />
                                                            <div className="absolute text-xs z-[2021] bg-trueGray-800 text-white font-light rounded p-1 transition-transform duration-150 scale-0 group-hover:scale-100">
                                                                {" "}
                                                                Edit
                                                            </div>
                                                        </div>
                                                        <div
                                                            className="group relative"
                                                            onClick={() =>
                                                                handleReports()
                                                            }
                                                        >
                                                            <BiTrash className="transition-colors duration-150 hover:text-red-500 cursor-pointer" />
                                                            <div className="absolute text-xs z-[2021] bg-trueGray-800 text-white font-light rounded p-1 transition-transform duration-150 scale-0 group-hover:scale-100">
                                                                {" "}
                                                                Delete
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div
                                                        className="group relative ml-auto"
                                                        onClick={() =>
                                                            handleReports()
                                                        }
                                                    >
                                                        <BiMessageRoundedError className="transition-colors duration-150 hover:text-red-500 cursor-pointer" />
                                                        <div className="absolute text-xs z-[2021] bg-trueGray-800 text-white font-light rounded p-1 transition-transform duration-150 scale-0 group-hover:scale-100">
                                                            {" "}
                                                            Report
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </Card>
                                    )
                                )
                            }
                        </div>
                    ) : (
                        <div className="flex items-center justify-center h-96 text-trueGray-600 opacity-50">
                            <p className="font-bold text-xl"> No data found.</p>
                        </div>
                    )}
                </main>

                {isRefModerator && (
                    <Backdrop>
                        <Card className="bg-white p-4 w-11/12 md:w-[300px] relative">
                            <div
                                className="absolute -top-5 right-0"
                                onClick={() => setIsRefModerator(false)}
                            >
                                <ButtonIcon className="w-full bg-white bg-opacity-50 backdrop-blur-sm p-2 rounded-full">
                                    <BiXCircle className="text-lg" />
                                </ButtonIcon>
                            </div>
                            <div className="space-y-2">
                                {
                                    //
                                    moderators.length > 0 ? (
                                        moderators.map(
                                            ({ username, _id, mentors }) => (
                                                <Card
                                                    key={_id}
                                                    className={`${
                                                        mentors.includes(
                                                            mentor_id
                                                        )
                                                            ? "bg-sky-500"
                                                            : "bg-sky-600"
                                                    } transition-colors duration-150 hover:bg-sky-500 cursor-pointer text-white`}
                                                    onClick={() =>
                                                        handleRefModerator(
                                                            mentor_id,
                                                            _id
                                                        )
                                                    }
                                                >
                                                    <p>{username}</p>
                                                </Card>
                                            )
                                        )
                                    ) : (
                                        <p className="font-bold text-center text-trueGray-800 opacity-80">
                                            Koordinator tidak ditemukan.
                                        </p>
                                    )
                                }
                            </div>
                        </Card>
                    </Backdrop>
                )}

                {isAddSantri && (
                    <Backdrop>
                        <Card className="bg-white w-11/12 md:w-96 relative">
                            <div
                                className="absolute -top-5 right-0"
                                onClick={() => setIsAddSantri(false)}
                            >
                                <ButtonIcon className="w-full bg-white bg-opacity-50 backdrop-blur-sm p-2 rounded-full">
                                    <BiXCircle className="text-lg" />
                                </ButtonIcon>
                            </div>

                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <label className="font-bold" htmlFor="nama">
                                        Nama Santri
                                    </label>
                                    <Input
                                        placeholder="Nama santri"
                                        color="text-gray-800 broder-gray-800"
                                        name="nama"
                                        onChange={(e) =>
                                            setNama(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <p className="font-bold">Kelas</p>
                                    <div className="flex relative z-[2022] space-x-1">
                                        <div className="w-10/12">
                                            <Select
                                                value={kelas}
                                                setValue={setKelas}
                                                selectedClassName="dashboard-select__selected"
                                                optionsClassName="dashboard-select__options"
                                            >
                                                {jenjang === "SMP"
                                                    ? kelas_SMP.map((n) => (
                                                          <Options
                                                              key={n}
                                                              value={n}
                                                              className="dashboard-select__options__option"
                                                          />
                                                      ))
                                                    : kelas_MA.map((n) => (
                                                          <Options
                                                              key={n}
                                                              value={n}
                                                              className="dashboard-select__options__option"
                                                          />
                                                      ))}
                                            </Select>
                                        </div>
                                        <div className="w-2/12">
                                            <Select
                                                value={division}
                                                setValue={setDivision}
                                                selectedClassName="dashboard-select__selected"
                                                optionsClassName="dashboard-select__options"
                                            >
                                                <Options
                                                    value="A"
                                                    className="dashboard-select__options__option"
                                                />
                                                <Options
                                                    value="B"
                                                    className="dashboard-select__options__option"
                                                />
                                            </Select>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <p className="font-bold">Jenjang</p>
                                    <Select
                                        value={jenjang}
                                        setValue={setJenjang}
                                        selectedClassName="dashboard-select__selected"
                                        optionsClassName="dashboard-select__options"
                                    >
                                        <Options
                                            value="SMP"
                                            className="dashboard-select__options__option"
                                        />
                                        <Options
                                            value="MA"
                                            className="dashboard-select__options__option"
                                        />
                                    </Select>
                                </div>
                            </div>

                            <ButtonIcon
                                className="btn btn-primary ml-auto mt-3"
                                onClick={() => handleAddSantri(mentor_id)}
                            >
                                <BiUserPlus />
                                <span>Tambah Santri</span>
                            </ButtonIcon>
                        </Card>
                    </Backdrop>
                )}

                {isDialogOpen && (
                    <Sweetalert
                        className="flex justify-between items-center space-x-3"
                        isOpen={true}
                        message={sweetMsg}
                    >
                        <button
                            className="btn btn-primary"
                            onClick={() => setIsDialogOpen(false)}
                        >
                            Oke
                        </button>
                    </Sweetalert>
                )}
            </section>
        </Layout>
    );

    // functions
    // ===== Santri =====
    function handleAddSantri(mentorId) {
        const formatedKelas = `${kelas} ${division}`;

        if (
            (jenjang === "SMP" && !kelas_SMP.includes(kelas)) ||
            (jenjang === "MA" && !kelas_MA.includes(kelas)) ||
            !nama.trim()
        ) {
            setSweetMsg("Yang bener kalo ng-input data.");
            setIsDialogOpen(true);
            return;
        }

        api({
            method: "POST",
            url: "/disciple",
            data: {
                mentor: mentorId,
                username: nama,
                kelas: formatedKelas,
                jenjang,
            },
        }).then(() => dispatch(fetchMentor(mentorId, "expand=true")));
    }

    // function handleEditSantri(){

    // }

    // ===== santri end =====

    function handleRefModeratorDialog() {
        api({
            method: "GET",
            url: "/moderators",
        }).then((response) => {
            const { data } = response.data;
            setModerators(data);
        });

        setIsRefModerator(true);
    }

    function handleRefModerator(mentorId, moderatorId) {
        api({
            method: "PATCH",
            url: "/ref/mentors",
            data: {
                mentor: mentorId,
                moderator: moderatorId,
            },
        })
            .then(() => {
                setIsDialogOpen(true);
                setSweetMsg("Successfully referencing user.");

                handleRefModeratorDialog();
            })
            .catch(() => {
                setIsDialogOpen(true);
                setSweetMsg("This user has already been referenced.");
            });
    }

    function handleReports() {
        setSweetMsg("This feature is under development.");
        setIsDialogOpen(true);
    }

    // this function handle my mind
    // its prevent me from "mumet"
    function handleFusingFusing(
        presences,
        date
    ) {
        // this function except array as its parameter
        // presences param should be array of object
        if (!Array.isArray(presences)) {
            return;
        }

        const x = {
            YYYY: date.getFullYear(),
            MM: date.getMonth(),
            DD: date.getDate(),
        };

        const y = presences.filter(({ date }) => {
            const tempDate = new Date(date);
            const t_YYYY = tempDate.getFullYear();
            const t_MM = tempDate.getMonth();
            const t_DD = tempDate.getDate();
            const t_hh = tempDate.getHours();

            return (
                x.YYYY === t_YYYY &&
                x.MM === t_MM &&
                x.DD === t_DD &&
                t_hh >= 4 &&
                t_hh <= 6
            );
        });

        if (y.length < 1) {
            return "idle";
        }

        return y[0].status;
    }
}

export default Dashboard;
