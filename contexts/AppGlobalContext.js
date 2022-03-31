import { createContext } from 'react';

const AppGlobalContext = createContext({
  showEditProfileModal: false,
  setShowEditProfileModal: () => {},
  user: {},
  setUser: () => {},
});

export default AppGlobalContext;