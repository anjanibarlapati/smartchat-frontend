import {openCamera} from './openCamera';
import {requestPermission} from '../permissions/permissions';
import ImagePicker from 'react-native-image-crop-picker';

jest.mock('../permissions/permissions', () => ({
  requestPermission: jest.fn(),
}));

jest.mock('react-native-image-crop-picker', () => ({
  openCamera: jest.fn(),
}));

describe('Should test openCamera', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return null if permission is denied', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(false);

    const result = await openCamera();

    expect(requestPermission).toHaveBeenCalledWith('camera');
    expect(ImagePicker.openCamera).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('Should call ImagePicker.openCamera if permission is granted', async () => {
    const mockImage = {path: 'mocked/image.jpg'};
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (ImagePicker.openCamera as jest.Mock).mockResolvedValue(mockImage);

    const result = await openCamera();

    expect(requestPermission).toHaveBeenCalledWith('camera');
    expect(ImagePicker.openCamera).toHaveBeenCalledWith({
      mediaType: 'photo',
      cropping: true,
      freeStyleCropEnabled: true,
    });
    expect(result).toEqual(mockImage);
  });
});
