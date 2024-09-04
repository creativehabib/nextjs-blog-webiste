"use client";
import React, { useState } from "react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem,
    DropdownMenuLabel, DropdownMenuPortal,
    DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
    Cloud,
    CreditCard,
    Keyboard, LifeBuoy, LogOut,
    Mail,
    MessageSquare,
    Plus,
    PlusCircle,
    Settings,
    User,
    UserPlus,
    Users
} from "lucide-react";
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {signOut, useSession} from "next-auth/react";
import { CustomUser } from "@/app/api/auth/[...nextauth]/authOptions";
import {LOGOUT_URL, UPDATE_PROFILE} from "@/lib/apiEndPoints";
import myAxios from "@/lib/axios.config";
import {toast} from "react-toastify";

export default function ProfileMenu({ user }: { user: CustomUser }) {
    const [logoutOpen, setLogOutOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [errors, setErrors] = useState({
        profile_image: [],
    });
    const { update } = useSession();
    const [loading, setLoading] = useState(false);
    const logoutUser = async () => {
        myAxios
            .post(
                LOGOUT_URL,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            )
            .then((res) => {
                signOut({
                    callbackUrl: "/login",
                    redirect: true,
                });
                toast.success(res.data?.message);
            })
            .catch((err) => {
                toast.error(err.data?.message);
            });
    };

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setImage(file);
        }
    };

    const updateProfile = (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        const formData = new FormData();
        formData.append("profile_image", image ?? "");
        myAxios
            .post(UPDATE_PROFILE, formData, {
                headers: {
                    Authorization: "Bearer " + user.token,
                },
            })
            .then((res) => {
                setLoading(false);
                update({ profile_image: res.data.image });
                toast.success("Profile image updated successfully!");
                setProfileOpen(false);
            })
            .catch((err) => {
                setLoading(false);
                if (err.response?.status == 422) {
                    setErrors(err.response?.data?.errors);
                } else {
                    toast.error("Something went wrong.please try again!");
                }
            });
    };
    return (
        <div>
            {/* Logout dialog */}
            <Dialog open={logoutOpen} onOpenChange={setLogOutOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription>
                            This action expire your session and you have to login back to
                            access your dashboard.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end space-x-4">
                        <Button variant="destructive" onClick={logoutUser}>
                            Yes Logout!
                        </Button>
                        <DialogClose asChild>
                            <Button>Cancel</Button>
                        </DialogClose>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Profile Image update  */}
            <Dialog open={profileOpen} onOpenChange={setProfileOpen}>
                <DialogContent onInteractOutside={(e) => e.preventDefault()}>
                    <DialogHeader>
                        <DialogTitle>Change profile</DialogTitle>
                        <DialogDescription>
                            Update your profile image!
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={updateProfile}>
                        <div className="mb-4">
                            <Label htmlFor="profile" className='mb-2'>Profile Image</Label>
                            <Input
                                type="file"
                                onChange={handleImageChange}
                                className="file:text-white"
                                accept="image/png,image/svg,image/jpeg,image/webp"
                            />
                            <span className="text-red-400">{errors.profile_image?.[0]}</span>
                        </div>
                        <div className="mb-2">
                            <Button className="w-full" disabled={loading}>
                                {" "}
                                {loading ? "Processing.." : "Update Profile"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>



            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    {user.profile_image ? (
                        <Image
                            src={getImageUrl(user.profile_image)}
                            width={40}
                            height={40}
                            alt="logo"
                            className="rounded-full cursor-pointer"
                        />
                    ) : (
                        <Image
                            src="/avatar.png"
                            width={40}
                            height={40}
                            alt="logo"
                            className="rounded-full cursor-pointer"
                        />
                    )}
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem onClick={() => setProfileOpen(true)}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Billing</span>
                            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Settings</span>
                            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <Keyboard className="mr-2 h-4 w-4" />
                            <span>Keyboard shortcuts</span>
                            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem>
                            <Users className="mr-2 h-4 w-4" />
                            <span>Team</span>
                        </DropdownMenuItem>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>
                                <UserPlus className="mr-2 h-4 w-4" />
                                <span>Invite users</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    <DropdownMenuItem>
                                        <Mail className="mr-2 h-4 w-4" />
                                        <span>Email</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                        <MessageSquare className="mr-2 h-4 w-4" />
                                        <span>Message</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem>
                                        <PlusCircle className="mr-2 h-4 w-4" />
                                        <span>More...</span>
                                    </DropdownMenuItem>
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuItem>
                            <Plus className="mr-2 h-4 w-4" />
                            <span>New Team</span>
                            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                        <LifeBuoy className="mr-2 h-4 w-4" />
                        <span>Support</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                        <Cloud className="mr-2 h-4 w-4" />
                        <span>API</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setLogOutOpen(true)}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                        <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

        </div>
    );
};
