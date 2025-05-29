import { deleteAccount, logout, removeProfilePic, updateProfileDetails, updateProfilePic } from './Profile.services';

global.fetch = jest.fn();

describe('Tests related to Profile screen handlers', () => {

    beforeEach(() => {
        jest.resetAllMocks();
    });

    it('should call fetch when updateProfileDetails method invokes', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });
        await updateProfileDetails('firstName', 'Varun', '9392990600', 'sample-access-token');
        expect(fetch).toHaveBeenCalled();
    });

    it('should call fetch when removeProfilePic method invokes', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });
        await removeProfilePic('https://image.png', '9392990600', 'sample-access-token');
        expect(fetch).toHaveBeenCalled();
    });

    it('should call fetch when deleteAccount method invokes', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });
        await deleteAccount('9392990600', 'sample-access-token');
        expect(fetch).toHaveBeenCalled();
    });

    it('should call fetch when updated method invokes', async () => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });
        const formData = new FormData();
        formData.append('image', 'image');
        await updateProfilePic(formData, 'sample-access-token');
        expect(fetch).toHaveBeenCalled();
    });

    it('Should call fetch when logout method invokes', async() => {
        (global.fetch as jest.Mock).mockResolvedValue({
            ok: true,
        });
        await logout('9393939292', 'access_token');
        expect(fetch).toHaveBeenCalled();
    });

});
