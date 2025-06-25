import { getDeviceId } from 'react-native-device-info';
import { verifyUserDetails } from './Registration.service';

jest.mock('react-native-device-info', () => ({
  getDeviceId: jest.fn(),
}));

describe('Verify User Details', () => {
  const mockDeviceId = 'mock-device-id';

  beforeEach(() => {
    (getDeviceId as jest.Mock).mockReturnValue(mockDeviceId);
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should append deviceId to formData and make POST request', async () => {
    const formData = new FormData();
    formData.append('name', 'Mamatha');

    const expectedFormData = new FormData();
    expectedFormData.append('name', 'Mamatha');
    expectedFormData.append('deviceId', mockDeviceId);

    const mockResponse = {
      ok: true,
      status: 200,
      json: async () => ({ success: true }),
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce(mockResponse);

    const response = await verifyUserDetails(formData);
    const responseData = await response.json();

    expect(getDeviceId).toHaveBeenCalled();


    expect(global.fetch).toHaveBeenCalledWith(expect.stringContaining('verify'), {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: expect.any(FormData),
    });

    expect(responseData).toEqual({ success: true });
  });

  it('should handle fetch failure', async () => {
    const formData = new FormData();
    formData.append('email', 'mamatha@gmail.com');

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'));

    await expect(verifyUserDetails(formData)).rejects.toThrow('Network error');
  });
});
