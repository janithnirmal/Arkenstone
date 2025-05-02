import { cn } from "@/lib/utils";

export default function NotFoundIcon({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" id="document" width="64" height="64" x="0" y="0" version="1.1" viewBox="0 0 64 64" className={cn('fill-muted', className)}>
          <path d="M8 64h48V0H22.586L8 14.586V64zm46-2H10V16h14V2h30v60zM11.414 14L22 3.414V14H11.414z"></path>
          <path d="M22 36a9.936 9.936 0 0 0 2.927 7.071A9.932 9.932 0 0 0 31.998 46H32c5.514 0 10-4.486 10-10a9.934 9.934 0 0 0-2.928-7.072A9.936 9.936 0 0 0 31.998 26c-2.671 0-5.182 1.04-7.07 2.929S22 33.329 22 36zm9.998 8a7.944 7.944 0 0 1-5.656-2.343A7.947 7.947 0 0 1 24 36c0-1.8.596-3.505 1.685-4.902l11.212 11.214A7.954 7.954 0 0 1 31.998 44zm.003-16a7.95 7.95 0 0 1 5.657 2.342A7.947 7.947 0 0 1 40 36a7.949 7.949 0 0 1-1.689 4.897L27.099 29.684A7.932 7.932 0 0 1 32.001 28z"></path>
        </svg>
    );
}
