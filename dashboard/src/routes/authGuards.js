import {intersection} from "lodash/array";
import router from "./index";

router.beforeEach((to, from, next) => {
    const authData = JSON.parse(localStorage.getItem("piczanguAuthData"));
    console.log("auth data", authData);

    // Check if the route requires authentication
    if (to.meta?.requiresAuth) {
        console.log("authenticating");

        // Check if user is authenticated
        if (!authData?.access) {
            // If not authenticated, redirect to the login page
            next({name: "login"});
            console.log("has no credentials");
        } else {
            let user_type_list = [];
            user_type_list.push(
                JSON.parse(
                    localStorage.getItem("piczanguUserDetails")
                )?.is_admin ? 'admin' : JSON.parse(
                    localStorage.getItem("piczanguUserDetails")
                )?.user_type
            );
            const userType = user_type_list || [];
            console.log("user is of type", userType);

            // Get required permissions for the route
            const requiredRoutePermissions = to.meta.allowed_roles || [];
            console.log("required permisions", requiredRoutePermissions);

            // Find intersection of user's permissions and required permissions for the route
            const intersectingPerms = intersection(
                userType,
                requiredRoutePermissions
            );
            console.log(intersectingPerms, "intersect");

            // If there's at least one intersecting permission, allow access
            if (intersectingPerms.length > 0) {
                next();
                console.log(intersectingPerms, "intersect");
            } else {
                next();

                // If no intersecting permission, redirect to unauthorized page
                // next({name: "unauthorised"});
                console.log("unauthorised");
            }
        }
    } else {
        // If the route does not require authentication, proceed
        console.log("No authentication required.");
        next();
    }
});

export default router;
