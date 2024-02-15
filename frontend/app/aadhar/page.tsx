// @ts-nocheck
"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/app/components/ui/button";
import axios from "axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const frontref = useRef<HTMLInputElement>(null);
  const backref = useRef<HTMLInputElement>(null);
  const [backEnabled, setBackEnabled] = useState(false);
  const [frontImg, setFrontImg] = useState("https://webobjects2.cdw.com/is/image/CDW/4575189?$product-main$")
  const [backImg, setBackImg] = useState("https://webobjects2.cdw.com/is/image/CDW/4575189?$product-main$")

  const handleFront = async (event) => {
    const user = await JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("fileContent", file);
    formData.append("id", user._id);
    formData.append("name", user.name);
    formData.append("fname", user.fname);

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    };

    try {
      const response = await axios.post(
        "/api/user/confirmaadharfront",
        formData,
        { headers }
      );
      if (response.data.success) {
        setFrontImg(URL.createObjectURL(file));
        toast.success("Front side verified successfully");
        setBackEnabled(true);
      } else {
        toast.error(response.data.message || "Error verifying front side");
      }
    } catch (error) {
      console.error("Error sending file to backend:", error);
    }
  };

  const handleBack = async (event) => {
    const user = await JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    const file = event.target.files[0];
    const formData = new FormData();
    formData.append("fileContent", file);
    formData.append("id", user._id);

    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    };

    try {
      const response = await axios.post(
        "/api/user/confirmaadharback",
        formData,
        { headers }
      );
      if (response.data.success) {
        localStorage.setItem("user", JSON.stringify(response.data.user))
        setBackImg(URL.createObjectURL(file));
        toast.success("Back side verified successfully");
        setTimeout(() => {
            router.push("/")
        }, 2000);        
      } else {
        toast.error("Error verifying back side");
      }
    } catch (error) {
      console.error("Error sending file to backend:", error);
    }
  };

  useEffect(() => {
    let user = JSON.parse(localStorage.getItem("user"));
    let token = localStorage.getItem("token");
    if (!user || !token) {
      window.location = "/login";
    }
    if (user.hasUserId) {
      if (user.aadharVerified) {
        window.location = "/";
      }
    } else {
      window.location = "/registerface";
    }
    //eslint-disable-next-line
  }, []);

  return (
    <div className="h-full">
      <div className="text-center font-cubano text-xl py-5">
        Verify Aadhar Card
      </div>
      <div className="p-2 mb-10">
        <div className="grid gap-2 mb-2">
          <img
            alt="Front"
            className="aspect-video overflow-hidden rounded-lg object-bottom"
            src={frontImg}
            width="100%"
          />
          <Button
            onClick={() => frontref.current.click()}
            disabled={backEnabled}
            className="w-full"
          >
            Select Front
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={frontref}
            disabled={backEnabled}
            style={{ display: "none" }}
            onChange={handleFront}
          />
        </div>
        <div className="grid gap-2">
          <img
            alt="Back"
            className="aspect-video overflow-hidden rounded-lg object-bottom"
            src={backImg}
            width="100%"
          />
          <Button
            onClick={() => backref.current.click()}
            disabled={!backEnabled}
            className="w-full"
          >
            Select Back
          </Button>
          <input
            type="file"
            accept="image/*"
            ref={backref}
            disabled={!backEnabled}
            style={{ display: "none" }}
            onChange={handleBack}
          />
        </div>
      </div>
    </div>
  );
};

export default Page;
