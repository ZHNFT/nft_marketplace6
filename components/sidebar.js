import clsx from "clsx";

export default function Sidebar({ navigation, className, children }) {

  return (
    <div className={className}>
      <nav aria-label="Sidebar" className="sm:sticky top-4 mobile-only:overflow-y-auto mobile-only:overflow-x-hidden mobile-only:h-5/6 mobile-only:px-10">
        { navigation && <div className="pb-8 space-y-1">
          {navigation?.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={clsx(
                item.current ? 'bg-gray-200 text-gray-900' : 'dark:text-slate-300 text-slate-700 hover:bg-gray-50',
                'group flex items-center px-3 py-2 text-sm font-medium rounded-md'
              )}
              aria-current={item.current ? 'page' : undefined}
            >
              <item.icon
                className={clsx(
                  item.current ? 'text-gray-500' : 'dark:text-slate-200 text-slate-500 group-hover:text-gray-500',
                  'flex-shrink-0 -ml-1 mr-3 h-6 w-6'
                )}
                aria-hidden="true"
              />
              <span className="truncate">{item.name}</span>
            </a>
          ))}
        </div> }
        {children}
      </nav>
    </div>
  );
}