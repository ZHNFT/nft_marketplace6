import { convertToUsd } from '../../Utils/helper';
import { useForm } from '../../hooks/useForm';
import Modal from '../modals/Modal';
import { BeeIcon } from '../icons';
import PrimaryButton from '../Buttons/PrimaryButton';
import PrimaryAltButton from '../Buttons/PrimaryAltButton';

export default function PlaceBidModal({ isOpen, onClose, onConfirm }) {
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
    onSubmit: () => onConfirm(data.price),
    initialValues: { // used to initialize the data
      price: null
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Place a bid">
      <div className="mt-4 mb-8">
        <label htmlFor="price">Price</label>
        <div className="mt-1 relative">
          <div className="flex items-center rounded-lg border-[0.5px] border-cornflower">
            <div className="border-r-[0.5px] border-cornflower py-2 pl-2 pr-4">
              <BeeIcon className="w-[25px] h-[25px]" />
              <span>HNY</span>
            </div>
            <input
              type="text"
              inputMode="decimal"
              id="price"
              name="price"
              className="text-ink dark:text-white flex flex-1 bg-transparent"
              value={data.price || ''}
              onChange={handleChange('price')}
              placeholder="Amount"
              required
            />
            <span className="border-l-[0.5px] border-cornflower p-2 text-sm w-[80px] text-right">
              <span className="overflow-hidden truncate">${ convertToUsd({ value: data.price }) }</span>
            </span>
          </div>
          { errors.price && <p className="mt-1 absolute text-sm text-red-600">{ errors.price }</p> }
          <div className="mt-1 text-sm text-right">Balace: 0.0000 HNY</div>
        </div>
      </div>
      <div className="flex justify-center mt-10 my-4">
        <PrimaryButton className="max-w-[200px]" onClick={handleSubmit}>Place Bid</PrimaryButton>
        <PrimaryAltButton className="ml-4 max-w-[200px]" onClick={() => console.log('convert')}>Convert HNY</PrimaryAltButton>
      </div>
    </Modal>
  );
}
