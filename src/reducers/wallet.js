import { inicialWallet } from '../data';

const initialState = inicialWallet;

const walletReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'WALLET_UPDATE_VALUE':
    return {
      ...state,
      currencies: action.currValue,
    };
  case 'EXPANSES_UPDATE_VALUE':
    return {
      ...state,
      expenses: action.expValue,
    };
  case 'SUM_UPDATE_VALUE':
    return {
      ...state,
      soma: action.somaValue,
    };
  case 'EXPANSES_DOWGRADE_VALUE':
    return {
      ...state,
      expenses: action.newExpenses,
    };
  case 'SUM_DOWGRADE_VALUE':
    return {
      ...state,
      soma: action.dowValue,
    };
  default:
    return state;
  }
};

export default walletReducer;
