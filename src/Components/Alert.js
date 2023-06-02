import { useEffect } from "react";

export default function Alert(props) {
  const classList = `alert-fixed alert alert-${props.type} alert-dismissible fade show`;
  useEffect(() => {
    setTimeout(() => {
      props.closeAlert();
    }, 3000);
  }, [props])
  return (
    <div className={classList} role="alert">
      {props.message}
      <button
        type="button"
        className="btn-close"
        onClick={props.closeAlert}
      ></button>
    </div>
  );
}
