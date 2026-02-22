"use client";

import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  Link,
  Button
} from "@heroui/react";

export const Navigation = () => {
  return (
    <Navbar className="bg-background/80 backdrop-blur-md border-b border-secondary-100" maxWidth="xl" isBordered>
      <NavbarBrand>
        <span className="material-symbols-outlined mr-2">home_work</span>
        <p className="font-bold text-foreground text-xl">GarantEasy</p>
      </NavbarBrand>
      <NavbarContent className="hidden sm:flex gap-6" justify="center">
        <NavbarItem>
          <Link color="foreground" href="/garant/liste">
            Nos Garants
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color="foreground" href="/dashboard">
            Dashboard
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify="end">
        <NavbarItem>
          <Button as={Link} className="btn-shiny bg-white text-primary font-bold" href="/checkout" variant="flat">
            Commencer
          </Button>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
};
