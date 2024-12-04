import appConfig from "@/config";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: appConfig.app.name,
    description: appConfig.app.description,
};