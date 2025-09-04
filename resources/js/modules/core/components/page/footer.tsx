import Button from '@/components/custom/button';
import { Input } from '@/components/ui/input';
import Config from '@/core/config';
import { Link } from '@inertiajs/react';
import { Facebook, Instagram, Linkedin } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-secondary flex flex-col items-center justify-center py-5 pt-15">
            <div className="container flex flex-col gap-4 lg:px-5">
                <div className="flex w-full flex-col gap-8 lg:flex-row">
                    <div className="flex w-full flex-col gap-2 text-center lg:w-1/3 lg:text-left">
                        <h3 className="text-5xl font-bold">{Config.appName}</h3>
                        <p className="text-sm">{Config.appSlogan}</p>
                    </div>
                    <div className="flex w-full flex-col items-center gap-2 px-6 text-center lg:w-1/3 lg:items-start lg:text-left">
                        <h4 className="text-lg">Get News And Updates</h4>
                        <div className="flex w-full flex-col items-center gap-2 lg:flex-row">
                            <Input type="email" placeholder="Enter your email to get the latest news and updates" />
                            <Button className="w-max">Subscribe</Button>
                        </div>
                    </div>
                    <div className="flex w-full items-end justify-center gap-3 lg:w-1/3 lg:justify-end">
                        <a href={Config.contact.facebook} target="_blank" rel="noopener noreferrer">
                            <Facebook className="text-primary hover:text-primary/70 h-8 w-8" />
                        </a>
                        <a href={Config.contact.instagram} target="_blank" rel="noopener noreferrer">
                            <Instagram className="text-primary hover:text-primary/70 h-8 w-8" />
                        </a>
                        <a href={Config.contact.tiktok} target="_blank" rel="noopener noreferrer">
                            <svg
                                className="text-primary fill-primary hover:fill-primary/70 h-8 w-8"
                                width="800px"
                                height="800px"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z" />
                            </svg>
                        </a>
                        <a href={Config.contact.linkedin} target="_blank" rel="noopener noreferrer">
                            <Linkedin className="text-primary hover:text-primary/70 h-8 w-8" />
                        </a>
                    </div>
                </div>
                <hr className="my-4 w-full" />
                <div className="flex flex-col gap-8 lg:flex-row">
                    <div className="flex w-full flex-col items-center px-6 text-center lg:w-1/3 lg:items-start lg:px-0 lg:text-left">
                        <h3 className="text-2xl font-bold">Why People Like us!</h3>
                        <p className="mt-2 w-full text-sm lg:w-2/3">
                            At Blanks Clothing, we’re committed to quality, comfort, and style. Trusted by our customers for both fit and feel, we
                            make essentials that fit into your everyday life effortlessly.
                        </p>
                        <Button variant="outline" className="mt-4 w-max px-6">
                            Read More
                        </Button>
                    </div>
                    <div className="flex w-full flex-col items-center justify-between gap-4 text-center lg:w-1/3 lg:flex-row lg:items-start lg:text-left">
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold">Explore</h1>
                            <ul>
                                <li>
                                    <Link href="/">Home</Link>
                                </li>
                                <li>
                                    <Link href="/">Shop</Link>
                                </li>
                                <li>
                                    <Link href="/">About</Link>
                                </li>
                                <li>
                                    <Link href="/">Contact</Link>
                                </li>
                            </ul>
                        </div>
                        <div className="flex flex-col gap-2">
                            <h1 className="text-2xl font-bold">Read More</h1>
                            <ul>
                                <li>
                                    <Link href="/privacy-policy">Privacy Policy</Link>
                                </li>
                                <li>
                                    <Link href="/return-policy">Return Policy</Link>
                                </li>
                                <li>
                                    <Link href="/terms-and-conditions">Terms and Conditions</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="flex w-full flex-col items-center text-center lg:w-1/3 lg:items-end lg:text-left">
                        <h3 className="text-2xl font-bold">Contact Us</h3>
                        <p className="text-sm">{Config.contact.address}</p>
                        <p className="text-sm">{Config.contact.phone}</p>
                        <p className="text-sm">{Config.contact.email}</p>
                    </div>
                </div>
                <hr className="my-4 w-full" />
                <div className="flex w-full flex-col items-center justify-center gap-2 md:flex-row lg:items-end">
                    <p className="flex-1 text-xs">
                        {Config.appName} {new Date().getFullYear()} &copy; All rights reserved
                    </p>
                    <p className="flex-1 text-end">
                        Designed by{' '}
                        <Link className="text-primary" href={Config.appAuthorUrl}>
                            {Config.appAuthor}
                        </Link>
                    </p>
                </div>
            </div>
        </footer>
    );
}
