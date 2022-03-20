import Image from 'next/image';
import DefaultLogo from '../../images/default-collection-logo-2.png';
import { useForm } from '../../hooks/useForm';
import Modal from './Modal';
import { CameraIcon, ChainIcon, InstagramIcon, TwitterIcon } from '../icons';
import InputField from '../Forms/InputField';
import TextareaField from '../Forms/TextareaField';
import PrimaryButton from '../Buttons/PrimaryButton';

const textFields = [
  { id: 'name', label: 'Collection Name', isRequired: true },
  { id: 'website', label: 'Website', icon: () => <ChainIcon className="w-[10px] mr-2" /> },
  { id: 'instagram', label: 'Instagram', icon: () => <InstagramIcon className="w-[12px] mr-1.5" /> },
  { id: 'twitter', label: 'Twitter', icon: () => <TwitterIcon className="w-[12px] mr-2" /> },
  { id: 'discord', label: 'Discord', icon: () => <ChainIcon className="w-[10px] mr-1" /> },
  { id: 'Telegram', label: 'Telegram', icon: () => <ChainIcon className="w-[10px] mr-1" /> }
];

export default function EditCollectionModal(props) {
  const { isOpen, onClose, logo, name, website, instagram, twitter, discord, telegram, description, payoutAddress } = props;
  const {
    handleSubmit, // handles form submission
    handleChange, // handles input changes
    data, // access to the form data
    errors, // includes the errors to show
  } = useForm({
    validations: { // validation rules
      name: {
        required: { value: true, message: 'This field is required.' }
      },
      payoutAddress: {
        required: { value: true, message: 'This field is required.' }
      }
    },
    onSubmit: () => {
    },
    initialValues: { // used to initialize the data
      name,
      website,
      instagram,
      twitter,
      discord,
      telegram,
      description,
      payoutAddress
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} paddingX={0}>
      <div className="px-4">
        <div className="mt-3 flex justify-between items-end">
          <div className="relative">
            <button
              type="button"
              className="w-[74px] h-[74px] border-[1px] border-malibu rounded-full p-[1.5px] overflow-hidden"
              onClick={() => console.log('change image')}
            >
              <span className="sr-only">Change collection image</span>
              <Image className="h-8 w-8" src={logo || DefaultLogo} alt={name} width={"100%"} height={"100%"} />
            </button>
            <div className="bg-[#6589ff] w-[23px] h-[23px] flex items-center justify-center absolute bottom-[8px] right-0 z-10 border-[#2b3441] border-[2px] rounded-full overflow-hidden">
              <CameraIcon className="text-white w-[13px]" />
            </div>
          </div>
          <div>
            <button 
              type="button"
              className="border-[0.5px] inline-block border-manatee py-2 px-4 bg-white[0.05] rounded-lg py-2 px-4 hover:border-cornflower hover:bg-white/[0.15] text-xs font-medium"
              onClick={() => console.log('change cover')}
            >
              Change cover
            </button>
          </div>
        </div>

        <h2 className="mt-5 mb-4 text-xs">Details</h2>
      </div>

      <div className="max-h-[300px] overflow-y-scroll scroller">
        <div className="px-4 pb-4">
          <div className="grid grid-cols-2 gap-y-5 gap-x-5">
            {
              textFields.map(({ id, label, icon, isRequired}) => (
                <div key={id}>
                  <label className="text-xxs text-manatee flex items-center mb-2" htmlFor={id}>
                    { icon && icon() }
                    { label }
                  </label>
                  <InputField
                    type="text"
                    value={data[id] || ''}
                    name={id}
                    required={isRequired}
                    error={errors[id]}
                    onChange={handleChange(id)}
                  />
                </div>
              ))
            }
          </div>

          <div className="w-full mt-3">
            <label className="text-xxs text-manatee mb-2" htmlFor="description">Description</label>
            <TextareaField
              className="mt-1"
              value={data['description'] || ''}
              name="description"
              error={errors['description']}
              height="h-[130px]"
              onChange={handleChange('description')}
            />
          </div>

          <div className="w-full mt-2">
            <label className="text-xxs text-manatee mb-2" htmlFor="payoutAddress">Payout address</label>
            <InputField
              type="text"
              className="mt-1"
              value={data['payoutAddress'] || ''}
              name="payoutAddress"
              error={errors['payoutAddress']}
              onChange={handleChange('payoutAddress')}
            />
          </div>
        </div>
      </div>
      
      <div className="px-4">
        <PrimaryButton
          className="text-xs px-6 min-w-[80px] text-center block ml-auto mt-8"
          size="sm"
          onClick={handleSubmit}
        >
          Save
        </PrimaryButton>
      </div>
    </Modal>
  );
}
