export type Contact = {
  name: string;
  mobileNumber: string;
  doesHaveAccount: boolean,
  profilePicture: string | null
}

export type Contacts = {
  contacts: Contact[];
}
