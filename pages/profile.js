import ProfileHeader from '../components/Profile/ProfileHeader';
import Tabs from '../components/Tabs/Tabs';

// test user
const user = {
  name: 'Chelsea Hagon',
  email: 'chelseahagon@example.com',
  imageUrl:
    'https://images.unsplash.com/photo-1550525811-e5869dd03032?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
  address: '0x83..c585',
  instagram: 'bobgeldof',
  twitter: 'bobgeldof'
};

export default function Profile() {
  const tabs = [
    { href: '/profile', name: 'NFTs (12)' },
    { href: '/profile?tab=activity', name: 'Activity' },
    { href: '/profile?tab=offers', name: 'Offers' }
  ];
  return (
    <>
      <ProfileHeader user={user} />
      <section>
        <Tabs list={tabs} />
      </section>
    </>
  );
}
