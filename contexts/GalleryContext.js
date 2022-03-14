import { createContext } from 'react';

const GalleryContext = createContext({
  activeModal: '',
  setActiveModal: () => {}
});

export default GalleryContext;