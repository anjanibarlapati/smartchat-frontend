import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Image } from 'react-native';
import { ProfilePictureViewerModal } from './PofilePictureViewer';

describe('Tests related to ProfilePictureViewerModal component', () => {
  const mockImage = {uri: require('../../../assets/images/profileImage.png')};
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should not render the modal when `visible` is false', () => {
    const {queryByLabelText} = render(
      <ProfilePictureViewerModal
        visible={false}
        imageSource={mockImage}
        onClose={mockOnClose}
      />,
    );
    expect(queryByLabelText('ProfileModal')).toBeNull();
  });

  it('should render modal when `visible` is true', () => {
    const {getByLabelText} = render(
      <ProfilePictureViewerModal
        visible={true}
        imageSource={mockImage}
        onClose={mockOnClose}
      />,
    );
    expect(getByLabelText('ProfileModal')).toBeTruthy();
  });

  it('should render image with correct image url', () => {
    const {getByLabelText} = render(
      <ProfilePictureViewerModal
        visible={true}
        imageSource={mockImage}
        onClose={mockOnClose}
      />,
    );
    const modal = getByLabelText('ProfileModal');
    const image = modal.findByType(Image);
    expect(image.props.source).toEqual(mockImage);
  });

  it('should call onClose when overlay is pressed', () => {
    const {getByLabelText} = render(
      <ProfilePictureViewerModal
        visible={true}
        imageSource={mockImage}
        onClose={mockOnClose}
      />,
    );

    fireEvent.press(getByLabelText('ProfileModal'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should display contact name if `name` is provided', () => {
    const {getByText} = render(
      <ProfilePictureViewerModal
        visible={true}
        imageSource={mockImage}
        onClose={mockOnClose}
        name="Rekha Korepu"
      />,
    );
    expect(getByText('Rekha Korepu')).toBeTruthy();
  });

  it('should not display contact name if `name` is not provided', () => {
    const {queryByText} = render(
      <ProfilePictureViewerModal
        visible={true}
        imageSource={mockImage}
        onClose={mockOnClose}
      />,
    );
    expect(queryByText('Rekha Korepu')).toBeNull();
  });
});
