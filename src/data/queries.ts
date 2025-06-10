import { API_URL } from "@/constants";
import type { Place, ResponseType, User } from "@/types";
import { queryOptions } from "@tanstack/react-query";
import { toast } from "sonner";

export function getCurrentUserQueryOptions() {
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

export function getSingleUserQueryOptions(id: string) {
    return queryOptions({
        queryKey: ['users', id],
        staleTime: Infinity,
        queryFn: async () => {
            const response = await fetch(`${API_URL}/users/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${localStorage.getItem("token")}`
                }
            });
            const data = await response.json() as ResponseType<User>;
            if (data.success) return data
            throw new Error(data.error)
        }
    })
}

export function getPlacesQueryOptions() {
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

export function getSinglePlaceQueryOptions(id: string) {
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

            const data = await response.json() as ResponseType<Place & { createdBy: User }>;
            if (data.success) {
                return data.data;
            }
            else {
                throw new Error(data.error)
            }
        }
    })
}

export function sleep(s: number = 1) {
    return new Promise(resolve => setTimeout(resolve, s * 1000));
}
export function getDashboardStatsQueryOptions() {
    return queryOptions({
        queryKey: ["stats"],
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {

            const response = await fetch(`${API_URL}/stats`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json() as ResponseType<{ places: number, users: number }>;
            if (data.success) {
                return data.data;
            }
            else {
                throw new Error(data.error)
            }
        }
    })
}

export function getUsersQueryOptions() {
    return queryOptions({
        queryKey: ["users"],
        staleTime: 5 * 60 * 1000,
        queryFn: async () => {
            const response = await fetch(`${API_URL}/users`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            });
            const data = await response.json() as ResponseType<User[]>;
            if (data.success) {
                return data.data;
            }
            else {
                throw new Error(data.error)
            }
        }
    })
}