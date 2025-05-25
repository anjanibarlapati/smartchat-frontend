export type UserContact = {
  mobileNumber: string;
  doesHaveAccount: boolean;
  profilePicture: string | null;
}

export type Contact = UserContact & {
  name: string;
  originalNumber: string;
}

export type Contacts = {
  contacts: Contact[];
}
