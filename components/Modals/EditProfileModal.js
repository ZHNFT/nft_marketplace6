import { useState } from 'react';
import Image from "next/image";
import DefaultLogo from "../../images/default-collection-logo.png";
import Modal from "./Modal";
import { CameraIcon, ChainIcon, InstagramIcon, TwitterIcon } from "../icons";
import InputField from "../Forms/InputField";
import TextareaField from "../Forms/TextareaField";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useContext } from "react";
import Web3Context from "../../contexts/Web3Context";
import Web3Token from "web3-token";
import AppGlobalContext from "../../contexts/AppGlobalContext";
import { transformUserData, uploadToIpfs } from "../../Utils/helper";
import { Formik } from "formik";
import { PencilIcon } from "@heroicons/react/outline";

const textFields = [
  { id: "username", label: "Username", isRequired: true },
  {
    id: "website",
    label: "Website",
    icon: () => <ChainIcon className="w-[10px] mr-2" />,
  },
  {
    id: "instagram",
    label: "Instagram",
    icon: () => <InstagramIcon className="w-[12px] mr-1.5" />,
  },
  {
    id: "twitter",
    label: "Twitter",
    icon: () => <TwitterIcon className="w-[12px] mr-2" />,
  },
];

export default function EditProfileModal(props) {
  const { isOpen, onClose } = props;
  const { user, setUser } = useContext(AppGlobalContext);
  const {
    state: { ethersProvider },
  } = useContext(Web3Context);
  const [images, setImages] = useState({});
  const [preview, setPreview] = useState({});

  const onSelectImage = event => {
    const name = event.target.name;
    const file = event.target.files[0];
    setPreview({...preview, [name]: URL.createObjectURL(file) });
    setImages({...images, [name]: file })
  };

  async function saveUserDetails(data) {
    const signer = ethersProvider.getSigner();
    const token = await Web3Token.sign(
      async (msg) => await signer.signMessage(msg),
      "1d"
    );
    
    // upload images to ipfs
    const [profileImageUrl, coverImageUrl] = await Promise.all([
      images.profileImage ? uploadToIpfs(images.profileImage) : Promise.resolve(null),
      images.coverImage ? await uploadToIpfs(images.coverImage) : Promise.resolve(null)
    ]);

    const transformedData = {
      username: data["username"],
      description: data["description"],
      socials: [
        {
          name: "twitter",
          href: data["twitter"],
        },
        {
          name: "website",
          href: data["website"],
        },
        {
          name: "instagram",
          href: data["instagram"],
        },
      ],
      images: {
        profile: profileImageUrl || data.images?.profile,
        banner: coverImageUrl || data.images?.banner
      }
    };

    const response = await fetch(`https://hexagon-api.onrender.com/users/me`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(transformedData),
    });

    if (!response.ok) {
      const error = await response?.json();
      console.log("API error message:", error?.message);
    }

    // update the user object with the updated fields
    const updatedUser = await response.json();
    setUser({ ...user, ...updatedUser });

    // close the modal
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} paddingX={0}>
      <Formik
        initialValues={transformUserData(user)}
        onSubmit={saveUserDetails}
      >
        {({ values, errors, handleChange, handleSubmit }) => (
          <form onSubmit={handleSubmit}>
            <div className="px-4">
              <div className="mt-3 flex justify-between items-end">
                <div className="relative">
                  <label className="group block cursor-pointer w-[74px] h-[74px] border-[1px] border-malibu rounded-full p-[1.5px] overflow-hidden">
                    <input type="file" name="profileImage" className="hidden" accept="image/*" onChange={onSelectImage} />
                    <span className="sr-only">Change profile image</span>
                    <Image
                      className="aspect-w-1 object-cover object-center justify-center rounded-full overflow-hidden"
                      src={preview.profileImage || values.images?.profile || DefaultLogo}
                      alt={values["username"]}
                      layout="fill" 
                    />
                    <span className="bg-[#6589ff] w-[23px] h-[23px] flex items-center justify-center absolute bottom-[8px] right-0 z-10 border-[#2b3441] border-[2px] rounded-full overflow-hidden">
                      <CameraIcon className="text-white w-[13px]" />
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-all bg-black/[0.4] rounded-full absolute top-0 left-0 w-full h-full flex justify-center items-center">
                      <PencilIcon className="w-5 h-5" />
                    </div>
                  </label>
                </div>
                <div>
                  <label className="block cursor-pointer border-[0.5px] inline-block border-manatee py-2 px-4 bg-white[0.05] rounded-lg py-2 px-4 hover:border-cornflower hover:bg-white/[0.15] text-xs font-medium">
                    <input type="file" name="coverImage" className="hidden" accept="image/*" onChange={onSelectImage} />
                    Change cover
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-5">
              <div className="px-4">
                <div className="grid grid-cols-2 gap-y-5 gap-x-5">
                  {textFields.map(({ id, label, icon, isRequired }) => (
                    <div key={id}>
                      <label
                        className="text-xxs text-manatee flex items-center mb-2"
                        htmlFor={id}
                      >
                        {icon && icon()}
                        {label}
                      </label>
                      <InputField
                        type="text"
                        value={values[id]}
                        name={id}
                        required={isRequired}
                        error={errors[id]}
                        onChange={handleChange}
                      />
                    </div>
                  ))}
                </div>

                <div className="w-full mt-3">
                  <label
                    className="text-xxs text-manatee mb-2"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <TextareaField
                    className="mt-1"
                    value={values["description"] || ""}
                    name="description"
                    error={errors["description"]}
                    height="h-[130px]"
                    onChange={handleChange("description")}
                  />
                </div>
              </div>
            </div>
            <div className="px-4">
              <PrimaryButton
                className="text-xs px-6 min-w-[85px] text-center block ml-auto mt-4"
                size="sm"
                type="submit"
              >
                Save
              </PrimaryButton>
            </div>
          </form>
        )}
      </Formik>
    </Modal>
  );
}
