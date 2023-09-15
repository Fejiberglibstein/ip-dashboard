import React, { ForwardedRef, HTMLAttributes, PropsWithRef, forwardRef } from "react"

export const StatusCriticalIcon = (props: HTMLAttributes<HTMLOrSVGElement>): React.JSX.Element =>
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="23" height="25" viewBox="0 0 23 25" fill="none">
    <g clipPath="url(#clip0_58_103)">
      <path d="M15.8059 3.98744C17.3142 4.8583 18.5688 6.10797 19.4457 7.61275C20.3226 9.11752 20.7913 10.8252 20.8053 12.5668C20.8194 14.3084 20.3784 16.0234 19.5259 17.5421C18.6735 19.0609 17.4392 20.3307 15.9452 21.2258C14.4511 22.1209 12.7493 22.6103 11.008 22.6455C9.26674 22.6807 7.54646 22.2606 6.01746 21.4267C4.48847 20.5928 3.20378 19.374 2.29057 17.891C1.37737 16.408 0.867318 14.7122 0.810908 12.9714L0.805908 12.6474L0.810908 12.3234C0.866911 10.5964 1.36946 8.91341 2.26955 7.43844C3.16964 5.96347 4.43656 4.7469 5.9468 3.90733C7.45704 3.06776 9.15905 2.63384 10.8869 2.64788C12.6148 2.66192 14.3095 3.12344 15.8059 3.98744ZM9.31691 9.78745C9.10739 9.66272 8.85952 9.61885 8.61992 9.66408C8.38032 9.7093 8.1655 9.84051 8.01586 10.033C7.86622 10.2255 7.79207 10.4661 7.80737 10.7094C7.82266 10.9528 7.92634 11.1822 8.09891 11.3544L9.39091 12.6474L8.09891 13.9404L8.01591 14.0344C7.8605 14.2354 7.78742 14.488 7.81151 14.741C7.8356 14.9939 7.95506 15.2282 8.14563 15.3962C8.3362 15.5642 8.58357 15.6534 8.83752 15.6457C9.09147 15.6379 9.33295 15.5338 9.51291 15.3544L10.8059 14.0624L12.0989 15.3544L12.1929 15.4374C12.3939 15.5929 12.6465 15.6659 12.8994 15.6418C13.1524 15.6178 13.3866 15.4983 13.5547 15.3077C13.7227 15.1172 13.8119 14.8698 13.8041 14.6158C13.7964 14.3619 13.6923 14.1204 13.5129 13.9404L12.2209 12.6474L13.5129 11.3544L13.5959 11.2604C13.7513 11.0595 13.8244 10.8068 13.8003 10.5539C13.7762 10.301 13.6568 10.0667 13.4662 9.89869C13.2756 9.73066 13.0282 9.64146 12.7743 9.64922C12.5203 9.65697 12.2789 9.7611 12.0989 9.94045L10.8059 11.2324L9.51291 9.94045L9.41891 9.85745L9.31691 9.78745Z" fill="#E65050"/>
    </g>
    <defs>
      <clipPath id="clip0_58_103">
        <rect width="24" height="24" fill="white" transform="translate(-1.19409 0.647446)"/>
      </clipPath>
    </defs>
  </svg>


export const StatusOnlineIcon = (props: HTMLAttributes<HTMLOrSVGElement>): React.JSX.Element => 
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="23" height="25" viewBox="0 0 23 25" fill="none">
    <g clipPath="url(#clip0_58_259)">
      <path d="M15.8059 3.39032C17.3142 4.26118 18.5688 5.51085 19.4457 7.01562C20.3226 8.5204 20.7913 10.2281 20.8053 11.9697C20.8194 13.7112 20.3784 15.4263 19.5259 16.945C18.6735 18.4638 17.4392 19.7335 15.9452 20.6286C14.4511 21.5237 12.7493 22.0131 11.008 22.0484C9.26674 22.0836 7.54646 21.6635 6.01746 20.8296C4.48847 19.9956 3.20378 18.7768 2.29057 17.2938C1.37737 15.8108 0.867318 14.115 0.810908 12.3743L0.805908 12.0503L0.810908 11.7263C0.866911 9.99931 1.36946 8.31628 2.26955 6.84132C3.16964 5.36635 4.43656 4.14977 5.9468 3.31021C7.45704 2.47064 9.15905 2.03672 10.8869 2.05076C12.6148 2.0648 14.3095 2.52632 15.8059 3.39032ZM14.5129 9.34332C14.3407 9.17115 14.1116 9.06772 13.8686 9.05243C13.6256 9.03715 13.3853 9.11107 13.1929 9.26032L13.0989 9.34332L9.80591 12.6353L8.51291 11.3433L8.41891 11.2603C8.22649 11.1112 7.98628 11.0373 7.74331 11.0527C7.50035 11.068 7.27132 11.1714 7.09917 11.3436C6.92703 11.5157 6.82359 11.7448 6.80826 11.9877C6.79293 12.2307 6.86676 12.4709 7.01591 12.6633L7.09891 12.7573L9.09891 14.7573L9.19291 14.8403C9.36828 14.9764 9.58394 15.0502 9.80591 15.0502C10.0279 15.0502 10.2435 14.9764 10.4189 14.8403L10.5129 14.7573L14.5129 10.7573L14.5959 10.6633C14.7452 10.4709 14.8191 10.2307 14.8038 9.98764C14.7885 9.74462 14.6851 9.51552 14.5129 9.34332Z" fill="#0FA958"/>
    </g>
    <defs>
      <clipPath id="clip0_58_259">
        <rect width="24" height="24" fill="white" transform="translate(-1.19409 0.0503235)"/>
      </clipPath>
    </defs>
  </svg>

