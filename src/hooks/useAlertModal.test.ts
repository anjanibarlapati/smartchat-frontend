import {renderHook, act} from '@testing-library/react-native';
import {useAlertModal} from './useAlertModal';

describe('useAlertModal', () => {
  it('should initialize with default values', () => {
    const {result} = renderHook(() => useAlertModal());

    expect(result.current.alertVisible).toBe(false);
    expect(result.current.alertMessage).toBe('');
    expect(result.current.alertType).toBe('info');
  });
  it('should show alert with provided message and default type "info"', () => {
    const {result} = renderHook(() => useAlertModal());

    act(() => {
      result.current.showAlert('Test message');
    });

    expect(result.current.alertVisible).toBe(true);
    expect(result.current.alertMessage).toBe('Test message');
    expect(result.current.alertType).toBe('info');
  });
  it('should show alert with specific type', () => {
    const {result} = renderHook(() => useAlertModal());

    act(() => {
      result.current.showAlert('Error occurred', 'error');
    });

    expect(result.current.alertVisible).toBe(true);
    expect(result.current.alertMessage).toBe('Error occurred');
    expect(result.current.alertType).toBe('error');
  });
  it('should hide the alert', () => {
    const {result} = renderHook(() => useAlertModal());

    act(() => {
      result.current.showAlert('Some alert');
      result.current.hideAlert();
    });

    expect(result.current.alertVisible).toBe(false);
    expect(result.current.alertMessage).toBe('Some alert');
    expect(result.current.alertType).toBe('info');
  });
});
