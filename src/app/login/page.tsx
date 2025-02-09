"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import "@/cssFiles/homeanimations.css";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user.email.length > 0 && user.password.length > 0) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [user]);

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
  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-xl bg-white">
        <CardHeader>
          <CardTitle className="text-center text-3xl font-bold">Log In</CardTitle>
          <p className="text-center text-gray-500">Sign in to continue</p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <Input
                value={user.email}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                type="email"
                placeholder="Enter your email"
                className="mt-1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <Input
                value={user.password}
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                type="password"
                placeholder="Enter your password"
                className="mt-1"
              />
            </div>
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>Remember me</span>
              </label>
              <Link href="/forgotpassword" className="text-blue-600 hover:underline">
                Forgot password?
              </Link>
            </div>
             <Button
              onClick={onLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2"
            >
              {/* {loading ? <Loader2 className="animate-spin w-5 h-5" /> : "Login"} */}
            </Button> 
          </form>
          <p className="text-center text-sm mt-4">
            Don't have an account?
            <Link href="/signup" className="text-blue-600 hover:underline ml-1">
              Sign up!
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
    </>
  );
}
