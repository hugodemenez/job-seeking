'use client'
import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Bell, LogOut, Settings, Settings2, User } from "lucide-react";
import { Input } from "./ui/input";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";

export default function Navbar() {
  return (
    <div className="border-b border-gray-200 flex justify-between items-center p-4 w-full px-24 bg-custom-light-gray">
        <Link href="/">
          <Image src="/logo.svg" alt="logo" width={128} height={64} />
        </Link>
        <div className="flex gap-2 items-center">
          <div className="relative mr-2">
            <Input
              type="search"
              placeholder="Search..."
              className="w-[200px] pl-8"
            />
            <svg
              className="absolute left-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost">
                <Bell className="w-4 h-4" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <h4 className="font-medium leading-none">Notifications</h4>
                  <p className="text-sm text-muted-foreground">
                    Your recent notifications will appear here.
                  </p>
                </div>
                {/* Add notification content here */}
              </div>
            </PopoverContent>
          </Popover>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar>
                <AvatarImage src="https://media.licdn.com/dms/image/v2/D5603AQFbl8UNOyiYag/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1676993076269?e=1732752000&v=beta&t=orVkcJUjtlCx_p3Up3eOqNog1g2PBTuMOPCmZ6TF6x0" />
                <AvatarFallback>HD</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <Link href='/'>
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
              </Link>
            </DropdownMenuContent>
          </DropdownMenu>
      </div>
    </div>
  );
}
