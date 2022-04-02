import { RadioGroup } from '@headlessui/react';
import { ellipseAddress } from '../../Utils';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { add, getUnixTime } from 'date-fns';
import Dropdown from '../Dropdown/Dropdown';
import PrimaryButton from '../Buttons/PrimaryButton';
import TransactionList from '../Transactions/TransactionList';
import Image from 'next/image';
import ItemPrice from '../ItemPrice/ItemPrice';
import useListNft from '../../hooks/useListNft';
import useListNftForAuction from '../../hooks/useListNftForAuction';
import PriceInputField from './Fields/PriceInputField';

const listTypes = [
  { label: 'Fixed Price', value: 'fixed' },
  { label: 'Timed Auction', value: 'auction' }
];

const currencies = [
  { label: 'HNY', value: 'hny' }
];

const durations = [
  { label: '1 day', value: { unit: 'days', number: 1 } },
  { label: '3 days', value: { unit: 'days', number: 3 } },
  { label: '7 days', value: { unit: 'days', number: 7 } },
  { label: '1 month', value: { unit: 'months', number: 1 } },
  { label: '3 months', value: { unit: 'months', number: 3 } },
  { label: '6 months', value: { unit: 'months', number: 6 } }
];

const validate = (values) => {
  const errors = {};
  if (!values.price) {
    errors.price = 'Required';
  } else if (!/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/i.test(values.price)) {
    errors.price = 'Invalid amount';
  }

  if (!values.percent) {
    errors.percent = 'Required';
  } else if (Number(values.percent) < 5) {
    errors.percent = 'Minimum price increase on each bid must be 5% or more';
  }

  return errors;
}

