
export default function CollectionHeader({ total, collectionName }) {
  return (
    <div className="flex flex-col">
      <span className="text-black">name: {collectionName}</span>
      <span className="text-black">Total: {total}</span>
    </div>
  )
}