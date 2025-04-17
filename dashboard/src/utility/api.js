import axios from "axios";
import {baseUrl} from "@/utility/constants";

export default axios.create({
    baseUrl: baseUrl,
});
