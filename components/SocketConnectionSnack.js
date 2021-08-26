import { useSelector, useDispatch } from "react-redux";
import Snackbar from "@material-ui/core/Snackbar";
export default function socketConnectionSnack() {
  const socketConnection = useSelector((state) => state.socketConnection.value);
  return (
    <Snackbar
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      open={socketConnection === false}
      message="server disconnect"
    />
  );
}
