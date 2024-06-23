import Logo from "@/assets/svgs/logo";
import RipenBranding from "@/assets/svgs/ripen";
import { InputForm } from "@/components/initial/form";


export default function Home() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[#DCDCDC]">
      <div className="w-8/12  max-md:w-11/12 h-5/6 flex items-center justify-between rounded-3xl bg-white p-2 overflow-clip">
        <div className=" w-2/6  max-lg:hidden h-full flex flex-col justify-between rounded-2xl bg-[#FAFAFA] p-5">
          <RipenBranding />
          <img className="w-full h-full" src="/illustration.svg" alt="" />
        </div>
        <div className="w-4/6 max-lg:w-full h-full flex flex-col font-Manrope text-black gap-4 py-8 xl:px-36  px-16 max-lg:px-5 ">
          <div className="">

            <Logo />
          </div>

          <div className="w-full flex flex-col">
            <h1 className=" text-2xl font-bold tracking-tighter ">How do we get in touch?</h1>
            <p className="text-sm font-semibold text-gray-400 tracking-tight">Leave us your details and we'll reach out within 24 hours!</p>
          </div>

          <InputForm />

        </div>
      </div>
    </div>
  );
}
