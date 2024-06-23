"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { useEffect, useState } from "react"
import { Uploader } from '../uploader'

const FormSchema = z.object({
  firstname: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastname: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  image: z.array(z.instanceof(File)).nonempty({
    message: "Please upload a file",
  }),
  age: z.coerce.number().min(18, {
    message: "min age is 18",
  }),
  gender: z.enum(["Male", "Female"], {
    required_error: "You need to select a gender.",
  }),
  companySize: z.string().min(1, {
    message: "Please select a company size.",
  }),
})

export function InputForm() {
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [fade, setFade] = useState('');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      image: [],
      firstname: "",
      lastname: "",
      email: "",
      age: 0,
      gender: "Male",
      companySize: ""
    },
  });

  useEffect(() => {
    form.watch("image").length > 0 && form.clearErrors("image");
    form.watch("firstname").length > 0 && form.clearErrors("firstname");
    form.watch("lastname").length > 0 && form.clearErrors("lastname");
    form.watch("email").length > 0 && form.clearErrors("email");
    form.watch("age") > 0 && form.clearErrors("age");
    form.watch("companySize").length > 0 && form.clearErrors("companySize");
  }, [form.watch("image").length, form.watch("firstname").length, form.watch("lastname").length, form.watch("email").length, form.watch("age"), form.watch("companySize").length]);

  const handleNext = async () => {
    const isValid = await form.trigger(["firstname", "lastname", "email", "image"]);
    if (isValid) {
      setFade('fade-out');
      setTimeout(() => {
        setCurrentSection(2);
        setFade('fade-in');
      }, 300);
    }
  };

  const handleBack = () => {
    setFade('fade-out');
    setTimeout(() => {
      setCurrentSection(1);
      setFade('fade-in');
    }, 300);
  };



  function onSubmit(data: z.infer<typeof FormSchema>) {
    console.log(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div

          className={`form-section w-full flex flex-col space-y-6 ${currentSection === 1 ? fade : 'hidden'}`}>
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem className="flex flex-col -space-y-5">
                <FormControl>
                  <Uploader
                    aria-required
                    value={field.value}
                    onValueChange={field.onChange}
                    maxFiles={1}
                    maxSize={5 * 1024 * 1024}
                  />
                </FormControl>
                <FormMessage className="m-0" />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-between gap-4">
            <FormField 
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-semibold">First name<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input className="form-input" placeholder="First name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField 
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem className="flex-1">
                  <FormLabel className="font-semibold">Last name<span className="text-red-500">*</span></FormLabel>
                  <FormControl>
                    <Input className="form-input" placeholder="Last name" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Email<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input className="form-input" placeholder="Email" {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button className=' self-end' onClick={handleNext} type="button">Next {`->`}</Button>
        </div>
        <div 

          className={`form-section space-y-6 ${currentSection === 2 ? fade : 'hidden'}`}>
          <FormField
            control={form.control}
            name="age"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Age<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <Input type='number' className="form-input" placeholder="Age" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Gender<span className="text-red-500">*</span></FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex items-center gap-4"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Male" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="Female" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companySize"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Company Size<span className="text-red-500">*</span></FormLabel>
                <FormControl className='w-full flex flex-col p-2' aria-required>
                  <select value={field.value} onChange={(e) => field.onChange(e.target.value)} className="form-input">
                    <option value="">Select Company Size</option>
                    <option value="1">1</option>
                    <option value="2-10">2-10</option>
                    <option value="11-100">11-100</option>
                    <option value="100+">100+</option>
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="w-full flex items-center justify-between">
            <Button  onClick={handleBack} type="button"> {`<-`} Back</Button>
            <Button type="submit">Submit</Button>
          </div>
        </div>
      </form>
    </Form>
  )
}
