import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import axios from 'axios';
import mockAxios from 'jest-mock-axios/dist';

mockAxios.interceptors = {
    request: {
        use: () => {
        }
    }, response: {
        use: () => {
        }
    }
};

const UppercaseProxy = () => {
    let axiosPromise = axios.get('../actuator');
    axiosPromise = axiosPromise.then(serverData => serverData.data.toUpperCase());
    return (axiosPromise);
};

afterEach(() => {
    // cleaning up the mess left behind the previous test
    mockAxios.reset();
});

it('renders without crashing', () => {

    let catchFn = jest.fn(), thenFn = jest.fn();
    UppercaseProxy().then(thenFn).catch(catchFn);
    mockAxios.mockResponse({data: 'ok'});

    const div = document.createElement('div');
    ReactDOM.render(<App/>, div);
    ReactDOM.unmountComponentAtNode(div);

    expect(mockAxios.get).toHaveBeenCalledWith('../actuator');
    expect(thenFn).toHaveBeenCalledWith('OK');
    expect(catchFn).not.toHaveBeenCalled();
});
