// @ts-nocheck
"use client";
import React, { useEffect } from "react";

const Page = () => {
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
  return <div>
    hellow
  </div>;
};

export default Page;
