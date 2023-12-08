'use client'
import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { IoSettingsSharp } from "react-icons/io5"

export default function SettingsCard() {
  const {
    register,
    handleSubmit,
    setValue,
  } = useForm({})

  const onSubmit = async (formData: any) => {
    try {
      formData.port = parseInt(formData.port, 10)
      formData.secure = parseBoolean(formData.secure)
      const response = await fetch('/api/settings/smtp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      if (response.ok) {
        toast({
          title: 'Success!',
          description: 'Done saving the details',
        })
      }
    } catch (error) {
      toast({
        title: 'Oops!',
        description: 'Error in saving the details',
      })
    }
  }
  const parseBoolean = (value: string) => {
    if (value === 'true') {
      return true
    } else if (value === 'false') {
      return false
    }
    return null
  }

  useEffect(() => {
    const fetchSMTPDetails = async () => {
      try {
        const response = await fetch('/api/settings/smtp')
        if (response.ok) {
          const data = await response.json()
          Object.keys(data).forEach((key) => {
            setValue(key, data[key])
          })
        } else {
          throw new Error('Failed to fetch SMTP details')
        }
      } catch (error) {
        console.error('Error fetching SMTP details:', error)
      }
    }
    fetchSMTPDetails()
  }, [setValue])

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      <nav className="w-full lg:w-64 text-black p-5">
        <Link className="flex items-center gap-3 py-2 mt-2 ml-10 mr-auto  w-64" href="#">
          <IoSettingsSharp size={32} />
          <span className="flex items-center">
            <span>SMTP</span>
            <span className="ml-1">Setting</span>
          </span>
        </Link>
      </nav>
      <div className="flex flex-col flex-grow">
        <h1 className="text-2xl font-bold mb-4 mt-8  ml-12 lg:ml-0">SMTP Setting</h1>
        <Card className="w-screen h-screen">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4 mt-8">
              <div className="space-y-2">
                <Label htmlFor="from" className=" text-md font-medium ml-9 mr-11">From</Label>
                <input className="p-2 ml-2 border border-black rounded" type="email" placeholder="Sender's Email Address" {...register("from", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="host" className=" text-md font-medium ml-9 mr-11 pr-1">Host</Label>
                <input className="p-2 ml-2 border border-black rounded w " type="text" placeholder="smtp.gmail.com" {...register("host", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="port" className="text-md font-medium ml-9 mr-12 pr-1">Port</Label>
                <input className="p-2 ml-2 border border-black rounded" type="text" placeholder="587" {...register("port", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="secure" className="text-md font-medium ml-9 mr-8">Secure</Label>
                <select className="p-2 ml-2 border border-black rounded" {...register("secure", { required: true })} style={{ width: '235px' }} >
                  <option value="true">true</option>
                  <option value="false">false</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="username" className="text-md font-medium ml-9 mr-2">Username</Label>
                <input className="p-2 ml-2 border border-black rounded" type="email" placeholder="Email Address" {...register("username", { required: true })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-md font-medium ml-9 mr-3">Password</Label>
                <input className="p-2 ml-2 border border-black rounded" type="password" placeholder="Password" {...register("password", { required: true })} />
              </div>
            </div>
            <Button className="w-right ml-10 mt-10 mb-4" type="submit">
              Submit
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}