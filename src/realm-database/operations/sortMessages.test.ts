import Realm from "realm";

jest.mock('realm', () => {
  return {
    BSON: {
      ObjectId: jest.fn(() => 'mocked-object-id'),
    },
  };
});