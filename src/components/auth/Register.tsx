"use client"
import React, {useState} from 'react';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {TabsContent} from "@/components/ui/tabs";
import myAxios from "@/lib/axios.config";
import {REGISTER_URL} from "@/lib/apiEndPoints";
import {toast} from "react-toastify";
import {signIn} from "next-auth/react";

export default function Register() {
    const [loading, setLoading ] = useState<boolean>(false)
    const [authState, setAuthState ] = useState({
        name: "",
        email: "",
        username: "",
        password: "",
        password_confirmation: "",
    })
    const [errors, setErrors] = useState({
        name:[],
        email: [],
        password:[],
        username:[]
    })
    const handleSubmit = async (e:React.FormEvent) => {
        e.preventDefault();
        setLoading(true)
        myAxios.post(REGISTER_URL, authState)
            .then((res) => {
                setLoading(false)
                toast.success("Account created successfully! we are logging you!");
                signIn('credentials',{
                    email: authState.email,
                    password: authState.password,
                    redirect: true,
                    callbackUrl: "/"
                });
            })
            .catch((err) => {
                setLoading(false)
                if(err.response?.status === 422) {
                    setErrors(err.response?.data?.errors)
                }else{
                    toast.error("Something went wrong.please try again!");
                }
            })
    }
    return(
        <div>
            <TabsContent value="register">
                <Card>
                    <CardHeader>
                        <CardTitle>Register</CardTitle>
                        <CardDescription>
                            Welcome to Daily Dev.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <form onSubmit={handleSubmit}>
                            <div className="space-y-1 mb-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" type="text"
                                       name='name'
                                       placeholder='Enter Name...'
                                       value={authState.name}
                                       onChange={(e) => setAuthState({...authState, name: e.target.value})}
                                />
                                <span className="text-red-500 text-sm">{errors.name?.[0]}</span>
                            </div>
                            <div className="space-y-1 mb-2">
                                <Label htmlFor="username">Username</Label>
                                <Input id="username" type="text"
                                       name='username'
                                       placeholder='Enter Username...'
                                       value={authState.username}
                                       onChange={(e) => setAuthState({...authState, username: e.target.value})}
                                />
                                <span className="text-red-500 text-sm">{errors.username?.[0]}</span>
                            </div>
                            <div className="space-y-1 mb-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email"
                                       name='email'
                                       placeholder='Enter Email...'
                                       value={authState.email}
                                       onChange={(e) => setAuthState({...authState, email: e.target.value})}
                                />
                                <span className="text-red-500 text-sm">{errors.email?.[0]}</span>
                            </div>
                            <div className="space-y-1 mb-2">
                                <Label htmlFor='password'>Password</Label>
                                <Input id="password" type="password"
                                       name='password'
                                       placeholder='Enter Password...'
                                       value={authState.password}
                                       onChange={(e) => setAuthState({...authState, password: e.target.value})}
                                />
                                <span className="text-red-500 text-sm">{errors.password?.[0]}</span>
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor='cpassword'>Confirm Password</Label>
                                <Input id="cpassword" type="password"
                                       name='password_confirmation'
                                       placeholder='Enter Confirm Password...'
                                       value={authState.password_confirmation}
                                       onChange={(e) => setAuthState({
                                           ...authState,
                                           password_confirmation: e.target.value
                                       })}
                                />
                            </div>
                            <div className="mt-4">
                            <Button className='w-full' disabled={loading}>{loading ? 'Processing...' : 'Register'}</Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </TabsContent>
        </div>
    );
}