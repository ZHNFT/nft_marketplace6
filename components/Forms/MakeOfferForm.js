import { useState, useEffect } from 'react';
import { add, getUnixTime } from 'date-fns';
import { formatEther, usdFormatter } from '../../Utils/helper';
import { Formik, Form, Field } from 'formik';
import PrimaryButton from '../Buttons/PrimaryButton';
import PrimaryAltButton from '../Buttons/PrimaryAltButton';
import TransactionList from '../Transactions/TransactionList';
import Dropdown from '../Dropdown/Dropdown';
import { NFT_MODALS } from '../../constants/nft';
import usePlaceBid from '../../hooks/usePlaceBid';
import usePlaceAuctionBid from '../../hooks/usePlaceAuctionBid';
import PriceInputField from './Fields/PriceInputField';
import ItemPrice from '../ItemPrice/ItemPrice';

const expirationOptions = [
  { label: '1 day', value: { unit: 'days', number: 1 } },
  { label: '3 days', value: { unit: 'days', number: 3 } },
  { label: '7 days', value: { unit: 'days', number: 7 } },
  { label: '1 month', value: { unit: 'months', number: 1 } }
];

// number = 60, percentage = 50, returns = 30;
function percentage(number, percentage) {
  return (number/100)*percentage;
}

const validate = (values, activeModal, activeListing, activeAuction, tokenBalance) => {
  const errors = {};
  if (!values.price) {
    errors.price = 'Required';
  } else if (!/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/i.test(values.price)) {
    errors.price = 'Invalid amount';
  } else if (Number(values.price) > Number(tokenBalance)) {
    errors.price = 'Insufficient balance';
  } else if (activeModal === NFT_MODALS.PLACE_BID) {
    const valueToIncrease = percentage(Number(formatEther(activeAuction?.highestBid)), 5);

    if (Number(values.price) < Number(formatEther(activeAuction?.minBid))) {
      errors.price = 'Must be greater than minimum bid';
    } else if (Number(values.price) <= Number(formatEther(activeAuction?.highestBid))) {
      errors.price = 'Must be greater than highest bid';
    } else if (Number(values.price) < Number(formatEther(activeAuction?.highestBid)) + valueToIncrease) {
      errors.price = `Must be greater than highest bid + a 5% increase`;
    }
  } else if (activeModal === NFT_MODALS.MAKE_OFFER) {
    if (Number(values.price) <= Number(formatEther(activeListing?.highestBid))) {
      errors.price = 'Must be greater than highest bid';
    }
  }

  return errors;
}

