import {
  FIRST_NAME_CHANGED,
  LAST_NAME_CHANGED,
  EMAIL_CHANGED,
  CONTACT_CHANGED,
  PASSWORD_CHANGED,
  CONFIRM_PASSWORD_CHANGED,
} from './action';


type Action = {
    type: string;
    payload?: any;
  };

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  contact: '',
  password: '',
  confirmPassword: '',
};

const registrationReducer = (state = initialState, action: Action) => {
    switch (action.type) {
        case FIRST_NAME_CHANGED:
          return { ...state, firstName: action.payload };
        case LAST_NAME_CHANGED:
          return { ...state, lastName: action.payload };
        case EMAIL_CHANGED:
          return { ...state, email: action.payload };
        case CONTACT_CHANGED:
          return { ...state, contact: action.payload };
        case PASSWORD_CHANGED:
          return { ...state, password: action.payload };
        case CONFIRM_PASSWORD_CHANGED:
          return { ...state, confirmPassword: action.payload };
        default:
          return state;
    }
};


export default registrationReducer;
