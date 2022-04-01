import Image from "next/image";
import DefaultLogo from "../../images/default-collection-logo-2.png";
import Modal from "./Modal";
import { CameraIcon, ChainIcon, InstagramIcon, TwitterIcon } from "../icons";
import InputField from "../Forms/InputField";
import TextareaField from "../Forms/TextareaField";
import PrimaryButton from "../Buttons/PrimaryButton";
import { useContext, useEffect } from "react";
import Web3Context from "../../contexts/Web3Context";
import Web3Token from "web3-token";
import AppGlobalContext from "../../contexts/AppGlobalContext";
import { transformUserData } from "../../Utils/helper";
import { Formik } from "formik";

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
  const { user } = useContext(AppGlobalContext);
  const {
    state: { ethersProvider },
  } = useContext(Web3Context);

  async function saveUserDetails(data) {
    const signer = ethersProvider.getSigner();
    const token = await Web3Token.sign(
      async (msg) => await signer.signMessage(msg),
      "1d"
    );

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
      imageUrl: "",
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
                  <button
                    type="button"
                    className="w-[74px] h-[74px] border-[1px] border-malibu rounded-full p-[1.5px] overflow-hidden"
                    onClick={() => console.log("change image")}
                  >
                    <span className="sr-only">Change profile image</span>
                    <Image
                      className="h-8 w-8"
                      src={values["imageUrl"] || DefaultLogo}
                      alt={values["username"]}
                      width={"100%"}
                      height={"100%"}
                    />
                    <span className="bg-[#6589ff] w-[23px] h-[23px] flex items-center justify-center absolute bottom-[8px] right-0 z-10 border-[#2b3441] border-[2px] rounded-full overflow-hidden">
                      <CameraIcon className="text-white w-[13px]" />
                    </span>
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    className="border-[0.5px] inline-block border-manatee py-2 px-4 bg-white[0.05] rounded-lg py-2 px-4 hover:border-cornflower hover:bg-white/[0.15] text-xs font-medium"
                    onClick={() => console.log("change cover")}
                  >
                    Change cover
                  </button>
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
