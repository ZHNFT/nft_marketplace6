import { createContext } from 'react';

const AppGlobalContext = createContext({
  showEditProfileModal: false,
  setShowEditProfileModal: () => {}
});

export default AppGlobalContext;