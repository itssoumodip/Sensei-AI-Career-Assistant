import { useState } from "react";
import { toast } from "sonner";

const useFetch = (cb) => {
  const [data, setData] = useState(undefined);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fn = async (...args) => {
    setLoading(true);
    setError(null);

    try {
      const response = await cb(...args);
      setData(response);
      setError(null);
      return response; // Return the response so it can be used in the component
    } catch (error) {
      console.error("API Error:", error);
      setError(error);
      toast.error(error.message || "An unexpected error occurred");
      throw error; // Re-throw the error so it can be caught in the component
    } finally {
      setLoading(false);
    }
  };

  return { data, loading, error, fn, setData };
};

export default useFetch;