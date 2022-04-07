import { useState, useEffect, useCallback } from 'react';
import { RadioGroup } from '@headlessui/react';
import { ellipseAddress } from '../../Utils';

import { Formik, Form, Field, ErrorMessage } from 'formik';
import { add, getUnixTime } from 'date-fns';
import { formatEther, usdFormatter } from '../../Utils/helper';
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

const validate = (values, minPrice) => {
  const errors = {};
  if (!values.price) {
    errors.price = 'Required';
  } else if (!/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/i.test(values.price)) {
    errors.price = 'Invalid amount';
  } else if (Number(values.price) < Number(formatEther(minPrice))) {
    errors.price = 'Must be greater than minimum price';
  }

  if (!values.percent) {
    errors.percent = 'Required';
  } else if (Number(values.percent) < 5) {
    errors.percent = 'Minimum price increase on each bid must be 5% or more';
  }

  return errors;
}

export default function Listing(props) {
  const [formSubmittingDone, setFormSubmittingDone] = useState(false);
  const { minPrice, tokenPriceUsd, ethersProvider, chainId, tokenId, marketplaceContract, tokenContract, collectionId, address, marketplaceAddress, name, owner, imageUrl, setShouldRefetch } = props;
  const { handleList, approvalStatus, approvalError, apiStatus, apiError, signatureStatus, signatureError, apiResponse } = useListNft({ ethersProvider, collectionId, tokenId, tokenContract, marketplaceAddress, owner, chainId });
  const { handleCreateAuction, approvalStatus: auctionApprovalStatus, approvalError: auctionApprovalError, apiStatus: auctionApiStatus, apiError: auctionApiError, signatureStatus: auctionSignatureStatus, signatureError: auctionSignatureError, transactionStatus, transactionError, auctionTx } = useListNftForAuction({ ethersProvider, collectionId, tokenId, tokenContract, marketplaceAddress, owner, marketplaceContract });
  const [fees, setFees] = useState({ "marketplaceFee": "0", "royaltyFee": "0" });

  const fetchFees = useCallback(async function () {
    let collection = await marketplaceContract.getCollectionInfo(collectionId);
    let royaltyFee = collection.royaltyFee;
    let marketplaceFee;

    if (royaltyFee != 0) {
      royaltyFee = royaltyFee.toString();
      royaltyFee = ((parseFloat(royaltyFee) * 99) / 10000).toFixed(1);
    } else {
      royaltyFee = "0"
    }

    if ("paymentTokens" in marketplaceContract) {
      let token = await marketplaceContract.paymentTokens(collection.currencyType)
      marketplaceFee = token.fee;
    } else {
      marketplaceFee = 0;
    }

    if (marketplaceFee != 0) {
      marketplaceFee = marketplaceFee.toString();
      marketplaceFee = ((parseFloat(marketplaceFee) * 100) / 10000).toFixed(1)
    } else {
      marketplaceFee = "0";
    }

    let data = { "marketplaceFee": marketplaceFee, "royaltyFee": royaltyFee }

    setFees(data);

  }, [marketplaceContract, collectionId]);

  useEffect(() => {
    fetchFees();
  }, [fetchFees])

  const initialValues = {
    type: listTypes[0],
    currency: currencies[0],
    price: '',
    duration: durations[0],
    percent: 50,
  };

  const hasError = approvalError || signatureError || apiError || auctionApprovalError || auctionSignatureError || auctionApiError || transactionError;

  // TODO: need to generate the token contract object corrisponding to token.contractAddress, so we can support multiple tokens other than honey

  async function handleSubmit(values, actions) {
    const { duration, type, currency, price, percent } = values;
    const expirationDate = getUnixTime(add(new Date(), { [duration?.value?.unit]: duration?.value?.number }));

    if (type?.value === 'fixed') {
      await handleList({ price, expirationDate });
    }
    if (type?.value === 'auction') {
      await handleCreateAuction({ price, expirationDate })
    }
    // set form submitting status to false
    actions.setSubmitting(false);

    setFormSubmittingDone(true)
  }

  useEffect(() => {
    if (!hasError && formSubmittingDone && (auctionTx || apiResponse)) {
      setShouldRefetch(true);
    }
  }, [hasError, formSubmittingDone, auctionTx, apiResponse, setShouldRefetch]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      // https://formik.org/docs/guides/validation
      validate={(values) => validate(values, minPrice)}
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
                    description: approvalError ? approvalError : ''
                    //To get set up for auction listings for the first time, you must approve this item for sale, which requires a one-time gas fee.
                  },
                  {
                    className: 'my-2',
                    title: 'Requesting Signature',
                    status: signatureStatus,
                    isDefaultOpen: true,
                    description: signatureError ? signatureError : ''
                  },
                  {
                    className: 'my-2',
                    title: 'Listing of Auction has Completed',
                    status: apiStatus,
                    isDefaultOpen: true,
                    description: apiError ? apiError : ''
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
                    isDefaultOpen: true,
                    description: auctionSignatureError ? auctionSignatureError : ''
                  },
                  {
                    className: 'my-2',
                    title: 'Listing of Auction has Completed',
                    status: auctionApiStatus,
                    isDefaultOpen: true,
                    description: auctionApiError ? auctionApiError : ''
                  },
                  {
                    className: 'my-2',
                    title: 'Listing of Auction has Completed',
                    status: transactionStatus,
                    isDefaultOpen: true,
                    description: transactionError ? transactionError : ''
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
                }

                {
                  // values.type.value === 'auction' && (
                  //   <div className="my-10 relative">
                  //     { /* Method */}
                  //     {/* 
                  //     the percent increment is in a ratio of percent/1000 in contract
                  //     so 5% is the minimum which is passed into the contract function as 50 (50 / 1000 = 0.05 = 5%)
                  //   */}
                  //     <p>Percent Increment</p>
                  //     <input
                  //       type="number"
                  //       name="percent"
                  //       id="percent"
                  //       value={values.percent || ''}
                  //       onChange={handleChange}
                  //       onBlur={handleBlur}
                  //       min="5"
                  //       max="100"
                  //       className="text-ink rounded-xl flex flex-1"
                  //     />
                  //     <ErrorMessage name="percent">{msg => <p className="mt-1 absolute text-sm text-red-600">{msg}</p>}</ErrorMessage>
                  //   </div>
                  // )
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
                  <p>Fees</p>
                  <div className="mt-1 text-sm text-manatee flex justify-between">
                    <span>Service Fee</span>
                    <span>{fees.marketplaceFee + "%"}</span>
                  </div>
                  <div className="text-sm text-manatee flex justify-between">
                    <span>Creator Fee</span>
                    <span>{fees.royaltyFee + "%"}</span>
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