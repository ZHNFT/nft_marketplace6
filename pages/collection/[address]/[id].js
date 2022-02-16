
// This will be the Single Asset of a collection (Single NFT)
// Route: http://localhost:3000/collection/[address]/[id]
// Example: http://localhost:3000/collection/0xdbe147fc80b49871e2a8d60cc89d51b11bc88b35/198

export default function Nft({ data }) {
  return (
    <>
      <span></span>
    </>
  );
};

export async function getServerSideProps(context) {
  const { params: { address, id } } = context;
  const res = await fetch(`http://localhost:3000/api/collection/${address}/${id}`);
  const data = await res?.json();
  
  return { props: { data: data?.data } };
}