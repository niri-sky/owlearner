import cls from '@/shared/libs/cls'
import React from 'react'

const SectionTitle = ({title,desc,txtColor}:SectionTitleTypes) => {
  return (
    <div className=" flex flex-col text-center justify-center items-center  gap-4 lg:max-w-[768px] w-full mx-auto">
    <div>
      <h2 className="xl:text-[48px] lg:text-[40px] md:text-[35px] text-[32px] text-title font-semibold xl:leading-[60px] lg:leading-[55px] md:leading-[50px] leading-[40px] font-playfair capitalize">
      {
        title
      }
      </h2>
    </div>
    <div className="lg:w-[82%] w-full">
      <p className={`md:text-lg text-sm text-txt leading-[26px] ${cls(`text:${txtColor}`)}`}>
      {
        desc
      }
      </p>
    </div>
  </div>
  )
}

export default SectionTitle
