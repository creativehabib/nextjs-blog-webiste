import React, {useState} from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {Link as LinkIcon} from "lucide-react";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {Textarea} from "@/components/ui/textarea";
import Image from "next/image";
import {isValidUrl} from "@/lib/utils";
import axios from "axios";
import {toast} from "react-toastify";
import myAxios from "@/lib/axios.config";
import {useSession} from "next-auth/react";
import {CustomUser} from "@/app/api/auth/[...nextauth]/authOptions";
import {POST_URL} from "@/lib/apiEndPoints";
import LoadingSpinner from "@/components/base/Spinner";

export default function AddPost() {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false)
    const [postState, setPostState] = useState<PostStateType>({
        url: '',
        title:'',
        image_url: "",
        description:''
    });
    const [errors, setErrors] = useState({
        url: [],
        image_url: [],
        title: [],
        description: []
    })
    const {data} = useSession()
    const user:CustomUser = data?.user as CustomUser;

    const loadPreview = async () => {
        if(postState?.url && isValidUrl(postState.url!)){
            setLoading(true)
            axios.post("/api/image-preview", {url:postState.url})
                .then(res => {
                    setLoading(false)
                    const response:ImagePreviewResType = res.data?.data;
                    const img = response?.images.length > 0 ? response?.images[0]: 'https://images.unsplash.com/photo-1504194104404-433180773017?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
                    setPostState({
                        ...postState,image_url:img,
                        title:response.title,
                        description:response.description ?? "",
                    });
                })
                .catch(() => {
                    setLoading(false)
                    toast.error("Something went wrong while fetching data from url!");
                })
        }
    }

    const handleSubmit = (event:React.FormEvent) => {
        event.preventDefault();
        setLoading(true)
        myAxios.post(POST_URL,postState,{
            headers:{
                Authorization: `Bearer ${user.token}`
            }
        }).then((res) => {
            const response = res.data
            setLoading(false)
            setPostState({})
            setOpen(false)
            toast.success(response?.message)
        }).catch((err) => {
            setLoading(false);
            if(err.response?.status === 422){
                setErrors(err.response?.data?.errors);
            } else {
                toast.error("Something went wrong please try again!")
            }
        })
    }
    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <div className="flex space-x-3 items-center mb-4 cursor-pointer" onClick={() => setOpen(true)}>
                        <LinkIcon className="w-5 h-5"/>
                        <p>Submit Article</p>
                    </div>
                </DialogTrigger>
                <DialogContent onInteractOutside={(e)=>e.preventDefault()} className="overflow-y-scroll max-h-screen">
                    <DialogHeader>
                        <DialogTitle>Add Post</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        {
                           loading ? <LoadingSpinner/> : postState.image_url && <Image src={postState.image_url} width={450} height={450} alt="image_url"/>
                        }
                        <div className="mb-4">
                            <Label htmlFor="url">Url</Label>
                            <Input
                                type='text'
                                id='url'
                                placeholder='Press your url here...'
                                value={postState.url}
                                onChange={(e) => setPostState({...postState, url: e.target.value})}
                                onBlur={() => loadPreview() }
                            />
                            <span className="text-red-500 text-sm">{errors.url?.[0]}</span>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                type='text'
                                id='title'
                                placeholder='Enter your title here...'
                                value={postState.title}
                                onChange={(e) => setPostState({...postState, title: e.target.value})}
                            />
                            <span className="text-red-500 text-sm">{errors.title?.[0]}</span>
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id='description'
                                placeholder="Enter your description here..."
                                value={postState.description}
                                rows={10}
                                onChange={(e) => setPostState({...postState, description: e.target.value})}
                            />
                            <span className="text-red-500 text-sm">{errors.description?.[0]}</span>
                        </div>
                        <div>
                            <Button className="w-full" disabled={loading}>
                                {loading ? "Processing.." : "Submit"}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}