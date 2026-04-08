"use client";

import { Bell, Menu, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type HeaderProps = {
  onMenuClick: () => void;
};

export function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="bg-white border-b border-border px-6 py-3.5 flex items-center gap-4 flex-shrink-0">
      {/* Mobile menu */}
      <button
        onClick={onMenuClick}
        className="lg:hidden text-muted-foreground hover:text-foreground transition-colors"
      >
        <Menu className="w-5 h-5" />
      </button>

      {/* Current account — left side */}
      <div className="hidden lg:flex items-center gap-2.5 px-1 py-1">
        <img src="/kfcau.webp" alt="KFC Australia" className="w-8 h-8 rounded-lg object-contain flex-shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-semibold text-foreground leading-tight truncate">KFC Australia Pty Ltd</p>
          <p className="text-xs text-muted-foreground leading-tight">ABN 51 004 220 518</p>
        </div>
      </div>

      <div className="flex-1" />

      {/* Right side */}
      <div className="flex items-center gap-2">
        {/* Pending approvals callout */}
        <Button
          variant="outline"
          size="sm"
          className="hidden sm:flex items-center gap-2 rounded-xl h-9 text-sm border-amber-200 bg-amber-50 text-amber-900 hover:bg-amber-100 hover:text-amber-950 hover:border-amber-300"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          3 pending approvals
        </Button>

        {/* Notifications */}
        <div className="relative">
          <Button variant="ghost" size="icon" className="rounded-xl h-9 w-9 text-muted-foreground">
            <Bell className="w-4 h-4" />
          </Button>
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-primary border-2 border-white" />
        </div>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-xl hover:bg-muted/60 transition-colors outline-none">
              <Avatar className="w-7 h-7">
                <AvatarFallback className="bg-primary text-white text-xs font-bold">
                  JS
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-semibold text-foreground leading-tight">Jane Smith</p>
                <p className="text-xs text-muted-foreground leading-tight">Trustee</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                <p className="font-semibold text-foreground">Jane Smith</p>
                <p className="text-xs text-muted-foreground">jane@kfc.com.au</p>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Account Settings</DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">Sign Out</DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
