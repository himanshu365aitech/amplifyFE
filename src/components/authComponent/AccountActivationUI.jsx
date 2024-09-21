import React from 'react'
import HeadingH1 from '../shared/HeadingH1'
import ParagraphBlue2 from '../shared/ParagraphBlue2'
import Button from '../shared/button'
import BackToLogin from '../shared/BackToLogin'
import { FaEnvelopeOpenText } from 'react-icons/fa'

const AccountActivationUI = () => {
  return (
    <div className="py-20">
       <div className="max-w-[800px] mx-auto shadow_primary px-10 lg:px-20 bg-white rounded-xl">
         {/* icon div */}
         <div className="flex justify-center items-center py-5">
           ⁡⁢⁣⁢ {/* 𝗧𝗼𝗱𝗼- 𝗻𝗲𝗲𝗱 𝘁𝗼 𝗰𝗵𝗮𝗻𝗴𝗲 it */}⁡
           <FaEnvelopeOpenText className="h-20 w-20 " />
         </div>
         {/* text div */}
         <div className="px-3">
           <HeadingH1 children="Account Activation" />
           <ParagraphBlue2 children="Thank you for signing up. A verification link has been sent to" />
           <p className="text-custom-gray-3  text-lg text-center">
             JohnnSilvie02@gmail.com
           </p>
           <ParagraphBlue2 children="Please click the link in the email to verify your account. " />
         </div>
         <div className="pt-10 ">
           <Button
             children="Resend Email"
             variant="primary"
             className="py-2 rounded-2xl w-full font-bold text-xl"
           />
         </div>
         <div className="pt-14 pb-20">
           <BackToLogin />
         </div>
       </div>
     </div>
  )
}

export default AccountActivationUI