export const StatusOfflineIcon = (props: HTMLAttributes<HTMLOrSVGElement>): React.JSX.Element => 
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="23" height="25" viewBox="0 0 23 25" fill="none">
    <g clipPath="url(#clip0_58_108)">
      <path d="M10.8059 2.34889C16.3289 2.34889 20.8059 6.82589 20.8059 12.3489C20.808 14.9744 19.7775 17.4953 17.9368 19.3675C16.0962 21.2397 13.5931 22.313 10.9679 22.3555C8.3428 22.398 5.80625 21.4065 3.90591 19.5949C2.00557 17.7833 0.893897 15.2971 0.810908 12.6729L0.805908 12.3489L0.809908 12.0689C0.957908 6.67589 5.37591 2.34889 10.8059 2.34889ZM10.8159 15.3489L10.6889 15.3559C10.4459 15.3848 10.2219 15.5018 10.0593 15.6849C9.89679 15.8679 9.80702 16.1041 9.80702 16.3489C9.80702 16.5937 9.89679 16.8299 10.0593 17.0129C10.2219 17.1959 10.4459 17.313 10.6889 17.3419L10.8059 17.3489L10.9329 17.3419C11.176 17.313 11.4 17.1959 11.5625 17.0129C11.725 16.8299 11.8148 16.5937 11.8148 16.3489C11.8148 16.1041 11.725 15.8679 11.5625 15.6849C11.4 15.5018 11.176 15.3848 10.9329 15.3559L10.8159 15.3489ZM10.8059 7.34889C10.561 7.34892 10.3246 7.43885 10.1415 7.60161C9.9585 7.76437 9.84157 7.98864 9.81291 8.23189L9.80591 8.34889V12.3489L9.81291 12.4659C9.84182 12.7089 9.95886 12.9329 10.1419 13.0955C10.3249 13.258 10.5611 13.3478 10.8059 13.3478C11.0507 13.3478 11.2869 13.258 11.4699 13.0955C11.653 12.9329 11.77 12.7089 11.7989 12.4659L11.8059 12.3489V8.34889L11.7989 8.23189C11.7703 7.98864 11.6533 7.76437 11.4703 7.60161C11.2872 7.43885 11.0508 7.34892 10.8059 7.34889Z" fill="#FFC737"/>
    </g>
    <defs>
      <clipPath id="clip0_58_108">
        <rect width="24" height="24" fill="white" transform="translate(-1.19409 0.348892)"/>
      </clipPath>
    </defs>
  </svg>

export const CriticalIcon = (props: HTMLAttributes<HTMLOrSVGElement>): React.JSX.Element => 
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="#f24e1e" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01"/></svg>


export const PingIcon = (props: HTMLAttributes<HTMLOrSVGElement>): React.JSX.Element =>
<svg {...props} xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
  <path d="M5.40744 10.9359C6.09507 10.2483 7.02768 9.86204 8.00011 9.86204C8.97254 9.86204 9.90515 10.2483 10.5928 10.9359M8.00011 13.3333H8.00678M3.28678 8.61926C5.88944 6.01592 10.1108 6.01592 12.7141 8.61926M0.929443 6.26192C4.83411 2.35726 11.1661 2.35726 15.0714 6.26192" stroke="#A4A4A4" strokeWidth="1.43351" strokeLinecap="round" strokeLinejoin="round"/>
</svg>


export const CriticalStickyIcon = (props: HTMLAttributes<HTMLOrSVGElement>) => 
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"><path fill="none" stroke="#e55050" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01"/></svg>

export const OptionsIcon = (props: HTMLAttributes<HTMLOrSVGElement>) =>
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><g id="feElipsisV0" fill="none" fillRule="evenodd" stroke="none" strokeWidth="1"><g id="feElipsisV1" fill="currentColor"><path id="feElipsisV2" d="M12 20a2 2 0 1 1 0-4a2 2 0 0 1 0 4Zm0-6a2 2 0 1 1 0-4a2 2 0 0 1 0 4Zm0-6a2 2 0 1 1 0-4a2 2 0 0 1 0 4Z"/></g></g></svg>

export const CloseIcon = (props: HTMLAttributes<HTMLOrSVGElement>) =>
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 6L6 18M6 6l12 12"/></svg>

export const RemoveIcon = (props: HTMLAttributes<HTMLOrSVGElement>) =>
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#d33838" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7h16m-10 4v6m4-6v6M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2l1-12M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></svg>


export const ChangeIcon = (props: HTMLAttributes<HTMLOrSVGElement>) =>
<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"><path fill="none" stroke="#d3a134" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 20h4L18.5 9.5a2.828 2.828 0 1 0-4-4L4 16v4m9.5-13.5l4 4"/></svg>

export const AddIcon = (props: HTMLAttributes<HTMLOrSVGElement>) =>
<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 8H5m0 4h9m-3 4H5m10 0h6m-3-3v6"/></svg>