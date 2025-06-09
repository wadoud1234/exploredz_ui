import { API_URL } from "@/constants";
import type { Place, ResponseType, User } from "@/types";
import { queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export function getUserQueryOptions() {
    return queryOptions({
        queryKey: ['user'],
        staleTime: Infinity,
        queryFn: async () => {
            const response = await fetch(`${API_URL}/auth/me`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });

            const data = await response.json() as ResponseType<{ user: User }>;
            if (data.success) return data
            throw new Error(data.error)
        }
    })
}

export function usePlacesQueryOptions() {
    return queryOptions({
        queryKey: ["places"],
        staleTime: 5 * 60 * 1000,

        queryFn: async () => {
            const response = await fetch(`${API_URL}/places`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json() as ResponseType<Place[]>;
            if (data.success) {
                return data.data;
            }
            else {
                toast.error("Fetching Failed", { description: data.error });
                throw new Error(data.error)
            }
        },
    })
}

export function useSinglePlaceQueryOptions(id: string) {
    return queryOptions({
        queryKey: ["places", id],
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const response = await fetch(`${API_URL}/places/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });

            const data = await response.json() as ResponseType<Place>;
            if (data.success) {
                return data.data;
            }
            else {
                throw new Error(data.error)
            }
        }
    })
}
