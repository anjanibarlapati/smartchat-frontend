import { getDeviceId } from 'react-native-device-info';
import { verifyOTP, generateOTPAndSendMail, createUser, verifyLogin } from './OtpVerification.service';

jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(),
}));

describe('Check for OTP Verification service functions', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('VerifyOTP should make POST request with correct payload', async () => {
    const mockResponse = { success: true };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const otp = '123456';
    const mobileNumber = '9876543210';

    const response = await verifyOTP(otp, mobileNumber);
    const data = await response.json();

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('verifyOTP'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ otp, mobileNumber }),
    });
    expect(data).toEqual(mockResponse);
  });

  test('GenerateOTPAndSendMail should send email and mobile number', async () => {
    const mockResponse = { success: true };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const email = 'mamatha@gmail.com';
    const mobileNumber = '6303974914';

    const response = await generateOTPAndSendMail(email, mobileNumber);
    const data = await response.json();

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('sendOTP'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, mobileNumber }),
    });
    expect(data).toEqual(mockResponse);
  });

  test('CreateUser should send correct mobile number', async () => {
    const mockResponse = { userCreated: true };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const mobileNumber = '6303974914';
    const response = await createUser(mobileNumber);
    const data = await response.json();

    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('register'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber }),
    });
    expect(data).toEqual(mockResponse);
  });

  test('VerifyLogin should make POST request with correct payload including deviceId', async () => {
    const mockResponse = { loginSuccess: true };
    const mockDeviceId = 'mock-device-id';

    (getDeviceId as jest.Mock).mockReturnValue(mockDeviceId);

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const mobileNumber = '6303974914';
    const otp = '123456';

    const response = await verifyLogin(mobileNumber, otp);
    const data = await response.json();

    expect(getDeviceId).toHaveBeenCalled();
    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('verifyLogin'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mobileNumber, deviceId: mockDeviceId, otp }),
    });
    expect(data).toEqual(mockResponse);
  });
});
