// Components
import Seo from './seo';

export default function Layout({ children }) {

  return (
    <>
      <Seo />
      {children}
    </>
  )
}