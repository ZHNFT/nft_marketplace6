import { useState } from 'react';
import { convertToUsd } from '../../Utils/helper';
import { useForm } from '../../hooks/useForm';
import Modal from './Modal';
import { BeeIcon } from '../icons';
import PrimaryButton from '../Buttons/PrimaryButton';
import PrimaryAltButton from '../Buttons/PrimaryAltButton';
import Dropdown from '../Dropdown/Dropdown';

const expirationOptions = [
  { label: '1 day', value: 'day1' },
  { label: '3 days', value: 'day3' },
  { label: '7 days', value: 'day7' },
  { label: '1 month', value: 'month1' }
];

export default function MakeOfferModal({ isOpen, onClose, onConfirm }) {
  const date = new Date();
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
        expiration: data.expiration?.value
      });
    },
    initialValues: { // used to initialize the data
      price: null,
      expiration: expirationOptions[0],
      time: `${date.getHours().toString().length < 2 ? '0' : ''}${date.getHours()}:${date.getMinutes()}`
    },
  });
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Make an offer">
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

      <div className="mt-4 mb-8">
        <label htmlFor="price">Offer Expiration</label>
        <div className="mt-1 relative flex items-center">
          <Dropdown 
            label="Method"
            className="text-left text-base max-w-[150px] p-1"
            selected={data.expiration}
            onSelect={selected => {
              handleChange('expiration')({ target: { value: selected }});
            }}
            list={expirationOptions}
          />
          <div className="flex flex-1">
            <label htmlFor="time" className="sr-only">Time</label>
            <input
              type="time"
              id="time"
              name="time"
              className="text-ink dark:text-white flex flex-1 bg-transparent rounded-lg ml-4"
              value={data.time || ''}
              onChange={handleChange('time')}
              required
            />
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-10 my-4">
        <PrimaryButton className="max-w-[200px]" onClick={handleSubmit}>Make Offer</PrimaryButton>
        <PrimaryAltButton className="ml-4 max-w-[200px]" onClick={() => console.log('convert')}>Convert HNY</PrimaryAltButton>
      </div>
    </Modal>
  );
}
