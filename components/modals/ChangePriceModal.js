import { useForm } from '../../hooks/useForm';
import Modal from './Modal';
import PrimaryButton from '../Buttons/PrimaryButton';
import PrimaryAltButton from '../Buttons/PrimaryAltButton';
import Dropdown from '../Dropdown/Dropdown';

const currencies = [
  { label: 'HNY', value: 'hny' }
];

export default function ChangePriceModal({ isOpen, onClose, onConfirm }) {
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
      onConfirm({
        ...data,
        currency: data.currency?.value
      });
    },
    initialValues: { // used to initialize the data
      currency: currencies[0],
      price: ''
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Lower the listing price">
      <div className="mt-4 mb-6">
        <label htmlFor="price" className="sr-only">Price</label>
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

      <p className="text-justify mt-10">
        You must pay an additional gas fee if you want to cancel this listing at a later point. <a href="#" className="text-cornflower">Learn more about canceling listings.</a>
      </p>

      <div className="flex justify-center mt-10 my-4">
        <PrimaryButton className="max-w-[200px]" onClick={handleSubmit}>Set new price</PrimaryButton>
        <PrimaryAltButton className="ml-4 max-w-[200px]" onClick={() => console.log('cancel change price')}>Never mind</PrimaryAltButton>
      </div>
    </Modal>
  );
}
