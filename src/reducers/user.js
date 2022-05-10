import { inicialUser } from '../data';

const initialState = inicialUser;

const userReducer = (state = initialState, action) => {
  switch (action.type) {
  case 'USER_UPDATE_VALUE':
    return {
      ...state,
      email: action.newValue,
    };
  default:
    return state;
  }
};

export default userReducer;
