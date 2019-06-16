import { User } from '../model/user.model';
import { AuthActions, AuthActionTypes } from './auth.actions';


export type AuthState = {
  loggedIn: boolean,
  user: User
}

export const initialAuthState: AuthState = {
  loggedIn: false,
  user: undefined
};

export function authReducer(state: AuthState = initialAuthState, action: AuthActions): AuthState {
  switch (action.type) {
    case AuthActionTypes.LoginAction:
      return {
        loggedIn: true,
        user: action.payload.user
      };
    case AuthActionTypes.LogoutAction:
      return {
        loggedIn: false,
        user: undefined
      };
    default:
      return state;
  }
}
