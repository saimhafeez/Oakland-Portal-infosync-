import { toast } from "react-toastify";

export const triggerToast = (message, type, margin = "0px", position = "top-right") => {
    toast(message, {
        style: { "margin-top": margin },
        position: position,
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        type: type
    });
};