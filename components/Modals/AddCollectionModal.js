import Image from 'next/image';
import clsx from 'clsx';
import { Formik, Form, Field } from 'formik';
import Modal from './Modal';
import { CameraIcon, ChainIcon, InstagramIcon, TwitterIcon, TelegramIcon, DiscordIcon, BeeIcon } from '../icons';
import InputField from '../Forms/InputField';
import TextareaField from '../Forms/TextareaField';
import Dropdown from '../Dropdown/Dropdown';
import RangeField from '../Forms/RangeField';
import PrimaryButton from '../Buttons/PrimaryButton';
import PlaceholderImage from '../../images/placeholder-image.png';
import EthIcon from '../../images/icon-eth.png';
import MaticIcon from '../../images/icon-matic.png';

const socialMediaFields = [
  { id: 'instagram', label: 'Instagram', placeholder: 'e.g. hiveinvestments', icon: () => <InstagramIcon className="w-[12px] mr-1.5" /> },
  { id: 'Telegram', label: 'Telegram', placeholder: 'e.g. https://t.me/hiveinvestments', icon: () => <TelegramIcon className="w-[12px] mr-2" /> },
  { id: 'twitter', label: 'Twitter', placeholder: 'e.g. hive.investments', icon: () => <TwitterIcon className="w-[12px] mr-2" /> },
  { id: 'discord', label: 'Discord', placeholder: 'e.g. https://discord.gg/3AHETJmrXW', icon: () => <DiscordIcon className="w-[12px] mr-2" /> }
];

const categories = [
  { label: 'Select an option', value: '' },
  { label: 'Utility', value: 'utility' },
  { label: 'Another category', value: 'anotherCategory' }
];

const tokens = [
  { label: 'HNY', value: 'hny', icon: () => <BeeIcon className="h-[18px] -mt-[4px] -mb-[7px]" /> },
  { label: 'wETH', value: 'weth', icon: () => <Image src={EthIcon} alt={name} width={10} height={15} /> },
  { label: 'wMATIC', value: 'wmatic', icon: () => <Image src={MaticIcon} alt={name} width={17} height={17} /> }
];

const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = 'Collection name is required';
  }

  if (!values.category?.value) {
    errors.category = 'Category is required';
  }

  if (!values.description) {
    errors.description = 'Description is required';
  }

  if (!values.address) {
    errors.address = 'Contract address is required';
  }

  return errors;
};

