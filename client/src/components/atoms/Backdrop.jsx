import ReactDOM from "react-dom";

function Backdrop({ open, children, onClose }) {
    return ReactDOM.createPortal(
        <div
            className={`fixed top-0 left-0 p-4 w-screen h-screen z-[2021] bg-trueGray-900 bg-opacity-50 place-items-center backdrop-blur-sm ${
                open ? "grid" : "hidden"
            }`}
            onClick={onClose}
        >
            {children}
        </div>,
        document.getElementById("modal")
    );
}

export default Backdrop;
