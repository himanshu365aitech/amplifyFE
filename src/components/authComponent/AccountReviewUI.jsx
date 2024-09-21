import React from "react";
import HeadingH1 from "../shared/HeadingH1";
import ParagraphBlue2 from "../shared/ParagraphBlue2";
import Button from "../shared/button";
import BackToLogin from "../shared/BackToLogin";
import { FaEnvelopeOpenText } from "react-icons/fa";
import Link from "next/link";

const AccountReviewUI = () => {
  return (
    <div className="py-20">
      <div className="max-w-[800px] mx-auto shadow_primary px-14 lg:px-20 bg-white rounded-xl">
        {/* icon div */}
        <div className="flex justify-center items-center py-5">
          ⁡⁢⁣⁢ {/* 𝗧𝗼𝗱𝗼- 𝗻𝗲𝗲𝗱 𝘁𝗼 𝗰𝗵𝗮𝗻𝗴𝗲 it to search icon */}⁡
          <FaEnvelopeOpenText className="h-20 w-20 " />
        </div>
        {/* text div */}
        <div className="px-3">
          <HeadingH1 children="YOUR ACCOUNT IS UNDER REVIEW" />
          <ParagraphBlue2 children="We will contact you via email once your account has been approved." />
        </div>
        <div className="pt-10 pb-32">
          <Link href={"/login"}>
            <Button
              children="Back to Login"
              variant="primary"
              className="py-2 rounded-2xl w-full font-bold text-xl cursor-pointer"
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountReviewUI;
