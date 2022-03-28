import { useCallback } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { TRANSACTION_STATUS } from '../../constants/nft';
import TransactionList from '../Transactions/TransactionList';
import PrimaryButton from '../Buttons/PrimaryButton';
import PrimaryAltButton from '../Buttons/PrimaryAltButton';
import Dropdown from '../Dropdown/Dropdown';
import PriceInputField from './Fields/PriceInputField';
import useCancelListing from '../../hooks/useCancelListing';
import useListNft from '../../hooks/useListNft';

const currencies = [
  { label: 'HNY', value: 'hny' }
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

export default function ChangePriceForm(props) {
  const { handleClose, activeListing, marketplaceContract, tokenContract, collectionId, tokenId, ethersProvider, marketplaceAddress, owner, chainId, fetchData } = props;
  const { handleCancelListing, cancellationTx: transaction, cancellationStatus, cancellationError } = useCancelListing({ marketplaceContract })
  const { handleList, approvalStatus, approvalError, apiStatus, apiError, signatureStatus, signatureError } = useListNft({ ethersProvider, collectionId, tokenId, tokenContract, marketplaceAddress, owner, chainId });

  const initialValues = {
    currency: currencies[0],
    price: ''
  };

  // For the owner of the NFT to change the price of an listing
  // we first cancel the current listing and then create a new listing
  const handleChangePrice = useCallback(async function (listing, price) {
    await handleCancelListing(listing);
    await handleList({ price, expirationDate: listing?.expiry });

    // set form submitting status to false
    actions.setSubmitting(false);

    // close modal here
    handleClose();

    fetchData();

    // eslint-disable-next-line
  }, [handleCancelListing, handleList])

  function handleSubmit(values, actions) {
    handleChangePrice(activeListing, values.price, actions)
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
            steps={[
              {
                title: 'Transaction to cancel old price',
                status: cancellationStatus,
                isDefaultOpen: true,
                description: cancellationError ? cancellationError : 'Description here'
              },
              {
                className: 'my-2',
                title: 'Approval',
                status: approvalStatus,
                isDefaultOpen: false,
                description: approvalError ? approvalError : 'Description here'
              },
              {
                className: 'my-2',
                title: 'Requesting signature',
                status: signatureStatus,
                isDefaultOpen: false,
                description: signatureError ? signatureError : 'Description here'
              },
              {
                className: 'my-2',
                title: 'Completion',
                status: apiStatus,
                isDefaultOpen: false,
                description: apiError ? apiError : 'Description here'
              }
            ]}
          />
        ) : (
          <Form>
           <Field 
             name="price"
             component={PriceInputField}
           />
            {/* <div className="mt-4 mb-6">
              <label htmlFor="price" className="sr-only">Price</label>
              <div className="mt-1 relative">
                <div className="flex">
                  <Field
                    name="currency"
                    hidden
                  />
                  <Dropdown
                    label={'New Price'}
                    className="mr-4 max-w-[128px] text-base"
                    isDisabled
                    selected={values.currency}
                    onSelect={selected => {
                      setFieldValue('currency', selected);
                    }}
                    list={currencies}
                  />

                </div>
              </div>
            </div> */}

            <p className="text-justify mt-10 max-w-[440px] text-xs text-[#969EAB]">
              You must pay an additional gas fee if you want to cancel this listing at a later point. <a href="#" className="text-cornflower">Learn more about canceling listings.</a>
            </p>

            <div className="flex justify-center mt-10 my-4">
              <PrimaryButton
                className="max-w-[200px]"
                type="submit"
                disabled={!isValid || isSubmitting}
              >
                Set new price
              </PrimaryButton>
              <PrimaryAltButton className="ml-4 max-w-[200px]" onClick={handleClose}>Never mind</PrimaryAltButton>
            </div>
          </Form>
        )
      }}
    </Formik>
  );
}
