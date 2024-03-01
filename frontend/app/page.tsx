// @ts-nocheck
"use client";
import { useEffect, useRef, useState } from "react";
import { Button } from "./components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import { Skeleton } from "./components/ui/skeleton";
import { Separator } from "@/app/components/ui/separator";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/app/components/ui/alert-dialog";
import { toast } from "sonner";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/app/components/ui/drawer";

export default function Home() {
  const [uploading, setUploading] = useState(null);
  const [analyizing, setAnalyizing] = useState(null);
  const [comparing, setComparing] = useState(null);
  const [results, setResults] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [uploadPolicyData, setUploadPolicyData] = useState(null);
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const [selectedAIChatPolicy, setselectedAIChatPolicy] = useState(null);
  const [prompt, setPrompt] = useState("")
  const [thinking, setThinking] = useState(false)
  const [response, setResponse] = useState(null)
  const fileRef = useRef(null);

  const UploadCard = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Existing Policy</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between rounded-md items-center align-middle font-cubano mb-2">
            <div className="text-xl">Uploading File</div>
            {uploading === null ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-7 aspect-square"
              >
                <path d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-21.49 301.51v-2.03c.16-13.46 1.48-24.12 4.07-32.05 2.54-7.92 6.19-14.37 10.97-19.25 4.77-4.92 10.51-9.39 17.22-13.46 4.31-2.74 8.22-5.78 11.68-9.18 3.45-3.36 6.19-7.27 8.23-11.69 2.02-4.37 3.04-9.24 3.04-14.62 0-6.4-1.52-11.94-4.57-16.66-3-4.68-7.06-8.28-12.04-10.87-5.03-2.54-10.61-3.81-16.76-3.81-5.53 0-10.81 1.11-15.89 3.45-5.03 2.29-9.25 5.89-12.55 10.77-3.3 4.87-5.23 11.12-5.74 18.74h-32.91c.51-12.95 3.81-23.92 9.85-32.91 6.1-8.99 14.13-15.8 24.08-20.42 10.01-4.62 21.08-6.9 33.16-6.9 13.31 0 24.89 2.43 34.84 7.41 9.96 4.93 17.73 11.83 23.27 20.67 5.48 8.84 8.28 19.1 8.28 30.88 0 8.08-1.27 15.34-3.81 21.79-2.54 6.45-6.1 12.24-10.77 17.27-4.68 5.08-10.21 9.54-16.71 13.41-6.15 3.86-11.12 7.82-14.88 11.93-3.81 4.11-6.56 8.99-8.28 14.58-1.73 5.63-2.69 12.59-2.84 20.92v2.03h-30.94zm16.36 65.82c-5.94-.04-11.02-2.13-15.29-6.35-4.26-4.21-6.35-9.34-6.35-15.33 0-5.89 2.09-10.97 6.35-15.19 4.27-4.21 9.35-6.35 15.29-6.35 5.84 0 10.92 2.14 15.18 6.35 4.32 4.22 6.45 9.3 6.45 15.19 0 3.96-1.01 7.62-2.99 10.87-1.98 3.3-4.57 5.94-7.82 7.87-3.25 1.93-6.86 2.9-10.82 2.94zM417.71 94.29C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.32 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.39 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z" />
              </svg>
            ) : uploading === true ? (
              <div>
                <svg
                  className="w-7 aspect-square text-background animate-spin fill-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                className="w-7 aspect-square"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#c8e6c9"
                  d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
                ></path>
              </svg>
            )}
          </div>
          <div className="flex justify-between rounded-md items-center align-middle font-cubano mb-2">
            <div className="text-xl">Analyizing Policy</div>
            {analyizing === null ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-7 aspect-square"
              >
                <path d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-21.49 301.51v-2.03c.16-13.46 1.48-24.12 4.07-32.05 2.54-7.92 6.19-14.37 10.97-19.25 4.77-4.92 10.51-9.39 17.22-13.46 4.31-2.74 8.22-5.78 11.68-9.18 3.45-3.36 6.19-7.27 8.23-11.69 2.02-4.37 3.04-9.24 3.04-14.62 0-6.4-1.52-11.94-4.57-16.66-3-4.68-7.06-8.28-12.04-10.87-5.03-2.54-10.61-3.81-16.76-3.81-5.53 0-10.81 1.11-15.89 3.45-5.03 2.29-9.25 5.89-12.55 10.77-3.3 4.87-5.23 11.12-5.74 18.74h-32.91c.51-12.95 3.81-23.92 9.85-32.91 6.1-8.99 14.13-15.8 24.08-20.42 10.01-4.62 21.08-6.9 33.16-6.9 13.31 0 24.89 2.43 34.84 7.41 9.96 4.93 17.73 11.83 23.27 20.67 5.48 8.84 8.28 19.1 8.28 30.88 0 8.08-1.27 15.34-3.81 21.79-2.54 6.45-6.1 12.24-10.77 17.27-4.68 5.08-10.21 9.54-16.71 13.41-6.15 3.86-11.12 7.82-14.88 11.93-3.81 4.11-6.56 8.99-8.28 14.58-1.73 5.63-2.69 12.59-2.84 20.92v2.03h-30.94zm16.36 65.82c-5.94-.04-11.02-2.13-15.29-6.35-4.26-4.21-6.35-9.34-6.35-15.33 0-5.89 2.09-10.97 6.35-15.19 4.27-4.21 9.35-6.35 15.29-6.35 5.84 0 10.92 2.14 15.18 6.35 4.32 4.22 6.45 9.3 6.45 15.19 0 3.96-1.01 7.62-2.99 10.87-1.98 3.3-4.57 5.94-7.82 7.87-3.25 1.93-6.86 2.9-10.82 2.94zM417.71 94.29C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.32 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.39 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z" />
              </svg>
            ) : analyizing === true ? (
              <div>
                <svg
                  className="w-7 aspect-square text-background animate-spin fill-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                className="w-7 aspect-square"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#c8e6c9"
                  d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
                ></path>
              </svg>
            )}
          </div>
          <div className="flex justify-between rounded-md items-center align-middle font-cubano mb-2">
            <div className="text-xl">Comparing Benifits</div>
            {comparing === null ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
                className="w-7 aspect-square"
              >
                <path d="M256 0c70.69 0 134.7 28.66 181.02 74.98C483.34 121.31 512 185.31 512 256c0 70.69-28.66 134.7-74.98 181.02C390.7 483.34 326.69 512 256 512c-70.69 0-134.69-28.66-181.02-74.98C28.66 390.7 0 326.69 0 256c0-70.69 28.66-134.69 74.98-181.02C121.31 28.66 185.31 0 256 0zm-21.49 301.51v-2.03c.16-13.46 1.48-24.12 4.07-32.05 2.54-7.92 6.19-14.37 10.97-19.25 4.77-4.92 10.51-9.39 17.22-13.46 4.31-2.74 8.22-5.78 11.68-9.18 3.45-3.36 6.19-7.27 8.23-11.69 2.02-4.37 3.04-9.24 3.04-14.62 0-6.4-1.52-11.94-4.57-16.66-3-4.68-7.06-8.28-12.04-10.87-5.03-2.54-10.61-3.81-16.76-3.81-5.53 0-10.81 1.11-15.89 3.45-5.03 2.29-9.25 5.89-12.55 10.77-3.3 4.87-5.23 11.12-5.74 18.74h-32.91c.51-12.95 3.81-23.92 9.85-32.91 6.1-8.99 14.13-15.8 24.08-20.42 10.01-4.62 21.08-6.9 33.16-6.9 13.31 0 24.89 2.43 34.84 7.41 9.96 4.93 17.73 11.83 23.27 20.67 5.48 8.84 8.28 19.1 8.28 30.88 0 8.08-1.27 15.34-3.81 21.79-2.54 6.45-6.1 12.24-10.77 17.27-4.68 5.08-10.21 9.54-16.71 13.41-6.15 3.86-11.12 7.82-14.88 11.93-3.81 4.11-6.56 8.99-8.28 14.58-1.73 5.63-2.69 12.59-2.84 20.92v2.03h-30.94zm16.36 65.82c-5.94-.04-11.02-2.13-15.29-6.35-4.26-4.21-6.35-9.34-6.35-15.33 0-5.89 2.09-10.97 6.35-15.19 4.27-4.21 9.35-6.35 15.29-6.35 5.84 0 10.92 2.14 15.18 6.35 4.32 4.22 6.45 9.3 6.45 15.19 0 3.96-1.01 7.62-2.99 10.87-1.98 3.3-4.57 5.94-7.82 7.87-3.25 1.93-6.86 2.9-10.82 2.94zM417.71 94.29C376.33 52.92 319.15 27.32 256 27.32c-63.15 0-120.32 25.6-161.71 66.97C52.92 135.68 27.32 192.85 27.32 256c0 63.15 25.6 120.33 66.97 161.71 41.39 41.37 98.56 66.97 161.71 66.97 63.15 0 120.33-25.6 161.71-66.97 41.37-41.38 66.97-98.56 66.97-161.71 0-63.15-25.6-120.32-66.97-161.71z" />
              </svg>
            ) : comparing === true ? (
              <div>
                <svg
                  className="w-7 aspect-square text-background animate-spin fill-primary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
              </div>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                className="w-7 aspect-square"
                viewBox="0 0 48 48"
              >
                <path
                  fill="#c8e6c9"
                  d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                ></path>
                <path
                  fill="#4caf50"
                  d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
                ></path>
              </svg>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const handleFileChange = async (e) => {
    let file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("fileContent", file);
      const results = await axios
        .post("/api/user/compareinsurance", formData, {
          headers: {
            "ngrok-skip-browser-warning": "69420",
          },
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
      setResults(results.data.comparedInsurance);
      setUploadPolicyData(results.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const sendPdfs = async () => {
    const user = await JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    try {
      const response = await axios
        .post(
          "/api/user/getpdf",
          {
            userid: user._id,
            opolicyid: selectedPolicy._id,
            cpolicydata: uploadPolicyData,
          },
          {
            headers: {
              Accept: "application/json",
              Authorization: `Bearer ${token}`,
              "ngrok-skip-browser-warning": "69420",
            },
          }
        )
        .catch((error) => {
          toast.error(error.response.data.message);
        })
        .then(() => {
          toast.success("Pdfs sent successfully, Check your WhatsApp! 🎉");
        });
    } catch (error) {
      console.log(error);
    }
  };

  const sendAIResponse = async () => {
    if(prompt == ""){
      toast.error("Please provide a question...")
      return
    }
    const message = `I have a Medical Insurances Policy, name is ${selectedAIChatPolicy.policyName}, Benfits are ${selectedAIChatPolicy.benifits.map((benifit)=>{let temp = ''; temp += `${benifit}, `; return temp;})}. Cost of policy is Rs. ${selectedAIChatPolicy.premium} per month. Could you ${prompt}`
    setThinking(true)
    console.log(message)
    setResponse("Model is thinking...")
    if (!thinking) {        
        const eventSource = new EventSource(`/api/askme/${message}`);

        eventSource.onmessage = function (event) {
            if (event.data){
                setResponse((res) => res !== "Model is thinking..." ? res + event.data : event.data);
            }
        };            

        eventSource.onerror = function () {
            eventSource.close();
            setThinking(false)
            setResponse(res => res == null ? "Some error occured, Please later :(" : res === "Model is thinking..." || res === "Some error occured, Please later :(" || res.length < 1 ? "Some error occured, Please later :(" : res)
        };
    }

  }

  useEffect(() => {
    if (uploading) {
      setTimeout(() => {
        setUploading(false);
        setAnalyizing(true);
        setTimeout(() => {
          setAnalyizing(false);
          setComparing(true);
          setTimeout(() => {
            setComparing(false);
            setShowResult(true);
          }, 3000);
        }, 4000);
      }, 2000);
    }
  }, [uploading]);

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = localStorage.getItem("token");
    if (!user || !token) {
      window.location = "/login";
    }
    if (user.hasUserId) {
      if (!user.aadharVerified) {
        window.location = "/aadhar";
      }
    } else {
      window.location = "/registerface";
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div className="h-full w-full p-2">
      <Drawer direction="bottom">
        <Button onClick={() => fileRef.current.click()} className="w-full my-2">
          Upload Existing Policy
        </Button>

        <input
          type="file"
          accept="application/pdf"
          ref={fileRef}
          style={{ display: "none" }}
          onChange={handleFileChange}
        />
        <UploadCard />
        <Card className="my-2">
          <CardHeader className="p-3">
            <CardTitle>Results</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {results === null ||
              (!showResult && (
                <>
                  <Skeleton className="w-full h-32 mb-2" />
                  <Skeleton className="w-full h-32" />
                </>
              ))}
            {results !== null && showResult && (
              <div className="flex flex-col gap-2 w-full h-full">
                {results.length > 0 &&
                  results.map((result, index) => {
                    return (
                      <button
                        onClick={() => setSelectedPolicy(result)}
                        key={index}
                        className="w-full border-border focus:border-primary bg-background duration-500 border-2 h-32 rounded-md flex flex-col p-1 group relative"
                      >
                        <div
                          hidden={index === 0 ? false : true}
                          className="bg-primary absolute top-0 right-0 -translate-y-3 text-white px-1 rounded-md text-sm"
                        >
                          Best Choice 🎉
                        </div>
                        <div className="h-1/2 w-full flex align-middle items-center">
                          <img
                            className="max-h-full grayscale group-focus:grayscale-0 duration-500"
                            src={result.logo}
                          />
                          <div className="font-sofiapro font-bold text-green-700 text-center w-full">
                            {uploadPolicyData &&
                              `Save ₹${
                                uploadPolicyData.premium - result.premium
                              }/Month`}
                          </div>
                        </div>
                        <Separator className="bg-primary" />
                        <div className="w-full h-1/2 p-1 text-start font-sofiapro">
                          <div className="h-1/2 flex justify-between">
                            <div className="font-bold">
                              {result.companyName}
                            </div>
                            <div>₹{result.premium}/Month</div>
                          </div>
                          <div className="h-1/2 opacity-50 flex justify-between">
                            <div>{result.policyName}</div>
                            <AlertDialog>
                              <AlertDialogTrigger className="border p-1 flex align-middle items-center rounded-md bg-primary text-background">
                                View Details
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Policy Details
                                  </AlertDialogTitle>
                                  <AlertDialogDescription className="text-start">
                                    {result.benifits.map((benifit, index) => {
                                      return (
                                        <div
                                          key={index}
                                          className="flex justify-between"
                                        >
                                          <div>·{benifit}</div>
                                          <div>
                                            <svg
                                              xmlns="http://www.w3.org/2000/svg"
                                              x="0px"
                                              y="0px"
                                              className="w-4 aspect-square"
                                              viewBox="0 0 48 48"
                                            >
                                              <path
                                                fill="#c8e6c9"
                                                d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"
                                              ></path>
                                              <path
                                                fill="#4caf50"
                                                d="M34.586,14.586l-13.57,13.586l-5.602-5.586l-2.828,2.828l8.434,8.414l16.395-16.414L34.586,14.586z"
                                              ></path>
                                            </svg>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex flex-row gap-2">
                                  <DrawerTrigger
                                    className="w-1/2 border rounded-lg flex  items-center justify-center"
                                    onClick={(e) => {
                                      setselectedAIChatPolicy(result);
                                    }}
                                  >
                                    AI Assist&nbsp;
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      className="w-4 h-4"
                                      viewBox="0 0 1080 1080"
                                      fill="none"
                                    >
                                      <path
                                        d="M515.09 725.824L472.006 824.503C455.444 862.434 402.954 862.434 386.393 824.503L343.308 725.824C304.966 638.006 235.953 568.104 149.868 529.892L31.2779 477.251C-6.42601 460.515 -6.42594 405.665 31.2779 388.929L146.164 337.932C234.463 298.737 304.714 226.244 342.401 135.431L386.044 30.2693C402.239 -8.75637 456.159 -8.75646 472.355 30.2692L515.998 135.432C553.685 226.244 623.935 298.737 712.234 337.932L827.121 388.929C864.825 405.665 864.825 460.515 827.121 477.251L708.53 529.892C622.446 568.104 553.433 638.006 515.09 725.824Z"
                                        fill="url(#paint0_radial_2525_777)"
                                      />
                                      <path
                                        d="M915.485 1036.98L903.367 1064.75C894.499 1085.08 866.349 1085.08 857.481 1064.75L845.364 1036.98C823.765 987.465 784.862 948.042 736.318 926.475L698.987 909.889C678.802 900.921 678.802 871.578 698.987 862.61L734.231 846.951C784.023 824.829 823.623 783.947 844.851 732.75L857.294 702.741C865.966 681.826 894.882 681.826 903.554 702.741L915.997 732.75C937.225 783.947 976.826 824.829 1026.62 846.951L1061.86 862.61C1082.05 871.578 1082.05 900.921 1061.86 909.889L1024.53 926.475C975.987 948.042 937.083 987.465 915.485 1036.98Z"
                                        fill="url(#paint1_radial_2525_777)"
                                      />
                                      <defs>
                                        <radialGradient
                                          id="paint0_radial_2525_777"
                                          cx="0"
                                          cy="0"
                                          r="1"
                                          gradientUnits="userSpaceOnUse"
                                          gradientTransform="translate(670.447 474.006) rotate(78.858) scale(665.5 665.824)"
                                        >
                                          <stop stop-color="#1BA1E3" />
                                          <stop
                                            offset="0.0001"
                                            stop-color="#1BA1E3"
                                          />
                                          <stop
                                            offset="0.300221"
                                            stop-color="#5489D6"
                                          />
                                          <stop
                                            offset="0.545524"
                                            stop-color="#9B72CB"
                                          />
                                          <stop
                                            offset="0.825372"
                                            stop-color="#D96570"
                                          />
                                          <stop
                                            offset="1"
                                            stop-color="#F49C46"
                                          />
                                        </radialGradient>
                                        <radialGradient
                                          id="paint1_radial_2525_777"
                                          cx="0"
                                          cy="0"
                                          r="1"
                                          gradientUnits="userSpaceOnUse"
                                          gradientTransform="translate(670.447 474.006) rotate(78.858) scale(665.5 665.824)"
                                        >
                                          <stop stop-color="#1BA1E3" />
                                          <stop
                                            offset="0.0001"
                                            stop-color="#1BA1E3"
                                          />
                                          <stop
                                            offset="0.300221"
                                            stop-color="#5489D6"
                                          />
                                          <stop
                                            offset="0.545524"
                                            stop-color="#9B72CB"
                                          />
                                          <stop
                                            offset="0.825372"
                                            stop-color="#D96570"
                                          />
                                          <stop
                                            offset="1"
                                            stop-color="#F49C46"
                                          />
                                        </radialGradient>
                                      </defs>
                                    </svg>
                                  </DrawerTrigger>
                                  <AlertDialogCancel className="w-1/2 mt-0">
                                    Close
                                  </AlertDialogCancel>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                {results.length === 0 && (
                  <div className="text-center font-cubano text-primary">
                    You are already on the best-known policy! 🎉
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
        <Button
          disabled={selectedPolicy === null ? true : false}
          onClick={sendPdfs}
          className="w-full my-2"
        >
          Send Pdfs
        </Button>

        {!!selectedAIChatPolicy && (
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle className="text-start text-base">
                Ask details about {selectedAIChatPolicy.policyName} policy!
              </DrawerTitle>
              <div className="flex gap-2">
                <textarea
                  onChange={(e)=>setPrompt(e.target.value)}
                  rows={2}
                  className="border-2 rounded-lg p-1 w-full"
                  placeholder="Tell me more about this policy benifits..."
                />
                <button disabled={thinking} onClick={sendAIResponse} className="bg-black text-white w-16 text-3xl rounded-xl">↑</button>
              </div>
              <div className="font-sofiapro text-start">Output</div>
              <textarea
                value={response}
                rows="5"
                disabled
                className="rounded-lg p-1 border-green-300 border-2"
              ></textarea>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose onClick={()=>{setResponse("");setPrompt("")}}>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        )}
      </Drawer>
    </div>
  );
}
