
export default function CollectionHeader({ total, collectionName }) {
  return (
    <div className="flex flex-col">
      <span className="text-ink">name: {collectionName}</span>
      <span className="text-ink">Total: {total}</span>
    </div>
  )
}