export default function Listing(props) {
  const { tokenPriceUsd, fetchData, ethersProvider, chainId, tokenId, marketplaceContract, tokenContract, collectionId, address, marketplaceAddress, handleClose, name, owner, imageUrl } = props;
  const { handleList, approvalStatus, approvalError, apiStatus, apiError, signatureStatus, signatureError } = useListNft({ ethersProvider, collectionId, tokenId, tokenContract, marketplaceAddress, owner, chainId });
  const { handleCreateAuction, approvalStatus: auctionApprovalStatus, approvalError: auctionApprovalError, apiStatus: auctionApiStatus, apiError: auctionApiError, signatureStatus: auctionSignatureStatus, signatureError: auctionSignatureError, transactionStatus, transactionError } = useListNftForAuction({ ethersProvider, collectionId, tokenId, tokenContract, marketplaceAddress, owner, marketplaceContract });
  const initialValues = {
    type: listTypes[0],
    currency: currencies[0],
    price: '',
    duration: durations[0],
    percent: 5,
  };

  async function handleSubmit(values, actions) {
    const { duration, type, currency, price, percent } = values;
    const expirationDate = getUnixTime(add(new Date(), { [duration?.value?.unit]: duration?.value?.number }));

    if (type?.value === 'fixed') {
      await handleList({ price, expirationDate });
    }
    if (type?.value === 'auction') {
      await handleCreateAuction({ price, expirationDate, percent })
    }
    // set form submitting status to false
    actions.setSubmitting(false);

    // close modal here
    handleClose();

    // refetch data
    fetchData();
  }

  const hasError = (type) => type === 'fixed' 
    ? approvalError || signatureError || apiError 
    : type === 'auction'
      ? auctionApprovalError || auctionSignatureError || auctionApiError || transactionError
      : false;

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      // https://formik.org/docs/guides/validation
      validate={validate}
    >
      {/* https://formik.org/docs/api/formik#props-1 */}
      {({ values, setSubmitting, handleSubmit, errors, touched, setFieldValue, handleChange, handleBlur, isSubmitting, isValid }) => {
        return isSubmitting || hasError ? (
          <div className="max-w-lg mt-5">
            <div className="flex justify-between mb-6">
              <div className="flex items-center">
                {
                  imageUrl && (
                    <div className="mr-2 rounded-xl overflow-hidden h-[40px]">
                      <Image src={imageUrl} alt={name} width={40} height={40} />
                    </div>
                  )
                }
                <div className="leading-none">
                  <p className="text-sm text-manatee">{ellipseAddress(collectionId, 4)}</p>
                  <p>{name}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-manatee">Price</p>
                <ItemPrice value={Number(values.price) * 10 ** 18} />
              </div>
            </div>
            <div className="my-6">
              <TransactionList
                steps={values.type.value === 'fixed' ? [
                  {
                    title: 'Approval to transfer',
                    status: approvalStatus,
                    isDefaultOpen: true,
                    description: approvalError ? approvalError : 'To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.'
                  },
                  {
                    className: 'my-2',
                    title: 'Requesting Signature',
                    status: signatureStatus,
                    isDefaultOpen: false,
                    description: signatureError ? signatureError : 'Description here'
                  },
                  {
                    className: 'my-2',
                    title: 'Listing of Auction has Completed',
                    status: apiStatus,
                    isDefaultOpen: false,
                    description: apiError ? apiError : 'Description here'
                  }
                ] : [
                  {
                    title: 'Approval to transfer',
                    status: auctionApprovalStatus,
                    isDefaultOpen: true,
                    description: auctionApprovalError ? auctionApprovalError : 'To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.'
                  },
                  {
                    className: 'my-2',
                    title: 'Requesting Signature',
                    status: auctionSignatureStatus,
                    isDefaultOpen: false,
                    description: auctionSignatureError ? auctionSignatureError : 'Description here'
                  },
                  {
                    className: 'my-2',
                    title: 'Listing of Auction has Completed',
                    status: auctionApiStatus,
                    isDefaultOpen: false,
                    description: auctionApiError ? auctionApiError : 'Description here'
                  },
                  {
                    className: 'my-2',
                    title: 'Listing of Auction has Completed',
                    status: transactionStatus,
                    isDefaultOpen: false,
                    description: transactionError ? transactionError : 'Description here'
                  }
                ]}
              />
            </div>
          </div>
        ) : (
          <Form>
            <div className="max-w-lg ">
              <div className="my-6">
                { /* List type */}
                <Field
                  name="type"
                  hidden
                />
                <RadioGroup
                  value={values.type}
                  onChange={selected => {
                    setFieldValue('type', selected);
                  }}
                >
                  <RadioGroup.Label>Type</RadioGroup.Label>
                  <div className="flex mt-1">
                    {listTypes.map((listType) => (
                      <RadioGroup.Option
                        key={listType.value}
                        value={listType}
                        className={({ active, checked }) =>
                          `${active
                            ? 'ring-1 ring-offset-sky-300 ring-white ring-opacity-60'
                            : ''
                          }
                        ${checked ? 'bg-cornflower bg-opacity-75 text-white' : 'bg-white'
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
                                    className={`${checked ? 'text-white font-medium' : 'text-gray-900'
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
                  values.type.value === 'auction' && (
                    <div className="my-10 relative">
                      { /* Method */}
                      {/* 
                      the percent increment is in a ratio of percent/1000 in contract
                      so 5% is the minimum which is passed into the contract function as 50 (50 / 1000 = 0.05 = 5%)
                    */}
                      <p>Percent Increment</p>
                      <input
                        type="number"
                        name="percent"
                        id="percent"
                        value={values.percent || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        min="5"
                        max="100"
                        className="text-ink rounded-xl flex flex-1"
                      />
                      <ErrorMessage name="percent">{msg => <p className="mt-1 absolute text-sm text-red-600">{msg}</p>}</ErrorMessage>
                    </div>
                  )
                }

                <div className="my-10">
                  { /* Price */}
                  <Field
                    name="price"
                    component={PriceInputField}
                    label={values.type.value === 'fixed' ? 'Price' : 'Starting price'}
                    tokenPriceUsd={tokenPriceUsd}
                  />
                  {/* <label htmlFor="price">
                    {values.type.value === 'fixed' ? 'Price' : 'Starting price'}
                  </label>
                  <div className="mt-1 relative">
                    <div className="flex">
                      <Field
                        name="currency"
                        hidden
                      />
                      <Dropdown
                        label={values.type.value === 'fixed' ? 'Price' : 'Starting price'}
                        className="mr-4 max-w-[128px] text-base"
                        isDisabled
                        selected={values.currency}
                        onSelect={selected => {
                          setFieldValue('currency', selected);
                        }}
                        list={currencies}
                      />
                      <input
                        type="text"
                        id="price"
                        name="price"
                        className="text-ink rounded-xl flex flex-1"
                        value={values.price || ''}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                    </div>
                    <ErrorMessage name="price">{msg => <p className="mt-1 absolute text-red-600">{msg}</p>}</ErrorMessage>
                  </div> */}
                </div>

                <div className="my-10">
                  { /* Duration */}
                  <p>Duration</p>
                  <div className="flex mt-1">
                    <Field
                      name="duration"
                      hidden
                    />
                    <Dropdown
                      label="Duration"
                      className="mt-1 text-left text-base"
                      selected={values.duration}
                      onSelect={selected => {
                        setFieldValue('duration', selected);
                      }}
                      list={durations}
                    />
                  </div>
                </div>

                <div className="my-6">
                  { /* TODO GET DATA FROM COLLECTION Fees */}
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
                    type="submit"
                    disabled={!isValid || isSubmitting}
                  >
                    Complete listing
                  </PrimaryButton>
                </div>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  );
}