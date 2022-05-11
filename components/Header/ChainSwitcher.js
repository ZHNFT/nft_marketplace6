import { useState, useEffect, useContext, Fragment } from 'react';
import Image from 'next/image';
import { Listbox, Transition } from '@headlessui/react';
import { toast } from "react-toastify";
import clsx from 'clsx';
import Web3Context from '../../contexts/Web3Context';
import { ChevronDownIcon } from '../icons';
import AvalancheLogo from "../../images/logo-avalanche.svg";
import EthereumLogo from "../../images/logo-ethereum.svg";
import PolygonLogo from "../../images/logo-polygon.svg";
import { ExclamationCircleIcon } from '@heroicons/react/outline';

const networks = {
  polygon: {
    chainId: `0x${Number(137).toString(16)}`,
    chainName: "Polygon Mainnet",
    nativeCurrency: {
      name: "MATIC",
      symbol: "MATIC",
      decimals: 18
    },
    rpcUrls: ["https://polygon-rpc.com"],
    blockExplorerUrls: ["https://polygonscan.com"]
  },
  ethereum: {
    chainId: `0x${Number(1).toString(16)}`,
    chainName: "Ethereum Mainnet",
    nativeCurrency: {
      name: "Ether",
      symbol: "ETH",
      decimals: 18
    },
    rpcUrls: ["https://eth-rpc.gateway.pokt.network"],
    blockExplorerUrls: ["https://etherscan.io"]
  },
  avalanche: {
    chainId: `0x${Number(43114).toString(16)}`,
    chainName: "Avalanche C-Chain",
    nativeCurrency: {
      name: "Avalanche",
      symbol: "AVAX",
      decimals: 18
    },
    rpcUrls: ["https://api.avax.network/ext/bc/C/rpc"],
    blockExplorerUrls: ["https://snowtrace.io"]
  }
};

const networkOptions = {
  137: { id: 'polygon', label: 'Polygon', logo: PolygonLogo },
  1: { id: 'ethereum', label: 'Ethereum', logo: EthereumLogo },
  43114: { id: 'avalanche', label: 'Avalanche', logo: AvalancheLogo }
};

export default function ChainSwitcher() {
  const { state: { provider, chainId } } = useContext(Web3Context);
  const [selectedNetwork, setSelectedNetwork] = useState(networkOptions?.[chainId]);

  const changeNetwork = async({ network }) => {
    try {
      await provider?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: networks[network]?.chainId }],
      });
    } catch (switchError) {
      // This error code indicates that the chain has not been added to MetaMask.
      if (switchError.code === 4902) {
        try {
          await provider?.request({
            method: 'wallet_addEthereumChain',
            params: [{ ...networks[network] }],
          });
        } catch (addError) {
          // handle "add" errors
          toast.error(addError?.message);
        }
      }
      // handle other "switch" errors
      toast.error(switchError?.message);

    }
  };

  return (
    <div className={clsx(
      'w-full max-w-[162px] ml-4',
      selectedNetwork ? 'md:min-w-[72px]' : 'md:min-w-[190px]'
    )}>
      <Listbox
        value={selectedNetwork}
        label="Change Network"
        onChange={async option => {
          await changeNetwork({ network: option.id });
        }}
      >
        <div className="relative">
          <Listbox.Button className={clsx(
            'flex items-center cursor-pointer text-sm relative w-full focus:outline-none focus-visible:border-malibu',
            'py-2.5 pl-3 pr-8 text-center rounded-[20px] focus:outline-none dark:bg-white/[0.05] bg-cobalt/[0.1] hover:text-cobalt'
          )}>
            {
              selectedNetwork
                ? (
                  <>
                    <Image
                      src={selectedNetwork.logo}
                      alt={selectedNetwork.label}
                      className=""
                      width="20"
                      height="20"
                    />
                    <span className={clsx(
                      'hidden md:block truncate ml-2 dark:hover:text-cornflower hover:text-cobalt',
                      !selectedNetwork.value ? 'dark:text-white text-ink' : ''
                    )}>
                      {selectedNetwork.label}
                    </span>
                  </>
                )
                : (
                  <>
                    <ExclamationCircleIcon className="w-6 dark:text-white text-cobalt" />
                    <span className="hidden md:block text-xs ml-1">Unsupported chain</span>
                  </>
                )
            }
            <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
              <ChevronDownIcon
                className={clsx('pr-1 w-[16px] dark:text-white text-frost')}
                aria-hidden="true"
              />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 w-[150px] md:w-[180px] py-1 mt-2.5 overflow-auto text-sm rounded-[12px] max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm bg-white dark:bg-pitch">
              {Object.values(networkOptions).map((item, itemIdx) => (
                <Listbox.Option
                  key={itemIdx}
                  className={({ active }) =>
                    `flex items-center cursor-pointer select-none relative py-2 px-4 ${
                      active ? 'bg-whiteLilac dark:bg-malibu' : ''
                    }`
                  }
                  value={item}
                >
                  {({ selectedNetwork }) => (
                    <>
                      <Image
                        src={item.logo}
                        alt={item.label}
                        className=""
                        width="20"
                        height="20"
                      />
                      <span
                        className={`ml-2 block truncate ${
                          selectedNetwork ? 'font-medium' : 'font-light'
                        }`}
                      >
                        {item.label}
                      </span>
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}
