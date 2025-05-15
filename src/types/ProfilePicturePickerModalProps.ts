import { UploadImage } from './UploadImage';

export type ProfilePicturePickerModalProps = {
    isEditingProfilePicture: boolean;
    close: () => void;
    profilePicture: UploadImage | null | string,
    setProfilePic:  React.Dispatch<React.SetStateAction<string | UploadImage | null>>
    remove: () => void
}
