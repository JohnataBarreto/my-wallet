import { combineReducers } from 'redux';
/* import expensesReducer from './expenses'; */
import userReducer from './user';
import walletReducer from './wallet';

const rootReducer = combineReducers({
  user: userReducer,
  wallet: walletReducer,
});

export default rootReducer;
