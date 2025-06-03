import ImagePicker from 'react-native-image-crop-picker';
import { requestPermission } from '../permissions/permissions';
import { openPhotoLibrary } from './openPhotoLibrary';

jest.mock('../permissions/permissions', () => ({
  requestPermission: jest.fn(),
}));

jest.mock('react-native-image-crop-picker', () => ({
  openPicker: jest.fn(),
}));

describe('Should test openPhotoLibrary', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('Should return null if media permission is denied', async () => {
    (requestPermission as jest.Mock).mockResolvedValue(false);

    const result = await openPhotoLibrary();

    expect(requestPermission).toHaveBeenCalledWith('media');
    expect(ImagePicker.openPicker).not.toHaveBeenCalled();
    expect(result).toBeNull();
  });

  it('Should call ImagePicker.openPicker if permission is granted', async () => {
    const mockImage = {path: 'mocked/library-image.jpg'};
    (requestPermission as jest.Mock).mockResolvedValue(true);
    (ImagePicker.openPicker as jest.Mock).mockResolvedValue(mockImage);

    const result = await openPhotoLibrary();

    expect(requestPermission).toHaveBeenCalledWith('media');
    expect(ImagePicker.openPicker).toHaveBeenCalledWith({
      mediaType: 'photo',
      cropping: true,
      freeStyleCropEnabled: true,
    });
    expect(result).toEqual(mockImage);
  });
});
