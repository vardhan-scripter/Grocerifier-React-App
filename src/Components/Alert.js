export default function Alert(props) {
  const classList = `alert-fixed alert alert-${props.type} alert-dismissible fade show`;
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
