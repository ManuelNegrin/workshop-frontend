import { toast } from "react-toastify";

export const confirmToast = (message, onConfirm) => {
  toast.info(
    ({ closeToast }) => <div>
      <p className="mb-2">{message}</p>
      <div className="d-flex gap-2 justify-content-end">
        <button type="button" className="btn btn-outline-danger" onClick={() => { onConfirm(); closeToast(); }}>Aceptar</button>
        <button type="button" className="btn btn-sm btn-secondary" onClick={closeToast}>Cancelar</button>
      </div>
    </div>,
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      closeButton: false,
      draggable: false,
      pauseOnHover: true,
    }
  );
};