export default function MakeOfferForm(props) {
  const [formSubmittingDone, setFormSubmittingDone] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { tokenBalance, tokenPriceUsd, ethersProvider, chainId, tokenId, tokenContract, collectionId, address, marketplaceAddress, handleClose, owner, marketplaceContract, activeModal, fetchData, activeListing, activeAuction } = props;
  const { handlePlaceBid, allowanceStatus, allowanceError, apiStatus, apiError, signatureStatus, signatureError, apiResponse } = usePlaceBid({ tokenContract, marketplaceAddress, address, ethersProvider, chainId, tokenId, collectionId })
  const { handlePlaceAuctionBid, allowanceStatus: auctionAllowanceStatus, allowanceError: auctionAllowanceError, transactionStatus, transactionError, auctionTx } = usePlaceAuctionBid({ tokenContract, marketplaceAddress, address, marketplaceContract, tokenId, collectionId, owner })
  const date = new Date();
  const initialValues = {
    price: "",
    expiration: expirationOptions[0],
    time: `${date.getHours().toString().length < 2 ? '0' : ''}${date.getHours()}:${date.getMinutes()}`
  };

  const hasError = activeModal === NFT_MODALS.MAKE_OFFER 
    ? allowanceError || apiError || signatureError 
    : activeModal === NFT_MODALS.PLACE_BID 
      ? auctionAllowanceError || transactionError
      : false;

   async function handleSubmit(values, actions) {
    const { price, expiration, time } = values;
    setIsLoading(true);
    // TODO add time to expiration for make offer form
    const expirationDate = getUnixTime(add(new Date(), { [expiration?.value?.unit]: expiration?.value?.number }));

    if (activeModal === NFT_MODALS.MAKE_OFFER) {
      await handlePlaceBid({ price, expirationDate });
    }
    if (activeModal === NFT_MODALS.PLACE_BID) {
      await handlePlaceAuctionBid({ price })
    }

    // set form submitting status to false
    actions.setSubmitting(false);

    setFormSubmittingDone(true)
  }

  useEffect(() => {
    let timer;
    
    if (!hasError && formSubmittingDone && (auctionTx || apiResponse)) {
      // We need to timeout the fetching for auctionbid
      // because the data fetched from the server is not updated yet for auction bid
      // event listener takes some time I assume
      timer = setTimeout(() => {
        fetchData();
        setIsLoading(false)
        handleClose();
      }, 5000);
    }

    return () => clearTimeout(timer);

  }, [hasError, handleClose, fetchData, formSubmittingDone, auctionTx, apiResponse]);

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      // https://formik.org/docs/guides/validation
      validate={(values) => validate(values, activeModal, activeListing, activeAuction, tokenBalance)}
    >
      {/* https://formik.org/docs/api/formik#props-1 */}
      {({ values, setSubmitting, handleSubmit, errors, setFieldValue, handleChange, handleBlur, isSubmitting, isValid }) => {
        return isSubmitting || hasError || isLoading ? (
          <TransactionList
            steps={activeModal === NFT_MODALS.MAKE_OFFER ? [
              {
                title: `Increase Allowance / Approval to transfer ${values?.price} HNY`,
                status: allowanceStatus,
                isDefaultOpen: true,
                description: allowanceError ? allowanceError : ''
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
                title: 'Completion',
                status: apiStatus,
                isDefaultOpen: true,
                description: apiError ? apiError : ''
              }
            ] : [
              {
                title: `Increase Allowance / Approval to transfer ${values?.price} HNY`,
                status: auctionAllowanceStatus,
                isDefaultOpen: true,
                description: auctionAllowanceError ? auctionAllowanceError : ''
              },
              {
                className: 'my-2',
                title: 'Transaction status',
                status: transactionStatus,
                isDefaultOpen: true,
                description: transactionError ? transactionError : ''
              }]
            }
          />
        ) : (
          // https://formik.org/docs/api/form
          <Form>
            {/* https://formik.org/docs/api/field */}
            <Field 
              name="price"
              component={PriceInputField}
              showTokenBalance={true}
              tokenPriceUsd={tokenPriceUsd}
            />
            {activeModal === NFT_MODALS.MAKE_OFFER ? (
              <div className="mt-4 mb-8">
                <label htmlFor="price">Offer Expiration</label>
                <div className="mt-1 relative flex items-center">
                  <Field
                    name="expiration"
                    hidden
                  />
                  <Dropdown
                    label="Method"
                    className="text-left text-base max-w-[150px] p-1"
                    selected={values.expiration}
                    onSelect={selected => {
                      setFieldValue('expiration', selected);
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
                      value={values.time || ''}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>
            ) : null}
            <div className="flex justify-center mt-10 my-4">
              {activeModal === NFT_MODALS.MAKE_OFFER ? (
                <ItemPrice
                  label="Highest Bid"
                  value={activeListing?.highestBid}
                />
              ) : (
                <div className='flex flex-col'>
                  <ItemPrice
                    label="Highest Bid"
                    value={activeAuction?.highestBid}
                  />
                  <span>{`Percentage to increase 5%`}</span>
                  <span>
                    {`Minimum bid ${activeAuction?.highestBid ? 
                      Number(formatEther(activeAuction?.highestBid)) + percentage(Number(formatEther(activeAuction?.highestBid)), 5)
                    : formatEther(activeAuction?.minBid)}`}
                  </span>
                </div>
              )}
            </div>

            <div className="flex justify-center mt-10 my-4">
              <PrimaryButton
                className="max-w-[200px]"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                  Make Offer
              </PrimaryButton>
              <PrimaryAltButton className="ml-4 max-w-[200px]" onClick={() => console.log('convert')}>Convert HNY</PrimaryAltButton>
            </div>
          </Form>
        )
      }}
    </Formik>
  );
}
