import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';
import { Formik, Form, Field } from 'formik';
import { uploadToIpfs } from '../../Utils/helper';
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
import { PencilIcon } from '@heroicons/react/outline';
import Spinner from '../Spinner/Spinner';

const socialMediaFields = [
  { id: 'instagram', label: 'Instagram', placeholder: 'e.g. hiveinvestments', icon: () => <InstagramIcon className="w-[12px] mr-1.5" /> },
  { id: 'Telegram', label: 'Telegram', placeholder: 'e.g. https://t.me/hiveinvestments', icon: () => <TelegramIcon className="w-[12px] mr-2" /> },
  { id: 'twitter', label: 'Twitter', placeholder: 'e.g. hive.investments', icon: () => <TwitterIcon className="w-[12px] mr-2" /> },
  { id: 'discord', label: 'Discord', placeholder: 'e.g. https://discord.gg/3AHETJmrXW', icon: () => <DiscordIcon className="w-[12px] mr-2" /> }
];

const categories = [
  { label: 'Select an option', value: '' },
  { label: 'Art', value: 'art' },
  { label: 'Collectibles', value: 'collectibles' },
  { label: 'Music', value: 'music' },
  { label: 'Photography', value: 'photography' },
  { label: 'Sport', value: 'sport' },
  { label: 'Utility', value: 'utility' }
];

const tokens = [
  {
    label: 'HNY',
    value: 'hny',
    icon: () => <BeeIcon className="h-[15px]" />,
    data: {
      contract: '0x1fa2f83ba2df61c3d370071d61b17be01e224f3a',
      symbol: 'HNY',
      name: 'Honey',
      decimals: 18
    }
  },
  {
    label: 'wETH',
    value: 'weth',
    icon: () => <Image src={EthIcon} alt={name} width={10} height={15} />,
    data: {
      contract: '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
      symbol: 'WETH',
      name: 'Wrapped Ether',
      decimals: 18
    }
  },
  {
    label: 'wMATIC', 
    value: 'wmatic',
    icon: () => <Image src={MaticIcon} alt={name} width={15} height={15} />,
    data: {
      contract: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      symbol: 'WMATIC',
      name: 'Wrapped Matic',
      decimals: 18
    }
  }
];

