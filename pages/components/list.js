export default function List(items) {
    return(
        <div class="flex flex-col">
            {
                <table class="table-fixed">
                <thead>
                    <tr>
                        {Object.keys(items[0]).map((category, j) => (
                            <td key={j} class="text-gray-400">
                                {category}
                            </td>
                        ))}
                    </tr>
                </thead>
                <tbody>
                {items.map((item, i) => (
                    <tr key={i}>
                        {Object.keys(item).map((category, j) => (
                            <td key={j}>
                                {item[category]}
                            </td>
                        ))}
                    </tr>
                    
                  ))}
                </tbody>
              </table>
            }
            
        </div>
    )
}