import { redirect } from "next/navigation";

// The product now lives on the landing page — keep old links working.
export default function ProductPage() {
  redirect("/#reserve");
}
