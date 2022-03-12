import { RadioGroup } from '@headlessui/react';
import { useForm } from '../../hooks/useForm';
import Dropdown from '../Dropdown/Dropdown';
import PrimaryButton from '../Buttons/PrimaryButton';

const listTypes = [
  { label: 'Fixed Price', value: 'fixed' },
  { label: 'Timed Auction', value: 'auction' }
];

const currencies = [
  { label: 'HNY', value: 'hny' }
];

const auctionMethods = [
  { label: 'Sell to highest bidder', value: 'highestBidder' },
  { label: 'Sell with declining price', value: 'decliningPrice' }
];

export default function Listing({ onSuccess }) {
  const {
    handleSubmit, // handles form submission
    handleChange, // handles input changes
    data, // access to the form data
    errors, // includes the errors to show
  } = useForm({
    validations: { // validation rules
      price: {
        pattern: {
          value: '^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$',
          message: 'Invalid amount'
        },
      },
    },
    onSubmit: () => {
      onSuccess({
        ...data,
        type: data.type?.value,
        currency: data.currency?.value,
        auctionMethod: data.auctionMethods?.value
      });
    },
    initialValues: { // used to initialize the data
      type: listTypes[0],
      currency: currencies[0],
      price: '',
      duration: '',
      auctionMethod: auctionMethods[0]
    },
  });

  return (
    <div className="max-w-lg ">
      <div className="my-6">
        { /* List type */ }
        <RadioGroup
          value={data.type}
          onChange={selected => {
            handleChange('type')({ target: { value: selected }});
          }}
        >
          <RadioGroup.Label>Type</RadioGroup.Label>
          <div className="flex mt-1">
            {listTypes.map((listType) => (
              <RadioGroup.Option
                key={listType.value}
                value={listType}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-1 ring-offset-sky-300 ring-white ring-opacity-60'
                      : ''
                  }
                  ${
                    checked ? 'bg-cornflower bg-opacity-75 text-white' : 'bg-white'
                  }
                    relative first:rounded-l-lg last:rounded-r-lg shadow-md px-5 py-4 cursor-pointer flex flex-1 focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex items-center justify-between w-full">
                      <div className="flex items-center mx-auto">
                        <div>
                          <RadioGroup.Label
                            as="p"
                            className={`${
                              checked ? 'text-white font-medium' : 'text-gray-900'
                            }`}
                          >
                            {listType.label}
                          </RadioGroup.Label>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>

        {
          data.type.value === 'auction' && (
            <div className="my-10">
              { /* Method */ }
              <p>Method</p>
              <Dropdown 
                label="Method"
                className="mt-1 text-left text-base"
                selected={data.auctionMethod}
                onSelect={selected => {
                  handleChange('auctionMethod')({ target: { value: selected }});
                }}
                list={auctionMethods}
              />
            </div>
          )
        }

        <div className="my-10">
        { /* Price */ }
          <label htmlFor="price">
            { data.type === 'fixed' ? 'Price' : 'Starting price' }
          </label>
          <div className="mt-1 relative">
            <div className="flex">
              <Dropdown
                label={ data.type === 'fixed' ? 'Price' : 'Starting price' }
                className="mr-4 max-w-[128px] text-base"
                isDisabled
                selected={data.currency}
                onSelect={selected => {
                  handleChange('currency')({ target: { value: selected }});
                }}
                list={currencies}
              />
              <input
                type="text"
                id="price"
                name="price"
                className="text-ink rounded-xl flex flex-1"
                value={data.price || ''}
                onChange={handleChange('price')}
                required
              />
            </div>
            { errors.price && <p className="mt-1 absolute text-red-600">{ errors.price }</p> }
          </div>
        </div>

        <div className="my-10">
          { /* Duration */ }
          <label htmlFor="duration">Duration</label>
          <div className="flex mt-1">
            <input
              type="text"
              id="duration"
              name="duration"
              className="text-ink rounded-xl flex flex-1"
              value={data.duration || ''}
              placeholder="7 days"
              onChange={handleChange('duration')}
            />
          </div>
        </div>

        <div className="my-6">
          { /* Fees */ }
          <p>Fees</p>
          <div className="mt-1 text-sm text-manatee flex justify-between">
            <span>Service Fee</span>
            <span>2.5%</span>
          </div>
          <div className="text-sm text-manatee flex justify-between">
            <span>Creator Fee</span>
            <span>5.0%</span>
          </div>
        </div>

        <div className="mt-9 flex justify-center">
          <PrimaryButton
            className="max-w-[300px]"
            onClick={handleSubmit}
          >
            Complete listing
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
}