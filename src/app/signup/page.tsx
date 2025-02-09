"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import "@/cssFiles/homeanimations.css";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Loader2 } from "lucide-react";


export default function SignupPage() {
  const router = useRouter();

  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      await axios.post("api/users/login", user).then((response) => {
        if (response.data.success == false) {
          toast.error(response.data.message, { icon: "👏" });
        } else {
          toast.success("Login Successful");
          location.reload();
          router.push("/");
        }
      });
    } catch (error: any) {
      console.log("login failed", error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const onSignup = async () => {
    if (user.email == "" || user.password == "" || user.username == "") {
      toast.error("please fill all the fields");
      return;
    }
    try {
      const t = toast.loading("please wait...");
      setLoading(true);
      axios.post("api/users/signup", user).then(() => {
        toast.dismiss(t);
        toast.success("user successfully created");
        onLogin();
      });
    } catch (error: any) {
      toast.error(error.message);
      console.log(error);
    }
  };

  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.username.length > 0 &&
      user.password.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-2xl bg-white p-8">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-extrabold text-gray-800">Welcome Back</CardTitle>
          <p className="text-gray-500">Sign in to continue</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div>
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <Input
                value={user.username}
                onChange={(e) => setUser({ ...user, username: e.target.value })}
                type="text"
                placeholder="Enter your username"
                className="mt-2 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                type="email"
                placeholder="Enter your email"
                className="mt-2 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
                placeholder="Enter your password"
                className="mt-2 w-full rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox accent-blue-500" />
                <p>Remember me</p>
              </label>
              <Link href="/forgotpassword" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Button
              onClick={onSignup}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold shadow-md"
            >
              {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Signup"}
            </Button>
          </form>
          <p className="text-center text-sm mt-5">
            Already have an account?
            <Link href="/signup" className="text-blue-600 hover:underline ml-1 font-semibold">
              Sign in!
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
