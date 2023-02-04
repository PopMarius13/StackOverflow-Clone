import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import answersReducer from './answers';
import questionsReducer from './questions';
import sessionReducer from './session';
import usersReducer from './users';
import votesReducer from './vote';
import tagsReducer from './tags';

const rootReducer = combineReducers({
  session: sessionReducer,
  users: usersReducer,
  questions: questionsReducer,
  answers: answersReducer,
  votes: votesReducer,
  tags: tagsReducer
});

let enhancer;

if (process.env.NODE_ENV === 'production') {
  enhancer = applyMiddleware(thunk);
} else {
  const logger = require('redux-logger').default;
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  enhancer = composeEnhancers(applyMiddleware(thunk, logger));
}

const configureStore = (preloadedState) => {
  return createStore(rootReducer, preloadedState, enhancer);
}

export default configureStore;