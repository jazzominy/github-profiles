import { Subject } from 'rxjs';
import { LOADER } from './constants';

let dispatcherMap = {};

function dispatch(event) {
  if (event.type && dispatcherMap.hasOwnProperty(event.type)) {
    let subject = dispatcherMap[event.type];
    subject.next(event);
  }
}

function subscribe(eventType, nextFn, errFn = null) {
  if (!dispatcherMap.hasOwnProperty(eventType)) {
    dispatcherMap[eventType] = new Subject();
  }

  if (!errFn) {
    errFn = (err) => {
      console.log(`Error handled in event.js: ${err}`);
    };
  }

  let subscription = dispatcherMap[eventType].subscribe(nextFn, errFn);
  return subscription;
}

function showLoader(value) {
  dispatch({
    type: LOADER,
    payload: {
      show: value
    }
  });
}

export {
  dispatch,
  subscribe,
  showLoader
}