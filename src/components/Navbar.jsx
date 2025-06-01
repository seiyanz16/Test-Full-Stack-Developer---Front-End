import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { isAuthenticated, logout } from "@/lib/auth";
import { Menu } from "lucide-react";

const Navbar = () => {
  const [loggedInUser, setLoggedInUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // get user from localStorage
    if (isAuthenticated()) {
      const user = localStorage.getItem("user");
      if (user) {
        setLoggedInUser(JSON.parse(user));
      }
    }
    // if not logged in, set loggedInUser to null
    else {
      setLoggedInUser(null);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <Link
          to="/dashboard"
          className="text-xl font-bold text-gray-800 hover:text-gray-900"
        >
          My App
        </Link>
        {/* Main navigation (Desktop) */}
        <div className="hidden md:flex items-center space-x-2">
          <Button asChild variant="ghost">
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          {loggedInUser && (
            <>
              <Button asChild variant="ghost">
                <Link to="/users">Users</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link to="/transactions">Transactions</Link>
              </Button>
            </>
          )}
        </div>
      </div>

      {/* Avatar  */}
      <div className="hidden md:block">
        {loggedInUser ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar className="h-9 w-9">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>
                    {loggedInUser.name
                      ? loggedInUser.name.charAt(0).toUpperCase()
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {loggedInUser.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {loggedInUser.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button asChild>
            <Link to="/login">Login</Link>
          </Button>
        )}
      </div>

      {/* Humburger (Mobile Only) */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="mt-4 flex flex-col gap-2 px-3">
              <Button variant="ghost" asChild>
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              {loggedInUser && (
                <>
                  <Button variant="ghost" asChild>
                    <Link to="/users">Users</Link>
                  </Button>
                  <Button variant="ghost" asChild>
                    <Link to="/transactions">Transactions</Link>
                  </Button>
                </>
              )}
              <div className="border-t my-2" />
              {loggedInUser ? (
                <Button onClick={handleLogout}>
                  Logout
                </Button>
              ) : (
                <Button asChild>
                  <Link to="/login">Login</Link>
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
