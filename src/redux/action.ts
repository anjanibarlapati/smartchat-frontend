
export const FIRST_NAME_CHANGED = 'FIRST_NAME_CHANGED';
export const LAST_NAME_CHANGED = 'LAST_NAME_CHANGED';
export const EMAIL_CHANGED = 'EMAIL_CHANGED';
export const CONTACT_CHANGED = 'CONTACT_CHANGED';
export const PASSWORD_CHANGED = 'PASSWORD_CHANGED';
export const CONFIRM_PASSWORD_CHANGED = 'CONFIRM_PASSWORD_CHANGED';
export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILURE = 'REGISTER_FAILURE';

export const firstNameChanged = (firstName :string) =>({
    type: FIRST_NAME_CHANGED,
    payload: firstName,
});

export const lastNameChanged = (lastName : string) =>({
    type: LAST_NAME_CHANGED,
    payload: lastName,
});

export const emailChanged = (email: string) => ({
    type: EMAIL_CHANGED,
    payload: email,
  });

  export const contactChanged = (contact: string) => ({
    type: CONTACT_CHANGED,
    payload: contact,
  });

  export const passwordChanged = (password: string) => ({
    type: PASSWORD_CHANGED,
    payload: password,
  });

  export const confirmPasswordChanged = (confirmPassword: string) => ({
    type: CONFIRM_PASSWORD_CHANGED,
    payload: confirmPassword,
  });
