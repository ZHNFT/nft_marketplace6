import { useState, useCallback } from 'react';
import { ethers } from "ethers";
import jwt from 'jsonwebtoken'
import { convertToUsd } from '../../Utils/helper';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { BeeIcon } from '../icons';
import PrimaryButton from '../Buttons/PrimaryButton';
import PrimaryAltButton from '../Buttons/PrimaryAltButton';
import TransactionList from '../Transactions/TransactionList';
import Dropdown from '../Dropdown/Dropdown';
import { getSignatureOffer } from '../../Utils/marketplaceSignatures';
import { TRANSACTION_STATUS, NFT_MODALS } from '../../constants/nft';
import { getTransactionStatus } from '../../Utils/helper';
import usePlaceBid from '../../hooks/usePlaceBid';
import usePlaceAuctionBid from '../../hooks/usePlaceAuctionBid';
import PriceInputField from './Fields/PriceInputField';

const expirationOptions = [
  { label: '1 day', value: 'day1' },
  { label: '3 days', value: 'day3' },
  { label: '7 days', value: 'day7' },
  { label: '1 month', value: 'month1' }
];

const validate = (values) => {
  const errors = {};
  if (!values.price) {
    errors.price = 'Required';
  } else if (!/^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$/i.test(values.price)) {
    errors.price = 'Invalid amount';
  }

  return errors;
}

export default function MakeOfferForm(props) {
  const { ethersProvider, chainId, tokenId, tokenContract, collectionId, address, marketplaceAddress, handleClose, owner, marketplaceContract, activeModal, fetchData } = props;
  const { handlePlaceBid, allowanceStatus, allowanceError, apiStatus, apiError } = usePlaceBid({ tokenContract, marketplaceAddress, address, ethersProvider, chainId, tokenId, collectionId })
  const { handlePlaceAuctionBid, allowanceStatus: auctionAllowanceStatus, allowanceError: auctionAllowanceError } = usePlaceAuctionBid({ tokenContract, marketplaceAddress, address, marketplaceContract, tokenId, collectionId, owner })
  const date = new Date();
  const initialValues = {
    price: null,
    expiration: expirationOptions[0],
    time: `${date.getHours().toString().length < 2 ? '0' : ''}${date.getHours()}:${date.getMinutes()}`
  };

   async function handleSubmit(values, actions) {
    const { price, expiration, time } = values;
    // TODO: combine and convert time and expiration to unix timestamp with https://date-fns.org/v2.28.0/docs/getUnixTime

    if (activeModal === NFT_MODALS.MAKE_OFFER) {
      await handlePlaceBid({ price, expirationDate: '' });
    }
    if (activeModal === NFT_MODALS.PLACE_BID) {
      await handlePlaceAuctionBid({ price })
    }

    // set form submitting status to false
    actions.setSubmitting(false);

    // close modal here
    handleClose();
    
    // refetch data
    fetchData();
  }

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      // https://formik.org/docs/guides/validation
      validate={validate}
    >
      {/* https://formik.org/docs/api/formik#props-1 */}
      {({ values, setSubmitting, handleSubmit, errors, setFieldValue, handleChange, handleBlur, isSubmitting, isValid }) => {
        return isSubmitting ? (
          <TransactionList
            steps={activeModal === NFT_MODALS.MAKE_OFFER ? [
              {
                title: `Increase Allowance / Approval to transfer ${values.price} HNY`,
                status: allowanceStatus,
                isDefaultOpen: true,
                description: 'Description here'
              },
              {
                className: 'my-2',
                title: 'Requesting Signature',
                status: 'transactionStatus.signature',
                isDefaultOpen: true,
                description: 'Description here'
              },
              {
                className: 'my-2',
                title: 'Completion',
                status: apiStatus,
                isDefaultOpen: true,
                description: apiError ? apiError : 'Description here'
              }
            ] : [
              {
                title: `Increase Allowance / Approval to transfer ${values.price} HNY`,
                status: auctionAllowanceStatus,
                isDefaultOpen: true,
                description: 'Description here'
              },
              {
                className: 'my-2',
                title: 'Requesting Signature',
                status: 'transactionStatus.signature',
                isDefaultOpen: true,
                description: 'Description here'
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
