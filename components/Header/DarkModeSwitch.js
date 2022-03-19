import { useEffect, useState } from 'react'
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { Switch } from '@headlessui/react';
import { MoonIcon, SunIcon } from '../icons';

export default function DarkModeSwitch() {
  const [mounted, setMounted] = useState(false)
  const { systemTheme, theme, setTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;
  const enabled = currentTheme === "dark" ? true : false;

  function handleThemeChange(event) {
    setTheme(event ? "dark" : "light");
  }

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  return (
    <Switch
      checked={enabled}
      onChange={handleThemeChange}
      style={{
        background: 'linear-gradient(161.6deg, #1E2024 -76.8%, #2A2F37 104.4%)',
        boxShadow: '0px 1px 0px #282D34, inset 2px -3px 10px rgba(21,23,26,0.2), inset 4px 4px 10px rgba(21, 23, 26, 0.7)'
      }}
      className={clsx(
        'relative w-[74px] inline-flex items-center py-2 px-2 rounded-full transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-white focus:outline-none',
        'text-manatee',
        enabled
          ? '' // box-shadow: 1px 1px 4px #15171A; border-radius: 50px;
          : 'bg-white'
      )}
    >
      <span className="sr-only">{enabled ? 'Enable' : 'Disable'} dark mode</span>
      <SunIcon
        className={clsx(
          'w-[15px] ml-1 transform transition-transform',
          enabled ? 'scale-100 duration-300' : 'scale-0 duration-500'
        )}
      />
      <MoonIcon
        className={clsx(
          'w-[15px] ml-5 transform transition-transform',
          enabled ? 'scale-0 duration-500' : 'scale-100 duration-300'
        )}
      />
      <span
        className={clsx(
          'absolute top-0 -left-[4px] bg-[#202225] w-11 h-8 rounded-full flex items-center justify-center transition duration-500 transform',
          enabled ? 'translate-x-[2.2rem]' : ''
        )}
      >
        <SunIcon
          className={clsx(
            'w-[15px] mr-2 flex-none transition duration-500 transform text-white',
            enabled ? 'opacity-0 scale-0' : 'opacity-100 scale-100'
          )}
        />
        <MoonIcon
          className={clsx(
            'w-[15px] flex-none -ml-6 transition duration-500 transform text-white',
            enabled ? 'opacity-100 scale-100' : 'opacity-0 scale-0'
          )}
        />
      </span>
    </Switch>
  )
}