"use client"
import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {TabsContent} from "@/components/ui/tabs";
import myAxios from "@/lib/axios.config";
import { toast } from "react-toastify";
import { signIn } from "next-auth/react";
import {CHECK_CREDENTIALS, LOGIN_URL} from "@/lib/apiEndPoints";

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({
        email: [],
        password: []
    });
    const [authState, setAuthState] = useState({
        email: '',
        password: '',
    })
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        myAxios.post(CHECK_CREDENTIALS,authState).then((res) => {
            setLoading(false)
            const response = res.data;
            if (response?.status === 200) {
                signIn("credentials",{
                    email: authState.email,
                    password: authState.password,
                    redirect: true,
                    callbackUrl: "/",
                })
                toast.success(response?.message)
            } else if(response?.status === 401) {
                toast.error(response?.message);
            }
        }) .catch((error) => {
            setLoading(false)
            if (error.response?.status === 422) {
                setErrors(error.response?.data?.errors)
            }else {
                toast.error("Something went wrong.please try again!");
            }
        })
    }
    return(
        <div>
            <TabsContent value="login">
                <Card>
                    <CardHeader>
                        <CardTitle>Login</CardTitle>
                        <CardDescription>
                            Welcome to Daily.dev
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-1 mb-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type={"email"} placeholder="Enter email..." value={authState.email}
                                       onChange={(e) => setAuthState({...authState, email: e.target.value})}/>
                                <span className="text-sm text-red-500">{errors?.email?.[0]}</span>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="password">Password</Label>
                                <Input id="password" type="password" placeholder="Enter password..."
                                       value={authState.password}
                                       onChange={(e) => setAuthState({...authState, password: e.target.value})}/>
                                <span className="text-sm text-red-500">{errors?.password?.[0]}</span>
                            </div>
                            <div className="mt-4">
                            <Button className='w-full' disabled={loading}>{loading ? 'Processing...' : 'Login'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
    );
}