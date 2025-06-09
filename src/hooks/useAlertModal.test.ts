import {renderHook} from '@testing-library/react-native';
import {useAlertModal} from './useAlertModal';

describe('useAlertModal', () => {
  it('should initialize with default values', () => {
    const {result} = renderHook(() => useAlertModal());

    expect(result.current.alertVisible).toBe(false);
    expect(result.current.alertMessage).toBe('');
    expect(result.current.alertType).toBe('info');
  });
});
