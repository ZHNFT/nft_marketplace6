
export default function CollectionHeader({ total, collectionName }) {
  return (
    <div className="flex flex-col">
      <span>name: {collectionName}</span>
      <span>Total: {total}</span>
    </div>
  )
}