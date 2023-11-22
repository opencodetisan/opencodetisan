import Link from "next/link"
import { Button } from '@/components/ui/button'


export default function homePage() {
    return (
        <main style={{
            background: 'radial-gradient(ellipse closest-side at center, var(--tw-gradient-stops))',
            backgroundSize: '100% 100%', // Adjust this value for the size of the ellipse
            backgroundPosition: 'center',
        }} className="flex flex-col w-full h-screen items-center justify-center from-green-900 to-gray-900">
            <ul className="text-center p-5 space-y-8">
                <li>
                    <h1 className="text-3xl text-center text-slate-50 font-bold sm:text-6xl bg-clip-text">
                        OpenCODETISAN:
                    </h1>
                    <h1 className="py-4 tracking-tight text-3xl text-center text-slate-50 font-semibold sm:text-6xl bg-clip-text">
                        <span className='py-8 text-[#00CE27]'>Verify Skills.</span> No Guesses.
                    </h1>
                </li>
                <li>
                    <p className="mt-5 max-w-[600px] text-slate-200 md:text-xl mx-auto">An open-source assessment software built for precision.</p>
                    <p className="mb-6 max-w-[600px] text-slate-200 md:text-xl mx-auto">Strip away the guessswork. Verify real skills.</p>
                </li>
                <li>
                    <Button className="bg-white rounded-full text-green-400"><Link href="/signin"><p className="">Get Started</p></Link></Button>
                </li>
            </ul>
        </main>
    )
}