import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { checkAuthFn } from "@/lib/auth.functions";

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: async ({ location }) => {
    const { user } = await checkAuthFn();
    if (!user) {
      throw redirect({ to: "/auth", search: { redirect: location.href } });
    }
    return { user };
  },
  component: () => <Outlet />,
});
