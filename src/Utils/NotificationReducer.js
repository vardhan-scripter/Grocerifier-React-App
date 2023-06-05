export const initialNotification = {
  isRequired: false,
  type: null,
  message: null,
};

export const notificationReducer = (state, action) => {
  switch (action.type) {
    case "DANGER":
      return {
        isRequired: true,
        type: "danger",
        message: action.payload,
      };
    case "WARNING":
      return {
        isRequired: true,
        type: "warning",
        message: action.payload,
      };
    case "SUCCESS":
      return {
        isRequired: true,
        type: "success",
        message: action.payload,
      };
    case "RESET":
      return initialNotification;
    default:
      return state;
  }
};