export default function AddCollectionModal(props) {
  const { isOpen, onClose, logo, name } = props;
  const initialValues = {
    name: null,
    description: null,
    category: categories[0],
    website: null,
    address: null,
    image: null,
    cover: null,
    featuredImage: null,
    instagram: null,
    telegram: null,
    twitter: null,
    discord: null,
    paymentTokens: [],
    royaltyPercent: 2,
    payoutAddress: null
  };

  const handleSubmit = () => {
    console.log('submit');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} paddingX={0} title="Add a collection" className="!max-w-[900px]" titleClassname="text-[22px]">
      <div className="px-4">
        <div className="max-h-[430px] overflow-y-auto scroller">
          <p className="text-manatee text-xs mr-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          
          <h4 className="mt-5 mb-4 text-base">Collection details</h4>
          
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={validate}
          >
            {({ values, handleSubmit, errors, setFieldValue, handleChange }) => {
              return (
                <Form className="mr-8">
                  <div className="flex items-start justify-between px-0.5">
                    <div className="basis-5/12">
                      <div className="mb-6">
                        <label className="text-xs text-manatee flex items-center mb-2" htmlFor="name">
                          Collection name 
                          <span className="text-cornflower ml-1">*</span>
                        </label>
                        <InputField
                          type="text"
                          value={values?.name || ''}
                          name="name"
                          placeholder="Enter your collection name"
                          required
                          error={errors.name}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="my-2">
                        <label className="text-xs text-manatee flex items-center mb-2">
                          Category
                          <span className="text-cornflower ml-1">*</span>
                        </label>
                        <Dropdown
                          label="Category"
                          className="text-left text-base"
                          selected={values.category}
                          onSelect={selected => setFieldValue('category', selected)}
                          list={categories}
                          error={errors.category}
                          isSelectField
                        />
                      </div>

                      <div className="my-6">
                        <label className="text-xs text-manatee flex items-center mb-2" htmlFor="website">
                          <ChainIcon className="w-[10px] mr-2" />
                          Website
                        </label>
                        <InputField
                          type="text"
                          value={values?.website || ''}
                          name="website"
                          placeholder="e.g. https://hive.investments"
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="flex-1 ml-10">
                      <label className="text-xs text-manatee mb-2 flex" htmlFor="description">
                        Description
                        <span className="text-cornflower ml-1">*</span>
                      </label>
                      <TextareaField
                        value={values?.description || ''}
                        name="description"
                        error={errors.description}
                        height="h-[182px]"
                        placeholder="Write a brief description about your collection"
                        maxLength="1000"
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="my-2">
                    <label className="text-xs text-manatee flex items-center mb-2" htmlFor="address">
                      Contract address
                      <span className="text-cornflower ml-1">*</span>
                    </label>
                    <InputField
                      type="text"
                      value={values?.address || ''}
                      name="address"
                      placeholder="e.g.  0xaCb1958b3c8c70568Dc0528E606d26267AB96cD4"
                      required
                      error={errors.address}
                      onChange={handleChange}
                    />
                  </div>

                  <h4 className="mt-7 mb-4 text-base">Images</h4>

                  <div className="flex items-start justify-between px-0.5">
                    <div className="flex-1">
                      <p className="text-xs text-manatee flex items-center mb-2">
                        Profile image
                        <span className="text-cornflower ml-1">*</span>
                      </p>
                      <p className="text-xs text-manatee">Recommended size 350px x 350px. This image will also be used as a cover if you do not upload a cover photo.</p>
                      <div className="mt-4 flex items-center bg-white/[0.02] flex justify-between rounded-md py-6 px-8">
                        <div className="relative">
                          <label htmlFor="userAvatar">
                            <button
                              type="button"
                              className="w-[74px] h-[74px] bg-[#333840] border-[1px] border-dashed border-malibu rounded-full p-[1.5px] overflow-hidden"
                              onClick={() => console.log('change image')}
                            >
                              <span className="sr-only">Change profile image</span>
                              <Image className="h-8 w-8" src={PlaceholderImage} alt={name} width={35} height={40} />
                              <span className="bg-[#6589ff] w-[23px] h-[23px] flex items-center justify-center absolute bottom-[8px] right-0 z-10 border-[#2b3441] border-[2px] rounded-full overflow-hidden">
                                <CameraIcon className="text-white w-[13px]" />
                              </span>
                              
                            </button>
                          </label>
                          <input type="file" className='w-10' id="userAvatar"/>
                        </div>
                        
                        <div>
                          <button 
                            type="button"
                            className="border-[0.5px] inline-block border-manatee py-2 px-6 bg-white[0.05] rounded-lg py-2 px-4 hover:border-cornflower hover:bg-white/[0.15] text-xs font-medium"
                            onClick={() => console.log('change cover')}
                          >
                            Add cover
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="basis-5/12 ml-6">
                      <p className="text-xs text-manatee flex items-center mb-2">
                        Featured image
                        <span className="text-cornflower ml-1">*</span>
                      </p>
                      <p className="text-xs text-manatee">Recommended size 1,100px x 880px. This will be used on collection cards.</p>
                      <div className="relative mt-4">
                        <button
                          type="button"
                          className="w-full h-[240px] bg-white/[0.02] border-[1px] border-dashed border-malibu rounded-md p-[1.5px] overflow-hidden"
                          onClick={() => console.log('change image')}
                        >
                          <span className="sr-only">Change profile image</span>
                          <Image className="h-8 w-8" src={PlaceholderImage} alt={name} width={67} height={75} />
                          <span className="bg-[#6589ff] w-[23px] h-[23px] flex items-center justify-center absolute -bottom-[10px] mx-auto left-0 right-0 z-10 border-[#2b3441] border-[2px] rounded-full overflow-hidden">
                            <CameraIcon className="text-white w-[13px]" />
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>

                  <h4 className="mt-5 mb-4 text-base">Social media</h4>

                  <div className="grid grid-cols-2 gap-y-5 gap-x-10">
                    {
                      socialMediaFields.map(({ id, label, placeholder, icon }) => (
                        <div key={id}>
                          <label className="text-xs text-manatee flex items-center mb-2" htmlFor={id}>
                            { icon && icon() }
                            { label }
                          </label>
                          <InputField
                            type="text"
                            value={values?.[id] || ''}
                            name={id}
                            error={errors[id]}
                            placeholder={placeholder}
                            onChange={handleChange}
                          />
                        </div>
                      ))
                    }
                  </div>

                  <h4 className="mt-8 mb-4 text-base">Payments</h4>
                  <p className="text-manatee text-xs mr-8">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                  
                  <p className="text-xs text-manatee flex items-center mt-4 mb-2">
                    Payment tokens
                    <span className="text-cornflower ml-1">*</span>
                  </p>
                  <p className="text-manatee text-xs mr-8">Tokens that can be used to buy and sell your items.</p>
                  
                  <div role="group" className="mt-4 flex justify-between" aria-labelledby="checkbox-group">
                    {
                      tokens.map(({ label, value, icon }) => (
                        <label key={value} className={clsx(
                          'relative flex flex-1 cursor-pointer mx-6 first:ml-0 last:mr-0 flex-col items-center justify-center py-1.5 px-8 border-[0.5px] border-manatee rounded-md text-center overflow-hidden',
                          values?.paymentTokens.includes(value) ? 'border-cornflower after:bg-cornflower after:block after:m-auto after:h-[3px] after:w-full after:absolute after:left-0 after:bottom-0' : ''
                        )}>
                          <Field type="checkbox" name="paymentTokens" className="absolute -left-[999px]" value={value} />
                          { icon() }
                          <p className="text-xs mt-1">{ label }</p>
                        </label>
                      ))
                    }
                  </div>
                  
                  <p className="text-xs text-manatee flex items-center mt-6 mb-2">
                    Royalty percentage
                    <span className="text-cornflower ml-1">*</span>
                  </p>
                  <p className="text-manatee text-xs mr-8 mb-2">Caution: This can’t be changed once the collection has been accepted.</p>
                  <div className="-mx-[6px]">
                    <RangeField
                      step={.1}
                      decimals={1}
                      initialValues={[2]}
                      suffix="%"
                      onChange={() => {}}
                    />
                  </div>

                  <div className="mt-10 mb-4">
                    <label className="text-xs text-manatee flex items-center mb-2" htmlFor="payoutAddress">
                      Payout address
                      <span className="text-cornflower ml-1">*</span>
                    </label>
                    <InputField
                      type="text"
                      value={values?.payoutAddress || ''}
                      name="payoutAddress"
                      placeholder="e.g.  0xaCb1958b3c8c70568Dc0528E606d26267AB96cD4"
                      required
                      error={errors.payoutAddress}
                      onChange={handleChange}
                    />
                  </div>

                  <PrimaryButton
                    className="text-xs !px-4 text-center block ml-auto mt-8"
                    size="sm"
                    onClick={handleSubmit}
                  >
                    Submit application
                  </PrimaryButton>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </Modal>
  );
}
