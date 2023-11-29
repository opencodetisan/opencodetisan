'use client'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { useForm } from "react-hook-form"


export default function SettingsCard() {
  const {
    register,
    handleSubmit
  } = useForm({})

  const onSubmit = async (formData: any) => {
    try {
      formData.port = parseInt(formData.port, 10);
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        console.log('Nice!!!!!!!!!!');
      }
    } catch (error) {
      alert('Errorrrrr');
    }
  };

  return (
    <div className="h-screen w-full flex flex-col lg:flex-row">
      <nav className="w-full lg:w-64 bg-black text-white p-5">
        <ul className="space-y-2">
          <li>
            <Link className="flex items-center gap-3 py-2 mt-4" href="#">
              <IconSettings className="h-5 w-5" />
              <span>SMTP Setting</span>
            </Link>
          </li>
        </ul>
      </nav>
      <Card className="w-screen ">
        <CardHeader>
          <CardTitle>SMTP Setting</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="host" className=" ml-10 mr-10">Host</Label>
              <input className="p-2 ml-2 border border-black rounded w " type="text" placeholder="smtp.gmail.com" {...register("host", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="port" className="ml-10 mr-11">Port</Label>
              <input className="p-2 ml-2 border border-black rounded" type="text" placeholder="587" {...register("port", { required: true })} />
            </div>
            <div className="space-y-2 flex items-center">
              <Label htmlFor="secure" className="ml-10 mr-6">Secure</Label>
              <input className="p-2 ml-2 border border-black rounded" type="text" placeholder="True" {...register("secure", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="ml-9 mr-2">Username</Label>
              <input className="p-2 ml-2 border border-black rounded" type="email" placeholder="Email Address" {...register("username", { required: true })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="ml-9 mr-3">Password</Label>
              <input className="p-2 ml-2 border border-black rounded" type="password" placeholder="Password" {...register("password", { required: true })} />
            </div>
          </div>
          <Button className="w-right ml-10 mt-10" type="submit">
            Create User
          </Button>
        </form>
      </Card>
    </div>
  )
}

function IconSettings(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}


