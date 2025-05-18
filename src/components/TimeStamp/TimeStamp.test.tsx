import { Provider } from 'react-redux';
import { store } from '../../redux/store';
import { TimeStamp } from './TimeStamp';
import { render } from '@testing-library/react-native';
import { format, subDays } from 'date-fns';

const renderTimeStamp = (from: 'chat-card' | 'chat-screen', date: Date) => {
    return render(
        <Provider store={store}>
            <TimeStamp from={from} date={date} />
        </Provider>
    );
};

describe('TimeStamp Component', ()=> {
  test('Should display time in hh:mm a format for today when from chart-card', () => {
    const date = new Date();
    const { getByText } = renderTimeStamp('chat-card', date);
    const expected = format(date, 'hh:mm a');
    expect(getByText(expected)).toBeTruthy();
  });

  test('Should display "Today" for today when from chat-screen', () => {
    const date = new Date();
    const { getByText } = renderTimeStamp('chat-screen', date);
    expect(getByText('Today')).toBeTruthy();
  });

  test('Should display "Yesterday" when message date is yesterday and from chat-screen', () => {
    const date = subDays(new Date(), 1);
    const { getByText } = renderTimeStamp('chat-screen', date);
    expect(getByText('Yesterday')).toBeTruthy();
  });

  test('Should display "Yesterday" when message date is yesterday and from chat-card', () => {
    const date = subDays(new Date(), 1);
    const { getByText } = renderTimeStamp('chat-card', date);
    expect(getByText('Yesterday')).toBeTruthy();
  });
  test('Should display weekday name when message date is within 7 days and from chat-screen', () => {
    const  date = subDays(new Date(), 5);
    const weekday = format(date, 'EEEE');
    const { getByText } = renderTimeStamp('chat-screen', date);
    expect(getByText(weekday)).toBeTruthy();
  });
  test('Should display dd/MM/yy when message is older than 7 days and from chart-card', () => {
    const date = subDays(new Date(), 10);
    const formatted = format(date, 'dd/MM/yy');
    const { getByText } = renderTimeStamp('chat-card', date);
    expect(getByText(formatted)).toBeTruthy();
  });

  test('Should display dd MMM yyyy when message is older than 7 days and from chat-screen', () => {
    const date = subDays(new Date(), 10);
    const expected = format(date, 'dd MMM yyyy');
    const { getByText } = renderTimeStamp('chat-screen', date);
    expect(getByText(expected)).toBeTruthy();
  });
//   test('Should render empty string for future message date', () => {
//     const future = addDays(new Date(), 2);
//     const { queryByText } = renderTimeStamp('chat-screen', future);
//     expect(queryByText('')).toBeNull();
//   });
});
