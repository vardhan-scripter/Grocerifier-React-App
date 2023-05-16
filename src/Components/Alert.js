export default function Alert(props) {
  const classNames = `alert-fixed alert alert-${props.type} alert-dismissible fade show`;
  return (
    <div class={classNames} role="alert">
      {props.message}
      <button
        type="button"
        class="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
      ></button>
    </div>
  );
}