const validate = ({ values, images }) => {
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

  if (!values.payoutAddress) {
    errors.address = 'Payout address is required';
  }

  if (!images?.profileImage) {
    errors.profileImage = 'Profile image is required'
  }

  if (!images?.featuredImage) {
    errors.featuredImage = 'Featured image is required'
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [images, setImages] = useState({});
  const [preview, setPreview] = useState({});

  const onSelectImage = event => {
    const name = event.target.name;
    const file = event.target.files[0];
    setPreview({...preview, [name]: URL.createObjectURL(file) });
    setImages({...images, [name]: file })
  };

  const getSocials = ({ platforms, data }) => platforms.reduce((acc, name) => {
    const href = data[name];
    if (href) {
      acc.push({ name, href });
    }
    return acc;
  }, []);

  const handleSubmit = async data => {
    setError(null);
    setIsLoading(true);
    const platforms = ['website', 'instagram', 'telegram', 'twitter', 'discord'];

    // upload files
    const [{ results: profileImageResult }, { results: featuredImageResult }] = await Promise.all([
      images.profileImage ? uploadToIpfs([images.profileImage]) : Promise.resolve({ results: []}),
      images.featuredImage ? await uploadToIpfs([images.featuredImage]) : Promise.resolve({ results: []})
    ]);
    
    const payload = {
      address: data.address,
      chain: 'polygon',
      royaltyRecipient: data.payoutAddress,
      name: data.name,
      category: [data.category?.value],
      description: data.description,
      images: {
        logo: profileImageResult?.[0]?.ipfsUrl,
        banner: '',
        featured: featuredImageResult?.[0]?.ipfsUrl
      },
      socials: getSocials({ platforms, data }),
      royaltyFee: data.royaltyPercent,
      currency: tokens.find(token => token.value === data.paymentTokens)?.data
    };

    const response = await fetch(`https://api.hexag0n.io/collections`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response?.json();
      setError(error?.message);
    } else {
      // reset
      setImages(null);
      setPreview(null);

      onClose();
    }

    setIsLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} paddingX={0} title="Add a collection" className="!max-w-[900px]" titleClassname="text-[22px]">
      <div className="px-4">
        <div className="max-h-[430px] overflow-y-auto scroller">
          <p className="dark:text-manatee text-frost text-xs mr-8">Fill in the details below to submit your collection for vetting. Our team will review your application and contact you if you pass the review process. </p>
          
          <h4 className="mt-5 mb-4 text-base">Collection details</h4>
          
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validate={values => validate({ values, images })}
          >
            {({ values, handleSubmit, errors, setFieldValue, handleChange }) => {
              return (
                <Form className="mr-8">
                  <div className="flex items-start justify-between px-0.5">
                    <div className="basis-5/12">
                      <div className="mb-6">
                        <label className="text-xs dark:text-manatee text-frost flex items-center mb-2" htmlFor="name">
                          Collection name 
                          <span className="dark:text-cornflower text-cobalt ml-1">*</span>
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
                        <label className="text-xs dark:text-manatee text-frost flex items-center mb-2">
                          Category
                          <span className="dark:text-cornflower text-cobalt ml-1">*</span>
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
                        <label className="text-xs dark:text-manatee text-frost flex items-center mb-2" htmlFor="website">
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
                      <label className="text-xs dark:text-manatee text-frost mb-2 flex" htmlFor="description">
                        Description
                        <span className="dark:text-cornflower text-cobalt ml-1">*</span>
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
                    <label className="text-xs dark:text-manatee text-frost flex items-center mb-2" htmlFor="address">
                      Contract address
                      <span className="dark:text-cornflower text-cobalt ml-1">*</span>
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
                      <p className="text-xs dark:text-manatee text-frost flex items-center mb-2">
                        Profile image
                        <span className="dark:text-cornflower text-cobalt ml-1">*</span>
                      </p>
                      <p className="text-xs dark:text-manatee text-frost">Recommended size 350px x 350px. This image will also be used as a cover if you do not upload a cover photo. The cover photo will be part of a future update.</p>
                      <div className="relative mt-4 flex items-center bg-white/[0.02] flex justify-between rounded-md py-6 px-8">
                        { preview?.coverImage && <Image className="aspect-w-1 object-cover object-center justify-center overflow-hidden" src={preview.coverImage} alt={name} layout="fill" /> }

                        <div className="relative">
                          <label className="group block cursor-pointer w-[74px] h-[74px] bg-[#333840] border-[1px] border-dashed border-malibu rounded-full p-[1.5px] overflow-hidden">
                            <input type="file" name="profileImage" className="hidden" accept="image/*" onChange={onSelectImage} />
                            <span className="sr-only">Change profile image</span>
                            <Image className="aspect-w-1 object-cover object-center justify-center rounded-full overflow-hidden" src={preview?.profileImage || PlaceholderImage} alt={name} layout="fill" />
                            <span className="bg-[#6589ff] w-[23px] h-[23px] flex items-center justify-center absolute bottom-[8px] right-0 z-10 dark:border-[#2b3441] border-white border-[2px] rounded-full overflow-hidden">
                              <CameraIcon className="text-white w-[13px]" />
                            </span>
                            <div className="opacity-0 group-hover:opacity-100 transition-all bg-black/[0.4] rounded-full absolute top-0 left-0 w-full h-full flex justify-center items-center text-white">
                              <PencilIcon className="w-5 h-5" />
                            </div>
                          </label>
                        </div>
                        
                        {/*<div className="z-10">
                          <label className="block cursor-pointer border-[0.5px] inline-block border-manatee py-2 px-6 bg-white[0.05] rounded-lg py-2 px-4 hover:border-cornflower hover:bg-white/[0.15] text-xs font-medium">
                            Add cover
                            <input type="file" name="coverImage" className="hidden" accept="image/*" onChange={onSelectImage} />
                          </label>
                         </div>*/}
                      </div>
                      { errors.profileImage && <p className="mt-2 text-xxs text-red-600">{ errors.profileImage }</p> }
                    </div>
                    <div className="basis-5/12 ml-6">
                      <p className="text-xs dark:text-manatee text-frost flex items-center mb-2">
                        Featured image
                        <span className="dark:text-cornflower text-cobalt ml-1">*</span>
                      </p>
                      <p className="text-xs dark:text-manatee text-frost">Recommended size 1,100px x 880px. This will be used on collection cards.</p>
                      <div className="relative mt-4">
                        <label className="group flex items-center justify-center block cursor-pointer w-full h-[240px] bg-white/[0.02] border-[1px] border-dashed border-malibu rounded-md p-[1.5px] overflow-hidden">
                          { 
                            preview?.featuredImage && (
                              <div className="z-10">
                                <Image className="aspect-w-1 object-cover object-center justify-center overflow-hidden" src={preview.featuredImage} alt={name} layout="fill" />
                              </div>
                            )
                          }
                          <input type="file" name="featuredImage" className="hidden" accept="image/*" onChange={onSelectImage} />
                          <span className="sr-only">Change featured image</span>
                          <div>
                            <Image className="h-8 w-8" src={PlaceholderImage} alt={name} width={67} height={75} />
                          </div>
                          <span className="z-30 bg-[#6589ff] w-[23px] h-[23px] flex items-center justify-center absolute -bottom-[10px] mx-auto left-0 right-0 z-10 dark:border-[#2b3441] border-white border-[2px] rounded-full overflow-hidden">
                            <CameraIcon className="text-white w-[13px]" />
                          </span>
                          <div className="z-20 opacity-0 group-hover:opacity-100 transition-all bg-black/[0.4] absolute top-0 left-0 w-full h-full flex justify-center items-center text-white">
                            <PencilIcon className="w-5 h-5" />
                          </div>
                        </label>
                      </div>
                      { errors.featuredImage && <p className="mt-2.5 text-xxs text-red-600">{ errors.featuredImage }</p> }
                    </div>
                  </div>

                  <h4 className="mt-5 mb-4 text-base">Social media</h4>

                  <div className="grid grid-cols-2 gap-y-5 gap-x-10">
                    {
                      socialMediaFields.map(({ id, label, placeholder, icon }) => (
                        <div key={id}>
                          <label className="text-xs dark:text-manatee text-frost flex items-center mb-2" htmlFor={id}>
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

                  <h4 className="mt-8 mb-4 text-base">Currency Selection <span className="dark:text-cornflower text-cobalt ml-1">*</span></h4>
                
                  <p className="dark:text-manatee text-frost text-xs mr-8 mb-2">Choose the currency in which you will be listing your collection. Note that listing in HNY means sellers will not be charged any marketplace fees to Hexagon - additionally, all royalties generated from your collection will be exempt from our sales tax. For all non-HNY currencies, there will be a marketplace fee of 2%.</p>
                  <p className='dark:text-manatee text-frost text-xs mr-8'>Caution: Your currency choice cannot be changed once the collection has been accepted.</p>
                  
                  <div role="group" className="mt-4 flex justify-between" aria-labelledby="radio-group">
                    {
                      tokens.map(({ label, value, icon }) => (
                        <label key={value} className={clsx(
                          'relative flex flex-1 cursor-pointer mx-6 first:ml-0 last:mr-0 flex-col items-center justify-center py-1.5 px-8 border-[0.5px] border-manatee rounded-md text-center overflow-hidden',
                          values?.paymentTokens.includes(value) ? 'border-cornflower after:bg-cornflower after:block after:m-auto after:h-[3px] after:w-full after:absolute after:left-0 after:bottom-0' : ''
                        )}>
                          <Field type="radio" name="paymentTokens" className="absolute -left-[999px]" value={value} />
                          { icon() }
                          <p className="text-xs mt-1">{ label }</p>
                        </label>
                      ))
                    }
                  </div>
                  
                  <h4 className="mt-8 mb-4 text-base">
                    Royalty Percentage
                    <span className="dark:text-cornflower text-cobalt ml-1">*</span>
                  </h4>
                  
                  <p className="dark:text-manatee text-frost text-xs mr-8 mb-2">
                  Choose the royalty percentage that you will receive from each transaction of your collection. Note that Hexagon’s marketplace fee is paid by the seller and is not deducted from your royalty percentage.
                  </p>
                  <p className="dark:text-manatee text-frost text-xs mr-8 mb-2">
                    Caution: this percentage can’t be changed once the collection has been accepted.
                  </p>
                  <div className="-mx-[6px]">
                    <RangeField
                      step={.1}
                      decimals={1}
                      initialValues={[2]}
                      min={2}
                      max={10}
                      suffix="%"
                      onChange={() => {}}
                    />
                  </div>

                  <div className="mt-10 mb-4">
                    <label className="text-xs dark:text-manatee text-frost flex items-center mb-2" htmlFor="payoutAddress">
                      Payout address
                      <span className="dark:text-cornflower text-cobalt ml-1">*</span>
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

                  {
                    error && <p className="mt-2 text-sm text-center text-red-400">{ error }</p>
                  }

                  <PrimaryButton
                    className="relative text-xs !px-6 text-center block ml-auto mt-8"
                    size="sm"
                    onClick={handleSubmit}
                  >
                    Submit application
                    { isLoading && <Spinner className="absolute w-[21px] right-1 top-[6px]" /> }
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
