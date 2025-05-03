import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

function SellerLogin() {
  const { isSeller, axios, setIsSeller, navigate } = useAppContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmitHandler = async (evt) => {

    try {
      evt.preventDefault();
      const { data } = await axios.post("/api/seller/login", {
        email,
        password,
      });
      if (data.success) {
        setIsSeller(true);
        navigate("/seller");
        toast.success('Welcome back Admin!')
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      console.log("🔴 ERROR: ", err);
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (isSeller) {
      navigate("/seller");
    }
  }, [isSeller]);

  return (
    !isSeller && (
      <form
        onSubmit={onSubmitHandler}
        className="min-h-screen flex items-center text-sm text-gray-600">
        <div className="flex flex-col gap-5 m-auto items-start p-8 py-12 min-w-80 sm:min-w-88 rounded-lg shadow-xl border border-gray-200">
          <p className="text-2xl font-medium m-auto">
            <span className="text-primary hover:text-primary-dull">Seller</span>{" "}
            Login
          </p>
          <div className="w-full">
            <p>Email</p>
            <input
              type="email"
              value={email}
              onChange={(evt) => setEmail(evt.target.value)}
              placeholder="Enter your email"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>
          <div className="w-full">
            <p>Password</p>
            <input
              type="password"
              value={password}
              onChange={(evt) => setPassword(evt.target.value)}
              placeholder="Enter your password"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary"
              required
            />
          </div>
          <button className="bg-primary text-white w-full py-2 rounded-md cursor-pointer hover:bg-primary-dull">
            Login
          </button>
        </div>
      </form>
    )
  );
}

export default SellerLogin;
