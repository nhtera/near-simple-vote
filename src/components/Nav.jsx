import SignInBtn from './Auth/SignInBtn';
import { Link, useLocation } from "react-router-dom";

export default function Nav() {
    return (<nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
    <Link to="new-post" className="mr-5 hover:text-black-500">New Post</Link>
    <SignInBtn />
</nav>)
}
