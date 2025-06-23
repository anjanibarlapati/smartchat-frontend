import React from 'react';
import {
  Image,
  ImageSourcePropType,
  Modal,
  Pressable,
  Text,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import {getStyles} from './ProfilePictureViewer.styles';

interface Props {
  visible: boolean;
  imageSource: ImageSourcePropType;
  name?: string;
  onClose: () => void;
}

export const ProfilePictureViewerModal: React.FC<Props> = ({
  visible,
  imageSource,
  name,
  onClose,
}) => {
  const {width, height} = useWindowDimensions();
  const styles = getStyles(width, height);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        style={styles.overlay}
        onPress={onClose}
        accessibilityLabel="ProfileModal">
        <TouchableWithoutFeedback>
          <View style={styles.imageWrapper}>
            <Image
              source={imageSource}
              style={styles.fullImage}
              resizeMode="contain"
            />
            {name && (
              <View style={styles.nameContainer}>
                <Text style={styles.contactName}>{name}</Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </Pressable>
    </Modal>
  );
};
